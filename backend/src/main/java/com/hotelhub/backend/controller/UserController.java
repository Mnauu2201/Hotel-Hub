package com.hotelhub.backend.controller;

import com.hotelhub.backend.dto.request.UpdateProfileRequest;
import com.hotelhub.backend.entity.User;
import com.hotelhub.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMe(@AuthenticationPrincipal UserDetails principal,
                                      @RequestBody UpdateProfileRequest req) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        return userRepository.findByEmail(principal.getUsername())
                .map(u -> {
                    if (req.getName() != null) u.setName(req.getName());
                    if (req.getPhone() != null) u.setPhone(req.getPhone());
                    User saved = userRepository.save(u);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.status(404).body("User not found"));
    }
}
