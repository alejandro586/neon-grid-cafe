import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Monitor, ShoppingBag, AlertCircle } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'admin') {
      navigate('/dashboard/admin');
    } else {
      navigate('/dashboard/cliente');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold neon-text mb-8">Bienvenido, {user.name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate(user.role === 'admin' ? '/dashboard/admin' : '/dashboard/cliente/reserve')}
              className="cyber-card group cursor-pointer"
            >
              <Monitor className="h-16 w-16 text-primary mb-4 mx-auto group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold text-center mb-2">Rentar Máquina</h2>
              <p className="text-muted-foreground text-center">
                Reserva una PC para tu sesión
              </p>
            </button>

            <button
              onClick={() => navigate('/dashboard/cliente/cafeteria')}
              className="cyber-card group cursor-pointer"
            >
              <ShoppingBag className="h-16 w-16 text-secondary mb-4 mx-auto group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold text-center mb-2">Cafetería</h2>
              <p className="text-muted-foreground text-center">
                Pide snacks y bebidas
              </p>
            </button>

            <button
              onClick={() => navigate('/dashboard/cliente/report')}
              className="cyber-card group cursor-pointer"
            >
              <AlertCircle className="h-16 w-16 text-accent mb-4 mx-auto group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold text-center mb-2">Enviar Reporte</h2>
              <p className="text-muted-foreground text-center">
                Reporta problemas o sugerencias
              </p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
