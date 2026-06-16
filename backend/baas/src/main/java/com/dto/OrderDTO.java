package com.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderDTO {

    private String customerName;
    private String phone;
    private Boolean delivery;
    private String address;
    private Double latitude;
    private Double longitude;
    private LocalDateTime deliveryDateTime;
    private String observation;
    private List<OrderItemDTO> items;

    public String getCustomerName() { return customerName; }
    public String getPhone() { return phone; }
    public Boolean getDelivery() { return delivery; }
    public String getAddress() { return address; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public LocalDateTime getDeliveryDateTime() { return deliveryDateTime; }
    public String getObservation() { return observation; }
    public List<OrderItemDTO> getItems() { return items; }

    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setDelivery(Boolean delivery) { this.delivery = delivery; }
    public void setAddress(String address) { this.address = address; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public void setDeliveryDateTime(LocalDateTime deliveryDateTime) { this.deliveryDateTime = deliveryDateTime; }
    public void setObservation(String observation) { this.observation = observation; }
    public void setItems(List<OrderItemDTO> items) { this.items = items; }
}