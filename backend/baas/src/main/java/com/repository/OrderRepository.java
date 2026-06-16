package com.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.model.Order;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatus(String status);
    List<Order> findByCustomerNameIgnoreCase(String customerName);
}