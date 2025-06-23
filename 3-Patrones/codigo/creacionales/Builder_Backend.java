@Entity
public class CustomDesign {
    private String name;
    private String description;
    private BigDecimal price;
    private User creator;
    private Product product;
    // ... otros atributos y getters/setters ...

    // Constructor privado para que solo el Builder pueda crear instancias
    private CustomDesign(CustomDesignBuilder builder) {
        this.name = builder.name;
        this.description = builder.description;
        this.price = builder.price;
        this.creator = builder.creator;
        this.product = builder.product;
    }
    
    // Constructor vacío requerido por JPA
    public CustomDesign() {}

    // El Builder como clase interna estática
    public static class CustomDesignBuilder {
        private final String name; // Parámetro obligatorio
        private final User creator;
        private final Product product;
        
        private String description; // Parámetros opcionales
        private BigDecimal price;

        public CustomDesignBuilder(String name, User creator, Product product) {
            this.name = name;
            this.creator = creator;
            this.product = product;
        }

        public CustomDesignBuilder withDescription(String description) {
            this.description = description;
            return this; // Retorna 'this' para encadenamiento fluido
        }

        public CustomDesignBuilder withPrice(BigDecimal price) {
            this.price = price;
            return this;
        }
        
        // ... otros métodos 'with' para campos opcionales ...

        public CustomDesign build() {
            return new CustomDesign(this);
        }
    }
}


// --- Uso en el Cliente: CustomDesignService.java ---

@Service
public class CustomDesignService {

    public CustomDesign createCustomDesign(CustomDesign designFromRequest) {
        // ... validaciones de negocio ...
        User creator = //... obtener usuario ...
        Product product = //... obtener producto ...

        // El cliente (Director) orquesta la construcción usando el Builder
        CustomDesign newDesign = new CustomDesign.CustomDesignBuilder(
                designFromRequest.getName(), creator, product)
            .withDescription(designFromRequest.getDescription())
            .withPrice(designFromRequest.getPrice())
            .build();

        // ... persistencia del newDesign ...
        return customDesignRepository.save(newDesign);
    }
}