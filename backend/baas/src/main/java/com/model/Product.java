package com.model;

import com.config.StringListConverter;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private Double price;

    private String imageUrl;

    @Column(nullable = false)
    private Boolean available = true;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(columnDefinition = "TEXT")
    @Convert(converter = StringListConverter.class)
    private List<String> ingredients;

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Double getPrice() { return price; }
    public String getImageUrl() { return imageUrl; }
    public Boolean getAvailable() { return available; }
    public Category getCategory() { return category; }
    public List<String> getIngredients() { return ingredients; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(Double price) { this.price = price; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setAvailable(Boolean available) { this.available = available; }
    public void setCategory(Category category) { this.category = category; }
    public void setIngredients(List<String> ingredients) { this.ingredients = ingredients; }
}