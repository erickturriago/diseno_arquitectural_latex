// --- Definición del Patrón en: frontend/src/patterns/strategy/AuthStrategy.ts ---

// La Interfaz de la Estrategia define la operación común para todos los algoritmos.
export interface AuthStrategy {
  execute(...args: any[]): Promise<boolean>;
}

// Estrategia Concreta 1: Autenticación con Google.
export class GoogleAuthStrategy implements AuthStrategy {
  public async execute(): Promise<boolean> {
    const firebaseUser = await FirebaseFacade.signInWithGoogle();
    if (firebaseUser) {
      const appUser = await authService.findOrCreateUser(firebaseUser);
      useAuthStore.getState().setUser(appUser);
      return !!appUser;
    }
    return false;
  }
}

// Estrategia Concreta 2: Autenticación con Email y Contraseña.
export class EmailPasswordAuthStrategy implements AuthStrategy {
  public async execute(email: string, pass: string): Promise<boolean> {
    const appUser = await authApi.login({ email, password: pass });
    if (appUser) {
      useAuthStore.getState().setUser(UserFactory.createUser(appUser));
      return true;
    }
    return false;
  }
}


// --- Uso en el Cliente: frontend/src/pages/LoginPage.tsx ---

const LoginPage = () => {

  const handleAuthAction = async (strategy: AuthStrategy, ...args: any[]) => {
    // El cliente ejecuta la estrategia sin conocer los detalles del algoritmo.
    const success = await strategy.execute(...args);
    if (!success) {
      // Manejar error de autenticación...
      console.error("La autenticación falló.");
    }
    // Si es exitoso, el usuario será redirigido...
  };

  return (
    <div>
      {/* Al hacer clic, el cliente instancia y ejecuta la estrategia de Google */}
      <button onClick={() => handleAuthAction(new GoogleAuthStrategy())}>
        Login con Google
      </button>

      {/* El formulario instancia y ejecuta la estrategia de Email/Password */}
      <EmailLoginForm onSubmit={(email, pass) => 
        handleAuthAction(new EmailPasswordAuthStrategy(), email, pass)
      } />
    </div>
  );
};