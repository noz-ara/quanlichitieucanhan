package com.example.backend.dto;

import com.example.backend.model.SplitType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class BillCreateRequest {
    @NotNull
    private BigDecimal totalAmount;

    // paidBy có thể là "USER" kèm userId hoặc "CONTACT" kèm contactId; để đơn giản cho FE: truyền paidBy như string username hoặc contactId prefix
    private Long paidByUserId;     // optional
    private Long paidByContactId;  // optional

    @NotNull
    private SplitType splitType;

    @NotNull
    private List<ParticipantRequest> participants;

    @Data
    public static class ParticipantRequest {
        private Long userId;       // optional
        private Long contactId;    // optional
        private BigDecimal percent; // if PERCENT
        private BigDecimal amount;  // if CUSTOM
    }
}


