package com.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.model.Product;
import com.repository.CategoryRepository;
import com.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public Product createProduct(Product product) {
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            if (product.getCategory().getId() > 0) {
                product.setCategory(categoryRepository.findById(product.getCategory().getId())
                        .orElse(null));
            } else {
                product.setCategory(null);
            }
        }
        if (product.getAvailable() == null) product.setAvailable(true);
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + id));
    }

    public Product updateProduct(Long id, Product product) {
        Product existing = getProductById(id);
        existing.setName(product.getName());
        existing.setDescription(product.getDescription());
        existing.setPrice(product.getPrice());
        existing.setImageUrl(product.getImageUrl());
        existing.setIngredients(product.getIngredients());
        if (product.getAvailable() != null) existing.setAvailable(product.getAvailable());
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            if (product.getCategory().getId() > 0) {
                existing.setCategory(categoryRepository.findById(product.getCategory().getId())
                        .orElseThrow(() -> new RuntimeException("Categoria não encontrada")));
            } else {
                existing.setCategory(null);
            }
        }
        return productRepository.save(existing);
    }

    public Product toggleAvailability(Long id) {
        Product product = getProductById(id);
        product.setAvailable(!product.getAvailable());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}