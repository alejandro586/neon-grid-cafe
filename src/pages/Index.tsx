import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Monitor, Zap } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/5" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="flex items-center justify-center gap-4 mb-8">
          <Monitor className="h-20 w-20 text-primary animate-pulse" />
          <Zap className="h-16 w-16 text-secondary animate-pulse" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold neon-text mb-4 glitch-effect">
          CYBER CAFÉ
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 uppercase tracking-wider">
          Tu espacio gaming definitivo
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/login')}
            className="cyber-button text-lg px-8 py-6"
          >
            Iniciar Sesión
          </Button>
          
          <Button 
            onClick={() => navigate('/register')}
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-6"
          >
            Registrarse
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="cyber-card text-left">
            <h3 className="text-xl font-bold text-primary mb-2">PCs Gaming</h3>
            <p className="text-sm text-muted-foreground">
              Hardware de última generación para la mejor experiencia
            </p>
          </div>
          
          <div className="cyber-card text-left">
            <h3 className="text-xl font-bold text-secondary mb-2">Reservas Online</h3>
            <p className="text-sm text-muted-foreground">
              Sistema inteligente de reservas y predicción de demanda
            </p>
          </div>
          
          <div className="cyber-card text-left">
            <h3 className="text-xl font-bold text-accent mb-2">Cafetería</h3>
            <p className="text-sm text-muted-foreground">
              Snacks y bebidas mientras juegas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
