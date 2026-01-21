package com.furkankozmac.blogmanagement.controller;

import com.furkankozmac.blogmanagement.config.JwtUtil;
import com.furkankozmac.blogmanagement.dto.*;
import com.furkankozmac.blogmanagement.entity.RefreshToken;
import com.furkankozmac.blogmanagement.entity.Role;
import com.furkankozmac.blogmanagement.entity.User;
import com.furkankozmac.blogmanagement.repository.RefreshTokenRepository;
import com.furkankozmac.blogmanagement.repository.UserRepository;
import com.furkankozmac.blogmanagement.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor // Generates constructor for final fields
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtils;

    // 1. SIGN UP
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Username is already taken!");
        }

        User newUser = User.builder()
                .username(request.getUsername())
                .password(encoder.encode(request.getPassword()))
                .role(Role.ROLE_USER) // Assuming Enum is USER, not ROLE_USER
                .build();

        userRepository.save(newUser);

        return ResponseEntity.ok("User registered successfully!");
    }

    // 2. SIGN IN
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Generate Access Token
        String accessToken = jwtUtils.generateToken(userDetails.getUsername());

        // Generate Refresh Token
        // We find the user ID to link the token
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return ResponseEntity.ok(new JwtResponse(accessToken, refreshToken.getToken()));
    }

    // 3. REFRESH TOKEN
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody TokenRefreshRequest request) {
        String requestToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestToken)
                .map(refreshTokenService::verifyExpiration) // This throws exception if expired
                .map(RefreshToken::getUser)
                .map(user -> {
                    String newAccessToken = jwtUtils.generateToken(user.getUsername());
                    return ResponseEntity.ok(new JwtResponse(newAccessToken, requestToken));
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }

    // 4. LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@RequestBody TokenRefreshRequest request) {
        String requestToken = request.getRefreshToken();

        // We delete the specific refresh token provided by the client
        return refreshTokenService.findByToken(requestToken)
                .map(token -> {
                    refreshTokenService.deleteByToken(token.getToken());
                    return ResponseEntity.ok("Log out successful!");
                })
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));
    }
}