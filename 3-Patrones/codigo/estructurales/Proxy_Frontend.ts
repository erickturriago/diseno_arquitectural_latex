// --- Definición del Patrón en: frontend/src/auth/withRole.tsx ---

interface RoleProxyProps {
  children: React.ReactNode;
  requiredRole: 'ADMIN' | 'ARTISTA';
}

// Este componente actúa como el Proxy de Protección.
export const RoleProxy = ({ children, requiredRole }: RoleProxyProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <CircularProgress />; // Muestra un loader mientras se verifica el usuario
  }

  // El proxy realiza la comprobación de acceso.
  if (!user || user.role !== requiredRole) {
    return (
      <Box>
        <Typography variant="h5" color="error">Acceso Denegado</Typography>
        <Typography>No tienes los permisos para ver esta página.</Typography>
      </Box>
    );
  }

  // Si la comprobación es exitosa, renderiza el componente real (children).
  return <>{children}</>;
};


// --- Uso en el Cliente: frontend/src/App.tsx ---

function App() {
  return (
    <Router>
      <Routes>
        {/* ... otras rutas públicas ... */}

        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              {/* El cliente no llama directamente a AdminDashboardPage.
                Llama al Proxy y le pasa el componente real como hijo.
              */}
              <RoleProxy requiredRole="ADMIN">
                <AdminDashboardPage />
              </RoleProxy>
            </ProtectedRoute>
          } 
        />
        
        {/* ... más rutas protegidas de la misma manera ... */}
      </Routes>
    </Router>
  );
}