// --- Definición del Patrón en: frontend/src/patterns/command/Command.ts ---

// La Interfaz Command define un único método para ejecutar la acción.
export interface Command<T> {
  execute(): Promise<T | null>;
}

// Un ConcreteCommand que encapsula una acción específica.
export class CreateDesignCommand implements Command<Print> {
  // El comando recibe los receptores (ej. una función del store)
  // y los datos necesarios para la acción en su constructor.
  constructor(
    private data: any,
    private addDesign: (design: Print) => void
  ) {}

  // El método execute orquesta la llamada a los receptores.
  async execute(): Promise<Print | null> {
    // 1. Llama al primer receptor (el servicio de API).
    const newDesign = await designApi.create(this.data);
    
    if (newDesign) {
      // 2. Llama al segundo receptor (el store local).
      this.addDesign(newDesign);
    }
    
    return newDesign;
  }
}
// (Se podrían definir otras clases como UpdateDesignCommand, DeleteDesignCommand...)


// --- Uso en el Cliente: frontend/src/pages/ArtistDashboardPage.tsx ---

const ArtistDashboardPage = () => {
  // El cliente obtiene una referencia a los receptores (en este caso, el store).
  const { addDesign } = useDesignStore();

  const handleCreateFormSubmit = async (formData: any) => {
    try {
      const imageUrl = await FirebaseFacade.uploadFile(formData.file, 'designs/');
      const commandPayload = { ...formData, imageUrl, artistId: user.id };

      // El Invocador crea y ejecuta el comando, sin conocer los detalles internos.
      const command = new CreateDesignCommand(commandPayload, addDesign);
      const newDesign = await command.execute();

      if (newDesign) {
        showNotification(`Diseño "${newDesign.title}" creado!`, 'success');
      }
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  // ... resto del componente que llama a handleCreateFormSubmit
};