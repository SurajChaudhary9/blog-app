package com.blogapp.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.frontend-url}")
    private String frontendUrl;

    @Async
    public void sendVerificationEmail(String to, String firstName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Welcome to Blog App - Verify Your Email");
            message.setText(
                    "Hello " + firstName + ",\n\n" +
                    "Welcome to Blog App! Your email has been registered.\n\n" +
                    "Thank you for signing up.\n\n" +
                    "Best regards,\nBlog App Team"
            );
            mailSender.send(message);
            log.info("Verification email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send verification email to: {}", to, e);
        }
    }

    @Async
    public void sendPasswordResetEmail(String to, String firstName, String resetToken) {
        try {
            String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Password Reset Request - Blog App");
            message.setText(
                    "Hello " + firstName + ",\n\n" +
                    "We received a request to reset your password. If you didn't request this, you can ignore this email.\n\n" +
                    "Click the link below to reset your password:\n" +
                    resetLink + "\n\n" +
                    "This link will expire in 24 hours.\n\n" +
                    "Best regards,\nBlog App Team"
            );
            mailSender.send(message);
            log.info("Password reset email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", to, e);
        }
    }

    @Async
    public void sendPasswordResetSuccessEmail(String to, String firstName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Password Reset Successful - Blog App");
            message.setText(
                    "Hello " + firstName + ",\n\n" +
                    "Your password has been successfully reset. You can now log in with your new password.\n\n" +
                    "If you didn't request this, please contact our support team immediately.\n\n" +
                    "Best regards,\nBlog App Team"
            );
            mailSender.send(message);
            log.info("Password reset success email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send password reset success email to: {}", to, e);
        }
    }
}
