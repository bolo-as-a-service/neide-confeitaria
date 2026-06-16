package com.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String phone;
    private Boolean delivery = false;
    private String address;
    private Double latitude;
    private Double longitude;
    private String observation;
    private String status;
    private LocalDateTime deliveryDateTime;
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = "FILA";
    }

    public Long getId() { return id; }
    public String getCustomerName() { return customerName; }
    public String getPhone() { return phone; }
    public Boolean getDelivery() { return delivery; }
    public String getAddress() { return address; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public String getObservation() { return observation; }
    public String getStatus() { return status; }
    public LocalDateTime getDeliveryDateTime() { return deliveryDateTime; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<OrderItem> getItems() { return items; }

    public void setId(Long id) { this.id = id; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setDelivery(Boolean delivery) { this.delivery = delivery; }
    public void setAddress(String address) { this.address = address; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public void setObservation(String observation) { this.observation = observation; }
    public void setStatus(String status) { this.status = status; }
    public void setDeliveryDateTime(LocalDateTime deliveryDateTime) { this.deliveryDateTime = deliveryDateTime; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setItems(List<OrderItem> items) { this.items = items; }
}