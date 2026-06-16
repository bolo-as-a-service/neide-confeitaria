package com.baas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.baas.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);
}