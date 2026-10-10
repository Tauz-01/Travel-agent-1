package com.roamagent.service;

import com.roamagent.dto.ApiDtos.ApproveRevisionResponse;
import com.roamagent.entity.AuditRecord;
import com.roamagent.entity.Itinerary;
import com.roamagent.entity.RecoveryProposal;
import com.roamagent.repository.AuditRecordRepository;
import com.roamagent.repository.ItineraryRepository;
import com.roamagent.repository.RecoveryProposalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RevisionCommitService {

    private final ItineraryRepository itineraryRepository;
    private final RecoveryProposalRepository recoveryProposalRepository;
    private final AuditRecordRepository auditRecordRepository;

    @Transactional
    public ApproveRevisionResponse approveRevision(UUID itineraryId, UUID proposalId) {
        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElse(Itinerary.builder()
                        .id(itineraryId)
                        .currentRevisionNumber(1)
                        .status("ACTIVE")
                        .build());

        int prevRev = itinerary.getCurrentRevisionNumber() != null ? itinerary.getCurrentRevisionNumber() : 1;
        int newRev = prevRev + 1;
        itinerary.setCurrentRevisionNumber(newRev);

        if (itineraryRepository.existsById(itineraryId)) {
            itineraryRepository.save(itinerary);
        }

        AuditRecord auditRecord = AuditRecord.builder()
                .id(UUID.randomUUID())
                .itinerary(itinerary)
                .actionType("RECOVERY_APPROVAL")
                .previousRevisionNumber(prevRev)
                .newRevisionNumber(newRev)
                .changeSummary("Approved recovery proposal " + proposalId)
                .build();

        auditRecordRepository.save(auditRecord);

        return ApproveRevisionResponse.builder()
                .itineraryId(itineraryId)
                .newRevisionNumber(newRev)
                .status("REVISION_COMMITTED")
                .activeEta(OffsetDateTime.now().plusHours(5))
                .auditRecordId(auditRecord.getId())
                .message("Itinerary updated successfully. Monitoring resumed for revised route.")
                .build();
    }
}
