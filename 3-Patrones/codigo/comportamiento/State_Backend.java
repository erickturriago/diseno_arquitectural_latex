// --- Definición del Patrón: Interfaz de Estado y Estados Concretos ---

// La interfaz Estado define la operación que varía según el estado.
public interface OrderStatusState {
    void manejar(Order order, Order.OrderStatus newStatus);
}

// Un Estado Concreto: define el comportamiento para el estado PENDIENTE.
public class PendingState implements OrderStatusState {
    @Override
    public void manejar(Order order, Order.OrderStatus newStatus) {
        if (newStatus == Order.OrderStatus.PROCESANDO || 
            newStatus == Order.OrderStatus.CANCELADO) {
            order.setStatus(newStatus);
        } else {
            throw new IllegalStateException(
                "Desde 'PENDIENTE' solo se puede pasar a 'PROCESANDO' o 'CANCELADO'.");
        }
    }
}

// Otro Estado Concreto: define el comportamiento para el estado COMPLETADO.
public class CompletedState implements OrderStatusState {
    @Override
    public void manejar(Order order, Order.OrderStatus newStatus) {
        throw new IllegalStateException("Un pedido 'COMPLETADO' no puede cambiar de estado.");
    }
}
// (Existirían otras clases como ProcessingState y CancelledState)


// --- Uso en el Contexto: OrderService.java ---

@Service
public class OrderService {
    // El OrderService (Contexto) no tiene la lógica de transición.
    
    // (Se inyecta la fábrica de estados, que es un Singleton)
    @Autowired 
    private OrderStatusStateFactory stateFactory;

    public Order updateOrderStatus(Long orderId, String newStatusStr) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado"));

        Order.OrderStatus newStatus = Order.OrderStatus.valueOf(newStatusStr.toUpperCase());
        
        // 1. El Contexto obtiene el objeto de estado actual desde una fábrica.
        OrderStatusState currentState = stateFactory.getState(order.getStatus());
        
        // 2. El Contexto delega la operación al objeto de estado actual.
        // La lógica de si la transición es válida está encapsulada en el estado.
        currentState.manejar(order, newStatus);
        
        return orderRepository.save(order);
    }
}