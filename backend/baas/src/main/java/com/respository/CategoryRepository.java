package com.baas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.baas.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}