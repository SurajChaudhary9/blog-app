package com.blogapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private Boolean success;
    private String message;
    private String token;
    private String refreshToken;
    private UserDto user;
    private Long expiresIn;
}
