package com.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.dto.OrderDTO;
import com.dto.OrderItemDTO;
import com.model.Order;
import com.model.OrderItem;
import com.model.Product;
import com.repository.OrderRepository;
import com.repository.ProductRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public Order createOrder(OrderDTO dto) {
        Order order = new Order();
        order.setCustomerName(dto.getCustomerName());
        order.setPhone(dto.getPhone());
        order.setDelivery(dto.getDelivery() != null ? dto.getDelivery() : false);
        order.setAddress(dto.getAddress());
        order.setLatitude(dto.getLatitude());
        order.setLongitude(dto.getLongitude());
        order.setDeliveryDateTime(dto.getDeliveryDateTime());
        order.setObservation(dto.getObservation());
        order.setStatus("FILA");

        if (dto.getItems() != null) {
            List<OrderItem> items = dto.getItems().stream().map(itemDto -> {
                Product product = productRepository.findById(itemDto.getProductId())
                        .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + itemDto.getProductId()));
                OrderItem item = new OrderItem();
                item.setProduct(product);
                item.setQuantity(itemDto.getQuantity());
                item.setObservation(itemDto.getObservation());
                item.setUnitPrice(product.getPrice());
                item.setOrder(order);
                return item;
            }).toList();
            order.setItems(items);
        }

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado: " + id));
    }

    public Order advanceStatus(Long id) {
        Order order = getOrderById(id);
        String[] flow = {"FILA", "APROVADO", "FAZENDO", "PRONTO"};
        for (int i = 0; i < flow.length - 1; i++) {
            if (flow[i].equals(order.getStatus())) {
                order.setStatus(flow[i + 1]);
                break;
            }
        }
        return orderRepository.save(order);
    }

    public Order updateStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByCustomerName(String customerName) {
        return orderRepository.findByCustomerNameIgnoreCase(customerName);
    }
}