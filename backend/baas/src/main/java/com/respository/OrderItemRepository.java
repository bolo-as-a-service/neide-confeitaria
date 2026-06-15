package com.baas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.baas.model.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}