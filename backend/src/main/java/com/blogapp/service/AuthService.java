package com.blogapp.service;

import com.blogapp.dto.*;
import com.blogapp.entity.PasswordResetToken;
import com.blogapp.entity.User;
import com.blogapp.exception.BadRequestException;
import com.blogapp.exception.ResourceNotFoundException;
import com.blogapp.exception.UnauthorizedException;
import com.blogapp.repository.PasswordResetTokenRepository;
import com.blogapp.security.JwtTokenProvider;
import com.blogapp.security.TokenBlacklist;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Slf4j
@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenBlacklist tokenBlacklist;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        log.info("Processing signup for email: {}", request.getEmail());

        User user = userService.createUser(request);
        emailService.sendVerificationEmail(user.getEmail(), user.getFirstName());

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail(), user.getId());

        return AuthResponse.builder()
                .success(true)
                .message("Signup successful. Please check your email.")
                .token(token)
                .refreshToken(refreshToken)
                .user(buildUserResponse(user))
                .expiresIn(3600L)
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Processing login for email: {}", request.getEmail());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            User user = (User) authentication.getPrincipal();
            userService.updateLastLogin(user.getId());

            String token = jwtTokenProvider.generateToken(user.getEmail(), user.getId());
            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail(), user.getId());

            return AuthResponse.builder()
                    .success(true)
                    .message("Login successful")
                    .token(token)
                    .refreshToken(refreshToken)
                    .user(buildUserResponse(user))
                    .expiresIn(3600L)
                    .build();
        } catch (AuthenticationException e) {
            log.warn("Login failed for email: {}", request.getEmail());
            throw new UnauthorizedException("Invalid email or password");
        }
    }

    @Transactional
    public ApiResponse<Void> forgotPassword(ForgotPasswordRequest request) {
        log.info("Processing forgot password for email: {}", request.getEmail());

        User user = userService.getUserByEmail(request.getEmail());
        String resetToken = generateResetToken();

        PasswordResetToken token = PasswordResetToken.builder()
                .token(resetToken)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(24))
                .used(false)
                .build();

        passwordResetTokenRepository.save(token);
        emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), resetToken);

        log.info("Password reset token generated for user: {}", user.getId());
        return ApiResponse.success("Password reset link sent to your email");
    }

    @Transactional
    public ApiResponse<Void> resetPassword(ResetPasswordRequest request) {
        log.info("Processing password reset with token");

        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> {
                    log.warn("Invalid reset token provided");
                    return new BadRequestException("Invalid or expired reset token");
                });

        if (resetToken.getUsed()) {
            log.warn("Reset token already used");
            throw new BadRequestException("Reset token has already been used");
        }

        if (resetToken.isExpired()) {
            log.warn("Reset token expired");
            throw new BadRequestException("Reset token has expired");
        }

        User user = resetToken.getUser();
        userService.changePassword(user.getId(), request.getNewPassword());

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        emailService.sendPasswordResetSuccessEmail(user.getEmail(), user.getFirstName());
        log.info("Password reset successful for user: {}", user.getId());

        return ApiResponse.success("Password reset successful");
    }

    @Transactional
    public ApiResponse<Void> logout(String token) {
        log.info("Processing logout");

        if (jwtTokenProvider.validateToken(token)) {
            long expirationTime = jwtTokenProvider.getExpirationTimeFromToken(token);
            LocalDateTime expiryDate = java.time.Instant.ofEpochMilli(expirationTime)
                    .atZone(java.time.ZoneId.systemDefault())
                    .toLocalDateTime();
            tokenBlacklist.addToken(token, expiryDate);
            log.info("Token added to blacklist");
        }

        return ApiResponse.success("Logout successful");
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        log.info("Processing token refresh");

        String refreshToken = request.getRefreshToken();

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            log.warn("Invalid refresh token provided");
            throw new UnauthorizedException("Invalid refresh token");
        }

        UUID userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        String email = jwtTokenProvider.getEmailFromToken(refreshToken);

        String newToken = jwtTokenProvider.generateToken(email, userId);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(email, userId);

        User user = userService.getUserById(userId);

        return AuthResponse.builder()
                .success(true)
                .message("Token refreshed successfully")
                .token(newToken)
                .refreshToken(newRefreshToken)
                .user(buildUserResponse(user))
                .expiresIn(3600L)
                .build();
    }

    private String generateResetToken() {
        SecureRandom random = new SecureRandom();
        byte[] tokenBytes = new byte[32];
        random.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }

    private AuthResponse.UserResponse buildUserResponse(User user) {
        return AuthResponse.UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .emailVerified(user.getEmailVerified())
                .build();
    }
}
