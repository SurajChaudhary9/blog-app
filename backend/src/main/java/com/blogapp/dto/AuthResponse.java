package com.blogapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private Boolean success;
    private String message;
    private String token;

    @JsonProperty("refresh_token")
    private String refreshToken;

    private UserResponse user;

    @JsonProperty("expires_in")
    private Long expiresIn;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserResponse {
        private UUID id;
        private String email;
        private String firstName;
        private String lastName;
        private Boolean emailVerified;
    }
}
