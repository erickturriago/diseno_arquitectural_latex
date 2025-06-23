// --- Definición del Patrón: Clase Abstracta con el Método Plantilla ---

// La Clase Abstracta define el esqueleto del algoritmo.
public abstract class BaseEntityService<T, ID> {
    
    // Métodos abstractos (hooks) que las subclases deben implementar.
    protected abstract JpaRepository<T, ID> getRepository();
    protected abstract void updateEntityFields(T existing, T details);
    protected abstract String getEntityName();

    // Este es el "Método Plantilla". Es final para que las subclases no lo alteren.
    // Define la estructura fija del algoritmo de actualización.
    public final T updateEntity(ID id, T entityDetails) {
        // 1. Paso común: Encontrar la entidad.
        T existingEntity = getRepository().findById(id)
                .orElseThrow(() -> new RuntimeException(getEntityName() + " no encontrado"));
        
        // 2. Paso específico: Actualizar los campos (implementado por la subclase).
        updateEntityFields(existingEntity, entityDetails);
        
        // 3. Paso común: Guardar la entidad actualizada.
        return getRepository().save(existingEntity);
    }
}


// --- Clase Concreta que implementa los pasos específicos ---

@Service
public class UserService extends BaseEntityService<User, Long> {
    
    @Autowired
    private UserRepository userRepository;
    
    // Las subclases "rellenan" los huecos del algoritmo.
    
    @Override
    protected JpaRepository<User, Long> getRepository() {
        return userRepository;
    }
    
    @Override
    protected void updateEntityFields(User existing, User details) {
        // Lógica específica para actualizar un usuario.
        if (details.getName() != null) existing.setName(details.getName());
        if (details.getEmail() != null) existing.setEmail(details.getEmail());
        if (details.getRole() != null) existing.setRole(details.getRole());
    }
    
    @Override
    protected String getEntityName() {
        return "Usuario";
    }

    // Método público que los clientes usan, el cual invoca el método plantilla.
    public User updateUser(Long id, User userDetails) {
        return updateEntity(id, userDetails);
    }
}