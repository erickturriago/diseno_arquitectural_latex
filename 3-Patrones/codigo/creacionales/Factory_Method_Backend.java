// Producto
public class OrderItem {
    private BigDecimal totalPrice;
    // ... otros campos, constructores, getters y setters ...

    public void setTotalPrice(BigDecimal price) {
        this.totalPrice = price;
    }
}

// Fábrica
public class OrderItemFactory {
    
    // Método factory que encapsula la lógica de creación
    public static OrderItem createBasicItem(CustomDesign design, Integer quantity) {
        OrderItem item = new OrderItem();
        item.setQuantity(quantity);
        item.setUnitPrice(design.getPrice());
        
        // Lógica clave del patrón: el cálculo está centralizado aquí
        BigDecimal totalPrice = design.getPrice()
            .multiply(BigDecimal.valueOf(quantity));
        item.setTotalPrice(totalPrice);
        
        return item;
    }
}

// Cliente
public class OrderService {

    public void createOrderFromCart(Order orderRequest) {
        // ... lógica de negocio ...
        for (OrderItem itemRequest : orderRequest.getItems()) {
            CustomDesign design = findDesignFor(itemRequest);
            
            // El cliente usa la fábrica, delegando la creación compleja.
            OrderItem newItem = OrderItemFactory.createBasicItem(
                design, 
                itemRequest.getQuantity(), 
                itemRequest.getSize()
            );
            
            // ... añade newItem a la nueva orden ...
        }
        // ...
    }
}