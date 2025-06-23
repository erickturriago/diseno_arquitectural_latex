// --- Definición del Patrón en: /memento/Memento.ts, Originator.ts, Caretaker.ts ---

// Memento: Almacena una "foto" del estado del Originator.
export class EditorMemento<T> {
  constructor(private readonly state: T) {}

  public getState(): T {
    return this.state;
  }
}

// Originator: El objeto cuyo estado se quiere guardar y restaurar.
export class EditorOriginator<T> {
  constructor(private state: T) {}

  public save(): EditorMemento<T> {
    // Crea un Memento con una copia profunda del estado actual.
    const deepCopy = JSON.parse(JSON.stringify(this.state));
    return new EditorMemento(deepCopy);
  }

  public restore(memento: EditorMemento<T>): void {
    this.state = memento.getState();
  }
  
  public setState(state: T): void {
    this.state = state;
  }
  
  public getState(): T {
      return this.state;
  }
}

// Caretaker: Gestiona el historial de Mementos.
export class HistoryCaretaker {
  private mementos: EditorMemento<any>[] = [];
  private originator: EditorOriginator<any>;
  private currentIndex: number = -1;

  constructor(originator: EditorOriginator<any>) {
    this.originator = originator;
  }

  public backup(): void {
    // Elimina el historial de "redo" si se hace un nuevo cambio.
    this.mementos = this.mementos.slice(0, this.currentIndex + 1);
    this.mementos.push(this.originator.save());
    this.currentIndex = this.mementos.length - 1;
  }

  public undo(): void {
    if (this.currentIndex <= 0) return;
    this.currentIndex--;
    this.originator.restore(this.mementos[this.currentIndex]);
  }

  public redo(): void {
    if (this.currentIndex >= this.mementos.length - 1) return;
    this.currentIndex++;
    this.originator.restore(this.mementos[this.currentIndex]);
  }
}


// --- Uso en el Cliente: frontend/src/pages/CustomizePage.tsx ---

const CustomizePage = () => {
  // Se inicializan los objetos del patrón usando useRef para que persistan.
  const originator = useRef(new EditorOriginator<any[]>([]));
  const caretaker = useRef(new HistoryCaretaker(originator.current));

  // Función que modifica el estado y guarda un "recuerdo".
  const updateStateAndBackup = (newState: any[]) => {
    originator.current.setState(newState);
    caretaker.current.backup(); // El Caretaker guarda un Memento del nuevo estado.
    // ...lógica para forzar re-render...
  };

  // El cliente simplemente llama a los métodos del Caretaker para undo/redo.
  const handleUndo = () => {
    caretaker.current.undo();
    // ...lógica para forzar re-render...
  };

  const handleRedo = () => {
    caretaker.current.redo();
    // ...lógica para forzar re-render...
  };

  // ...
};