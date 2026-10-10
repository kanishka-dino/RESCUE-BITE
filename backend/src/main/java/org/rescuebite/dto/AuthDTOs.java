package org.rescuebite.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.rescuebite.model.enums.UserRole;

public class AuthDTOs {

    public static class LoginRequest {
        @NotBlank @Email
        private String email;

        @NotBlank
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        @NotBlank @Email
        private String email;

        @NotBlank
        private String password;

        @NotBlank
        private String name;

        @NotBlank
        private String phone;

        private UserRole role = UserRole.ROLE_DONOR;

        @NotBlank
        private String organizationName;

        private String organizationType = "Restaurant";
        private String address = "Central Metro";
        private String city = "Metro City";

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public UserRole getRole() { return role; }
        public void setRole(UserRole role) { this.role = role; }
        public String getOrganizationName() { return organizationName; }
        public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }
        public String getOrganizationType() { return organizationType; }
        public void setOrganizationType(String organizationType) { this.organizationType = organizationType; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
    }

    public static class AuthResponse {
        private String token;
        private Long userId;
        private String name;
        private String email;
        private String role;
        private String organizationName;

        public AuthResponse(String token, Long userId, String name, String email, String role, String organizationName) {
            this.token = token;
            this.userId = userId;
            this.name = name;
            this.email = email;
            this.role = role;
            this.organizationName = organizationName;
        }

        public String getToken() { return token; }
        public Long getUserId() { return userId; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
        public String getOrganizationName() { return organizationName; }
    }
}
