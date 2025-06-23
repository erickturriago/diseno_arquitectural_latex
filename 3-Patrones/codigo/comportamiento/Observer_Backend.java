// --- Definición del Patrón: Subject y Observer ---

// La interfaz Observador.
public interface OrderStatusObserver {
    void setContext(Order order, Order.OrderStatus oldStatus, Order.OrderStatus newStatus);
    void actualizar();
}

// El Sujeto, que mantiene la lista de observadores y los notifica.
@Component
public class OrderStatusSubject {
    private List<OrderStatusObserver> observadores = new ArrayList<>();

    public void atar(OrderStatusObserver obs) {
        observadores.add(obs);
    }

    public void desatar(OrderStatusObserver obs) {
        observadores.remove(obs);
    }

    public void notifyStatusChanged(Order order, Order.OrderStatus oldStatus, Order.OrderStatus newStatus) {
        for (OrderStatusObserver observer : observadores) {
            observer.setContext(order, oldStatus, newStatus);
            observer.actualizar();
        }
    }
}

// Un Observador Concreto que registra el cambio en un log.
@Component
public class LoggingOrderObserver implements OrderStatusObserver {
    private Order currentOrder;
    private Order.OrderStatus oldStatus;
    private Order.OrderStatus newStatus;

    @Override
    public void setContext(Order order, Order.OrderStatus oldStatus, Order.OrderStatus newStatus) {
        this.currentOrder = order;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
    }

    @Override
    public void actualizar() {
        // Realiza una acción en respuesta a la notificación.
        LOGGER.info("Orden ID {} cambió de estado: {} -> {}", 
                      currentOrder.getId(), oldStatus, newStatus);
    }
}


// --- Uso en el Cliente que dispara la notificación: OrderService.java ---

@Service
public class OrderService {

    // El cliente tiene una referencia al Sujeto.
    @Autowired
    private OrderStatusSubject orderStatusSubject;

    public Order updateOrderStatus(Long orderId, String newStatusStr) {
        // ... Lógica para cambiar el estado de la orden ...
        Order order = // ... obtener y actualizar la orden ...
        Order.OrderStatus oldStatus = // ... guardar el estado anterior ...
        Order savedOrder = orderRepository.save(order);

        // Al final de la operación, notifica al Sujeto sobre el cambio.
        // El Sujeto se encargará de avisar a todos los observadores suscritos.
        orderStatusSubject.notifyStatusChanged(savedOrder, oldStatus, savedOrder.getStatus());
        
        return savedOrder;
    }
}