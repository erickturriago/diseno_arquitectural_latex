/**
 * La clase Singleton que asegura una única instancia del cliente Axios.
 */
class ApiClient {
    // La referencia estática a la única instancia
    private static instance: ApiClient;
    public client: AxiosInstance;

    // El constructor es privado para evitar la instanciación con 'new'
    private constructor() {
        this.client = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // El método estático que controla el acceso a la instancia
    public static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }
}

// Se exporta la instancia del cliente para ser usada globalmente
export const httpClient = ApiClient.getInstance().client;