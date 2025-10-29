import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // NUEVO: Para slide cyber.
import { Menu, X, Monitor, Calendar, TrendingUp, User, Users, Settings, LogOut, ShoppingBag, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSidebar } from '@/contexts/SidebarContext';

export const Sidebar = () => {
  const { isOpen, toggleSidebar, closeSidebar } = useSidebar(); // MEJORA: Usa closeSidebar.
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // FIX: Usa closeSidebar en resize.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) closeSidebar(); // lg breakpoint.
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [closeSidebar]);

  if (!user) return null;

  const clientLinks = [
    { to: '/dashboard/cliente', icon: Monitor, label: 'Mapa de PCs' },
    { to: '/dashboard/cliente/reserve', icon: Calendar, label: 'Reservar' },
    { to: '/dashboard/cliente/cafeteria', icon: ShoppingBag, label: 'Cafetería' },
    { to: '/dashboard/cliente/report', icon: AlertCircle, label: 'Reportar' },
    { to: '/dashboard/cliente/my-account', icon: User, label: 'Mi Cuenta' },
  ];

  const adminLinks = [
    { to: '/dashboard/admin', icon: Monitor, label: 'Sesiones Activas' },
    { to: '/dashboard/admin/manage-pcs', icon: Settings, label: 'Gestionar PCs' },
    { to: '/dashboard/admin/manage-users', icon: Users, label: 'Gestionar Usuarios' },
    { to: '/dashboard/admin/demand', icon: TrendingUp, label: 'Predicción Demanda' },
  ];

  const links = user.role === 'admin' ? adminLinks : clientLinks;

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Sesión cerrada",
        description: "¡Hasta pronto, cyber-traveler!",
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo cerrar la sesión",
      });
    } finally {
      closeSidebar(); // FIX: Cierra con closeSidebar.
    }
  };

  return (
    <>
      {/* MEJORA: Botón Toggle con blur y hidden en desktop. */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="lg:hidden" // Oculto en lg+.
      >
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-card/80 backdrop-blur-sm border border-primary/30 hover:border-primary hover:bg-card/90 neon-glow"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <AnimatePresence mode="wait">
            {isOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-primary" />}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* MEJORA: Overlay con motion. */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* MEJORA: Sidebar con motion slide y cyber styles. */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: isOpen ? 0 : -250 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 h-screen bg-sidebar-background/95 backdrop-blur-lg border-r border-sidebar-border z-40 w-64 lg:translate-x-0 lg:static shadow-[0_0_20px_rgba(0,255,136,0.2)]"
      >
        <div className="flex flex-col h-full p-6 pt-20 overflow-y-auto">
          {/* User Info con glitch. */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-8 pb-6 border-b border-primary/30"
          >
            <h2 className="text-2xl font-bold neon-text glitch-effect mb-1">{user.name}</h2>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              {user.role === 'admin' ? 'Administrador' : 'Cliente'}
            </p>
          </motion.div>

          {/* Navigation Links con stagger anim. */}
          <nav className="flex-1 space-y-2">
            <motion.ul 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ staggerChildren: 0.05 }}
            >
              {links.map((link, i) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <motion.li key={link.to} initial={{ x: -10 }} animate={{ x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link
                      to={link.to}
                      onClick={closeSidebar} // MEJORA: Cierra siempre.
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group
                        ${active 
                          ? 'bg-primary text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.5)] neon-glow' 
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary hover:shadow-[0_0_10px_hsl(var(--primary)/0.3)]'
                        }
                      `}
                      aria-label={`Navegar a ${link.label}`}
                    >
                      <Icon className={`h-5 w-5 ${active ? 'text-primary-foreground' : 'text-primary'}`} />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          </nav>

          {/* Logout con motion. */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full mt-4 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground neon-glow"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
};