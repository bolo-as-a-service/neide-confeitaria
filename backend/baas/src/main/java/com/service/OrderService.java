package com.baas.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.baas.model.Order;
import com.baas.model.OrderItem;
import com.baas.repository.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order createOrder(Order order) {
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                item.setOrder(order);
            }
        }
        order.setStatus("PENDENTE");
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado: " + id));
    }

    public Order updateStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }
}