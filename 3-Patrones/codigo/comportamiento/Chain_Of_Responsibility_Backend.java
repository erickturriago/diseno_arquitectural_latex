// El Manejador Abstracto define la estructura de la cadena.
public abstract class OrderValidationHandler {
    protected OrderValidationHandler sucesor;

    public void setSucesor(OrderValidationHandler sucesor) {
        this.sucesor = sucesor;
    }

    public abstract void peticionDeManejador(Order order);

    protected void handleNext(Order order) {
        if (sucesor != null) {
            sucesor.peticionDeManejador(order);
        }
    }
}

// Un Manejador Concreto que implementa una regla de validación.
public class UserValidationHandler extends OrderValidationHandler {
    private final UserRepository userRepository;

    public UserValidationHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void peticionDeManejador(Order order) {
        if (order.getUser() == null || order.getUser().getId() == null) {
            throw new IllegalArgumentException("La orden debe tener un usuario.");
        }
        userRepository.findById(order.getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado."));

        // Si la validación es exitosa, pasa la solicitud al siguiente en la cadena.
        handleNext(order);
    }
}


// --- Uso en el Cliente: OrderService.java ---

@Service
public class OrderService {
    
    // (Se inyectan los repositorios necesarios)
    @Autowired private UserRepository userRepository;
    @Autowired private CustomDesignRepository customDesignRepository;

    public Order createOrderFromCart(Order orderFromRequest) {
        // 1. El cliente construye la cadena de responsabilidad.
        OrderValidationHandler userValidator = new UserValidationHandler(userRepository);
        OrderValidationHandler productValidator = new ProductAvailabilityHandler(customDesignRepository);
        // ... se podrían añadir más validadores aquí ...
        
        // 2. Se enlazan los manejadores para formar la cadena.
        userValidator.setSucesor(productValidator);
        
        // 3. El cliente ejecuta la cadena desde el primer manejador.
        userValidator.peticionDeManejador(orderFromRequest);
        
        // Si todas las validaciones pasan, se procede con la creación de la orden.
        // ... resto de la lógica de creación ...
        return orderRepository.save(newOrder);
    }
}