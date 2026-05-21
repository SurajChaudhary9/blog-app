package com.blogapp.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class TokenBlacklist {

    private final ConcurrentHashMap<String, LocalDateTime> blacklistedTokens = new ConcurrentHashMap<>();

    public void addToken(String token, LocalDateTime expiryDate) {
        blacklistedTokens.put(token, expiryDate);
        log.debug("Token added to blacklist, total blacklisted tokens: {}", blacklistedTokens.size());
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.containsKey(token);
    }

    @Scheduled(fixedRate = 3600000) // Run every hour
    public void removeExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        int beforeSize = blacklistedTokens.size();
        blacklistedTokens.entrySet().removeIf(entry -> entry.getValue().isBefore(now));
        int afterSize = blacklistedTokens.size();
        log.debug("Removed {} expired tokens from blacklist", beforeSize - afterSize);
    }
}
