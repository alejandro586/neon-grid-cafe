import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Monitor, Calendar, TrendingUp, User, Users, Settings, LogOut, ShoppingBag, AlertCircle, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const clientLinks = [
    { to: '/dashboard/cliente', icon: Monitor, label: 'Mapa de PCs' },
    { to: '/dashboard/cliente/reserve', icon: Calendar, label: 'Reservar' },
    { to: '/dashboard/cliente/cafeteria', icon: ShoppingBag, label: 'Cafetería' },
    { to: '/dashboard/cliente/report', icon: AlertCircle, label: 'Reportar' },
    { to: '/dashboard/cliente/demand', icon: TrendingUp, label: 'Demanda' },
    { to: '/dashboard/cliente/my-account', icon: User, label: 'Mi Cuenta' },
  ];

  const adminLinks = [
    { to: '/dashboard/admin', icon: Monitor, label: 'Sesiones Activas' },
    { to: '/dashboard/admin/manage-pcs', icon: Settings, label: 'Gestionar PCs' },
    { to: '/dashboard/admin/manage-users', icon: Users, label: 'Gestionar Usuarios' },
    { to: '/dashboard/admin/demand', icon: TrendingUp, label: 'Predicción Demanda' },
    { to: '/dashboard/admin/data-analysis', icon: TrendingUp, label: 'Análisis de Datos' },
  ];

  const links = user.role === 'admin' ? adminLinks : clientLinks;

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 bg-card border border-primary/30 hover:border-primary hover:bg-card"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-primary" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-sidebar-background border-r border-sidebar-border z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static w-64
        `}
      >
        <div className="flex flex-col h-full p-6 pt-20">
          {/* User Info */}
          <div className="mb-8 pb-6 border-b border-primary/30">
            <h2 className="text-2xl font-bold neon-text mb-1">{user.name}</h2>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              {user.role === 'admin' ? 'Administrador' : 'Cliente'}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                    ${active 
                      ? 'bg-primary text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.5)]' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <Button
            onClick={logout}
            variant="outline"
            className="w-full mt-4 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>
    </>
  );
};
