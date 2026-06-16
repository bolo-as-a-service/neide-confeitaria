package com.baas.model;

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

    private String address;

    private String observation;

    private String status;

    private LocalDateTime deliveryDateTime;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    public Long getId() { return id; }
    public String getCustomerName() { return customerName; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public String getObservation() { return observation; }
    public String getStatus() { return status; }
    public LocalDateTime getDeliveryDateTime() { return deliveryDateTime; }
    public List<OrderItem> getItems() { return items; }

    public void setId(Long id) { this.id = id; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setAddress(String address) { this.address = address; }
    public void setObservation(String observation) { this.observation = observation; }
    public void setStatus(String status) { this.status = status; }
    public void setDeliveryDateTime(LocalDateTime deliveryDateTime) { this.deliveryDateTime = deliveryDateTime; }
    public void setItems(List<OrderItem> items) { this.items = items; }
}