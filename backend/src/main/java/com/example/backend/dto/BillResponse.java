package com.example.backend.dto;

import com.example.backend.model.SplitType;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class BillResponse {
    private Long id;
    private BigDecimal totalAmount;
    private SplitType splitType;
    private PayerDto paidBy;
    private List<ParticipantDto> participants;
    private List<DebtDto> debts; // computed: who owes whom and how much

    @Data
    public static class PayerDto {
        private String type; // USER or CONTACT
        private Long id;
        private String name;
    }

    @Data
    public static class ParticipantDto {
        private String type; // USER or CONTACT
        private Long id;
        private String name;
        private BigDecimal amount;  // share amount
        private BigDecimal percent; // if percent split
    }

    @Data
    public static class DebtDto {
        private String fromName;
        private String toName;
        private BigDecimal amount;
    }
}


