package com.blogapp.repository;

import com.blogapp.entity.PasswordResetToken;
import com.blogapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUserAndUsedTrue(User user);
    void deleteByExpiryDateBefore(LocalDateTime date);
}
