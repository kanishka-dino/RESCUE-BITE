package org.rescuebite.service;

import org.rescuebite.dto.AuthDTOs.*;
import org.rescuebite.model.User;
import org.rescuebite.model.VerificationRequest;
import org.rescuebite.model.enums.UserRole;
import org.rescuebite.repository.UserRepository;
import org.rescuebite.repository.VerificationRequestRepository;
import org.rescuebite.security.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final VerificationRequestRepository verificationRequestRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository,
                       VerificationRequestRepository verificationRequestRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.verificationRequestRepository = verificationRequestRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials provided");
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name(), user.getId());

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getOrganizationName()
        );
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered: " + request.getEmail());
        }

        boolean isDonor = request.getRole() == UserRole.ROLE_DONOR;

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getName(),
                request.getPhone(),
                request.getRole(),
                request.getOrganizationName(),
                request.getOrganizationType(),
                request.getAddress(),
                request.getCity(),
                isDonor // Donors are auto-cleared; Recipient NGOs queue for verification
        );

        User savedUser = userRepository.save(user);

        // If recipient, add to verification queue
        if (!isDonor) {
            VerificationRequest vReq = new VerificationRequest();
            vReq.setOrgName(user.getOrganizationName());
            vReq.setOrgType(user.getOrganizationType());
            vReq.setRegistrationNumber("NGO-PENDING-" + savedUser.getId());
            vReq.setContactPerson(user.getName());
            vReq.setEmail(user.getEmail());
            vReq.setPhone(user.getPhone());
            vReq.setAddress(user.getAddress());
            vReq.setCity(user.getCity());
            vReq.setStatus("pending");
            verificationRequestRepository.save(vReq);
        }

        String token = jwtUtils.generateToken(savedUser.getEmail(), savedUser.getRole().name(), savedUser.getId());

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                savedUser.getOrganizationName()
        );
    }
}
