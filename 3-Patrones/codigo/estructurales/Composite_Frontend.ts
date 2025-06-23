// --- Definición del Patrón en: frontend/src/patterns/composite/Filter.ts ---

// La interfaz Componente define el contrato para todos los objetos.
export interface Filter<T> {
  apply(items: T[]): T[];
}

// Una clase Hoja (Leaf) para una condición de filtro simple.
export class StringIncludesPropertyFilter<T> implements Filter<T> {
  constructor(private key: keyof T, private query: string) {}

  apply(items: T[]): T[] {
    if (!this.query) return items;
    return items.filter(item => 
      String(item[this.key]).toLowerCase().includes(this.query.toLowerCase())
    );
  }
}

// Una clase Compuesta (Composite) que puede contener Hojas u otros Compuestos.
export class AndFilter<T> implements Filter<T> {
  private filters: Filter<T>[] = [];

  public add(filter: Filter<T>): void {
    this.filters.push(filter);
  }

  // Delega la operación a todos sus hijos.
  public apply(items: T[]): T[] {
    return this.filters.reduce(
      (currentItems, filter) => filter.apply(currentItems),
      items
    );
  }
}


// --- Uso en el Cliente: frontend/src/components/admin/UserManagement.tsx ---

// El cliente ensambla el árbol de filtros dinámicamente.
function buildAndApplyFilters(users: User[], activeFilters: any[]) {
  if (activeFilters.length === 0) return users;

  // 1. Se crea el Compuesto raíz.
  const filterComposite = new AndFilter<User>();

  // 2. Se crean Hojas y se añaden al Compuesto.
  activeFilters.forEach(filter => {
    if (filter.field === 'name_includes') {
      filterComposite.add(new StringIncludesPropertyFilter('name', filter.value));
    }
    if (filter.field === 'role_equals') {
      // (Aquí se añadirían otros tipos de Hojas)
      // filterComposite.add(new ExactPropertyFilter('role', filter.value));
    }
  });

  // 3. Se ejecuta el filtro. El cliente no distingue si es un
  // filtro simple o uno compuesto, solo llama a 'apply'.
  return filterComposite.apply(users);
}