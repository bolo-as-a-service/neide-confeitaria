package com.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.dto.LoginDTO;
import com.dto.RegisterDTO;
import com.model.User;
import com.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User login(LoginDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou senha inválidos"));
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email ou senha inválidos");
        }
        return user;
    }

    public User register(RegisterDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole("USER");
        return userRepository.save(user);
    }

    public User createAdmin(String name, String email, String rawPassword) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole("ADMIN");
        return userRepository.save(user);
    }
}