package com.dto;

public class OrderItemDTO {

    private Long productId;
    private Integer quantity;
    private String observation;

    public Long getProductId() { return productId; }
    public Integer getQuantity() { return quantity; }
    public String getObservation() { return observation; }

    public void setProductId(Long productId) { this.productId = productId; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public void setObservation(String observation) { this.observation = observation; }
}