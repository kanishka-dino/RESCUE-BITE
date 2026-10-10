package org.rescuebite.service;

import org.rescuebite.model.AuditLog;
import org.rescuebite.model.VerificationRequest;
import org.rescuebite.repository.AuditLogRepository;
import org.rescuebite.repository.VerificationRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final VerificationRequestRepository verificationRequestRepository;
    private final AuditLogRepository auditLogRepository;

    public AdminService(VerificationRequestRepository verificationRequestRepository,
                        AuditLogRepository auditLogRepository) {
        this.verificationRequestRepository = verificationRequestRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public List<VerificationRequest> getVerifications(String status) {
        if (status != null && !status.isEmpty()) {
            return verificationRequestRepository.findByStatus(status);
        }
        return verificationRequestRepository.findAll();
    }

    @Transactional
    public VerificationRequest updateVerificationStatus(Long id, String newStatus, String adminName) {
        VerificationRequest req = verificationRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Verification request not found: " + id));

        req.setStatus(newStatus);
        VerificationRequest saved = verificationRequestRepository.save(req);

        auditLogRepository.save(new AuditLog(
                null,
                "ORG_VERIFICATION_" + newStatus.toUpperCase(),
                adminName,
                "admin",
                "Organization '" + req.getOrgName() + "' was marked " + newStatus,
                newStatus.equalsIgnoreCase("approved") ? "info" : "warning"
        ));

        return saved;
    }

    public List<AuditLog> getAuditLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }
}
