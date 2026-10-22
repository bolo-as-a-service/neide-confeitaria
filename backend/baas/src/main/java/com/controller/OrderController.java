package com.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.dto.OrderDTO;
import com.model.Order;
import com.service.OrderService;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderDTO dto, Authentication authentication) {
        return ResponseEntity.ok(orderService.createOrder(dto, extractUserId(authentication)));
    }

    /**
     * Pedidos do usuário logado (vinculados pelo userId no checkout).
     * Não expõe pedidos de outros usuários.
     */
    @GetMapping("/mine")
    public ResponseEntity<List<Order>> getMine(Authentication authentication) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(Long.valueOf(authentication.getName())));
    }

    @GetMapping("/customer/{name}")
    public ResponseEntity<List<Order>> getByCustomer(@PathVariable String name) {
        return ResponseEntity.ok(orderService.getOrdersByCustomerName(name));
    }

    private static Long extractUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) return null;
        try {
            return Long.valueOf(authentication.getName());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders(@RequestParam(required = false) String status) {
        if (status != null) {
            return ResponseEntity.ok(orderService.getOrdersByStatus(status));
        }
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PatchMapping("/{id}/advance")
    public ResponseEntity<Order> advanceStatus(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.advanceStatus(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }
}