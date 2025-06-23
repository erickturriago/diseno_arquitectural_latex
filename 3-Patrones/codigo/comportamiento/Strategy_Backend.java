// --- Definición del Patrón: Interfaz y Estrategias Concretas ---

// La interfaz Estrategia define el algoritmo de filtrado.
public interface DesignSearchStrategy {
    List<Design> filter(List<Design> designs, String criteria);
    boolean canHandle(String criteria);
}

// Una Estrategia Concreta para buscar por nombre.
public class NameSearchStrategy implements DesignSearchStrategy {
    @Override
    public List<Design> filter(List<Design> designs, String criteria) {
        if (criteria == null || criteria.trim().isEmpty()) {
            return designs;
        }
        String searchTerm = criteria.toLowerCase();
        return designs.stream()
                .filter(design -> design.getName().toLowerCase().contains(searchTerm))
                .collect(Collectors.toList());
    }
    @Override
    public boolean canHandle(String criteria) {
        return criteria != null && !criteria.trim().isEmpty();
    }
}

// Una Estrategia Concreta para filtrar por categoría.
public class CategorySearchStrategy implements DesignSearchStrategy {
    private final Long categoryId;
    public CategorySearchStrategy(Long categoryId) { this.categoryId = categoryId; }

    @Override
    public List<Design> filter(List<Design> designs, String criteria) {
        return designs.stream()
                .filter(design -> design.getCategory() != null && 
                                 design.getCategory().getId().equals(categoryId))
                .collect(Collectors.toList());
    }
    @Override
    public boolean canHandle(String criteria) {
        return categoryId != null;
    }
}


// --- Contexto que utiliza las Estrategias ---

public class DesignSearchContext {
    private final List<DesignSearchStrategy> strategies = new ArrayList<>();

    public void addStrategy(DesignSearchStrategy strategy) {
        this.strategies.add(strategy);
    }

    // El Contexto delega la ejecución a las estrategias configuradas.
    public List<Design> executeSearch(List<Design> designs, String nameCriteria) {
        List<Design> result = new ArrayList<>(designs);
        for (DesignSearchStrategy strategy : strategies) {
            // Lógica para aplicar la estrategia correcta.
            result = strategy.filter(result, nameCriteria);
        }
        return result;
    }
}


// --- Uso en el Cliente: DesignService.java ---

@Service
public class DesignService {
    
    public List<Design> searchDesigns(Long categoryId, Long artistId, String name) {
        List<Design> baseDesigns = designRepository.findByActiveTrue();
        
        // El cliente crea un contexto y lo configura con las estrategias apropiadas.
        DesignSearchContext searchContext = new DesignSearchContext();
        if (categoryId != null) {
            searchContext.addStrategy(new CategorySearchStrategy(categoryId));
        }
        if (artistId != null) {
            // Se añadiría la estrategia de artista aquí.
        }
        searchContext.addStrategy(new NameSearchStrategy());
        
        // El cliente delega el algoritmo de búsqueda al contexto.
        return searchContext.executeSearch(baseDesigns, name);
    }
}