package com.example.backend.service;

import com.example.backend.dto.BillCreateRequest;
import com.example.backend.dto.BillResponse;
import com.example.backend.model.*;
import com.example.backend.repository.BillParticipantRepository;
import com.example.backend.repository.BillRepository;
import com.example.backend.repository.ContactRepository;
import com.example.backend.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class BillService {

    private final BillRepository billRepository;
    private final BillParticipantRepository billParticipantRepository;
    private final UserRepository userRepository;
    private final ContactRepository contactRepository;

    @Transactional
    public Bill create(@Valid BillCreateRequest request, User owner) {
        Bill bill = new Bill();
        bill.setOwner(owner);
        bill.setTotalAmount(request.getTotalAmount());
        bill.setSplitType(request.getSplitType());

        if (request.getPaidByUserId() != null) {
            User payer = userRepository.findById(request.getPaidByUserId())
                    .orElseThrow(() -> new IllegalArgumentException("PaidBy user not found"));
            bill.setPaidByUser(payer);
        } else if (request.getPaidByContactId() != null) {
            Contact payer = contactRepository.findById(request.getPaidByContactId())
                    .orElseThrow(() -> new IllegalArgumentException("PaidBy contact not found"));
            bill.setPaidByContact(payer);
        } else {
            bill.setPaidByUser(owner);
        }

        Bill saved = billRepository.save(bill);

        // participants
        List<BillParticipant> participantEntities = new ArrayList<>();
        for (BillCreateRequest.ParticipantRequest p : request.getParticipants()) {
            BillParticipant bp = new BillParticipant();
            bp.setBill(saved);
            if (p.getUserId() != null) {
                User u = userRepository.findById(p.getUserId())
                        .orElseThrow(() -> new IllegalArgumentException("Participant user not found"));
                bp.setUser(u);
            }
            if (p.getContactId() != null) {
                Contact c = contactRepository.findById(p.getContactId())
                        .orElseThrow(() -> new IllegalArgumentException("Participant contact not found"));
                bp.setContact(c);
            }
            bp.setPercent(p.getPercent());
            bp.setAmount(p.getAmount());
            participantEntities.add(bp);
        }

        billParticipantRepository.saveAll(participantEntities);
        saved.setParticipants(participantEntities);
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Bill> getMyBills(User owner) {
        return billRepository.findByOwnerOrderByIdDesc(owner);
    }

    @Transactional(readOnly = true)
    public Bill getByIdAndOwned(Long id, User owner) {
        Bill bill = billRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Bill not found"));
        if (!Objects.equals(bill.getOwner().getId(), owner.getId())) {
            throw new IllegalArgumentException("Access denied");
        }
        return bill;
    }

    @Transactional
    public void deleteById(Long id, User owner) {
        Bill bill = getByIdAndOwned(id, owner);
        billRepository.delete(bill);
    }

    @Transactional(readOnly = true)
    public BillResponse computeResponse(Bill bill) {
        BillResponse resp = new BillResponse();
        resp.setId(bill.getId());
        resp.setTotalAmount(bill.getTotalAmount());
        resp.setSplitType(bill.getSplitType());

        BillResponse.PayerDto payerDto = new BillResponse.PayerDto();
        if (bill.getPaidByUser() != null) {
            payerDto.setType("USER");
            payerDto.setId(bill.getPaidByUser().getId());
            payerDto.setName(bill.getPaidByUser().getUsername());
        } else if (bill.getPaidByContact() != null) {
            payerDto.setType("CONTACT");
            payerDto.setId(bill.getPaidByContact().getId());
            payerDto.setName(bill.getPaidByContact().getName());
        }
        resp.setPaidBy(payerDto);

        // Compute shares per participant
        List<BillResponse.ParticipantDto> participantDtos = new ArrayList<>();
        List<BillParticipant> participants = bill.getParticipants();
        BigDecimal total = bill.getTotalAmount();

        switch (bill.getSplitType()) {
            case EQUAL -> {
                BigDecimal each = total.divide(BigDecimal.valueOf(participants.size()), 0, RoundingMode.DOWN);
                for (BillParticipant bp : participants) {
                    BillResponse.ParticipantDto dto = toParticipantDto(bp);
                    dto.setAmount(each);
                    participantDtos.add(dto);
                }
            }
            case PERCENT -> {
                for (BillParticipant bp : participants) {
                    BigDecimal percent = bp.getPercent() == null ? BigDecimal.ZERO : bp.getPercent();
                    BigDecimal share = total.multiply(percent).divide(BigDecimal.valueOf(100), 0, RoundingMode.DOWN);
                    BillResponse.ParticipantDto dto = toParticipantDto(bp);
                    dto.setPercent(percent);
                    dto.setAmount(share);
                    participantDtos.add(dto);
                }
            }
            case CUSTOM -> {
                for (BillParticipant bp : participants) {
                    BigDecimal share = bp.getAmount() == null ? BigDecimal.ZERO : bp.getAmount();
                    BillResponse.ParticipantDto dto = toParticipantDto(bp);
                    dto.setAmount(share);
                    participantDtos.add(dto);
                }
            }
        }

        resp.setParticipants(participantDtos);

        // Compute debts: everyone owes the payer their share, minus if payer also a participant
        String payerName = payerDto.getName();
        List<BillResponse.DebtDto> debts = new ArrayList<>();

        // Determine payer's own share (used to document net, but not required further now)
        participantDtos.stream()
                .filter(p -> Objects.equals(p.getName(), payerName))
                .map(BillResponse.ParticipantDto::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        for (BillResponse.ParticipantDto p : participantDtos) {
            if (!Objects.equals(p.getName(), payerName)) {
                BillResponse.DebtDto d = new BillResponse.DebtDto();
                d.setFromName(p.getName());
                d.setToName(payerName);
                d.setAmount(p.getAmount());
                debts.add(d);
            }
        }

        resp.setDebts(debts);
        return resp;
    }

    private BillResponse.ParticipantDto toParticipantDto(BillParticipant bp) {
        BillResponse.ParticipantDto dto = new BillResponse.ParticipantDto();
        if (bp.getUser() != null) {
            dto.setType("USER");
            dto.setId(bp.getUser().getId());
            dto.setName(bp.getUser().getUsername());
        } else if (bp.getContact() != null) {
            dto.setType("CONTACT");
            dto.setId(bp.getContact().getId());
            dto.setName(bp.getContact().getName());
        }
        return dto;
    }
}


