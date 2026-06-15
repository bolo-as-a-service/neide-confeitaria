package com.baas.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;

    private String phone;

    private String address;

    private String observation;

    private String status;

    @OneToMany(mappedBy = "order")
    private List<OrderItem> items;
}