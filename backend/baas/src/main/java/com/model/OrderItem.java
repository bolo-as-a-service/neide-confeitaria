package com.model;

import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private Integer quantity;

    private String observation;

    @Column(nullable = false)
    private Double unitPrice;

    public Long getId() { return id; }
    public Product getProduct() { return product; }
    public Order getOrder() { return order; }
    public Integer getQuantity() { return quantity; }
    public String getObservation() { return observation; }
    public Double getUnitPrice() { return unitPrice; }

    public void setId(Long id) { this.id = id; }
    public void setProduct(Product product) { this.product = product; }
    public void setOrder(Order order) { this.order = order; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public void setObservation(String observation) { this.observation = observation; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }
}