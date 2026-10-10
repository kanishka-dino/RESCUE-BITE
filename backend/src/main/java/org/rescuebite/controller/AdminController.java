package org.rescuebite.controller;

import org.rescuebite.model.AuditLog;
import org.rescuebite.model.VerificationRequest;
import org.rescuebite.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/verifications")
    public ResponseEntity<List<VerificationRequest>> getVerifications(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(adminService.getVerifications(status));
    }

    @PatchMapping("/verifications/{id}")
    public ResponseEntity<VerificationRequest> updateVerificationStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication) {
        String adminName = authentication != null ? authentication.getName() : "Elena Vance (Admin)";
        return ResponseEntity.ok(adminService.updateVerificationStatus(id, status, adminName));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(adminService.getAuditLogs());
    }
}
