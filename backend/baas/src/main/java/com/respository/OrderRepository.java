package com.baas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.baas.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

}