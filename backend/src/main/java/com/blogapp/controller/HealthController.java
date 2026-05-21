package com.blogapp.controller;

import com.blogapp.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/health")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        log.info("Health check request received");
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "Blog App Backend");
        response.put("version", "1.0.0");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
