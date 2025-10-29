import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate sending reset email
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSent(true);
    toast({
      title: "Email enviado",
      description: "Revisa tu correo para restablecer tu contraseña",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/10" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="cyber-card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold neon-text mb-2">Recuperar Contraseña</h1>
            <p className="text-muted-foreground">Te enviaremos un enlace de recuperación</p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="cyber-input"
                  placeholder="usuario@cybercafe.com"
                />
              </div>

              <Button type="submit" className="w-full cyber-button">
                Enviar Enlace
              </Button>

              <Link 
                to="/login" 
                className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al login
              </Link>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">📧</div>
              <p className="text-foreground mb-4">
                Hemos enviado un enlace de recuperación a <strong>{email}</strong>
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Revisa tu bandeja de entrada y sigue las instrucciones
              </p>
              <Link to="/login">
                <Button className="cyber-button">
                  Volver al Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
