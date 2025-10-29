import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, Plus, Minus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: 'bebidas' | 'snacks';
}

const products: Product[] = [
  { id: '1', name: 'Coca Cola', price: 2.5, category: 'bebidas' },
  { id: '2', name: 'Agua', price: 1.5, category: 'bebidas' },
  { id: '3', name: 'Red Bull', price: 3.5, category: 'bebidas' },
  { id: '4', name: 'Café', price: 2.0, category: 'bebidas' },
  { id: '5', name: 'Papas Fritas', price: 2.0, category: 'snacks' },
  { id: '6', name: 'Doritos', price: 2.5, category: 'snacks' },
  { id: '7', name: 'Chocolate', price: 1.5, category: 'snacks' },
  { id: '8', name: 'Sandwich', price: 5.0, category: 'snacks' },
];

export default function ClientCafeteria() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const addToCart = (productId: string) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getTotal = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return total + (product?.price || 0) * quantity;
    }, 0);
  };

  const handleOrder = () => {
    if (Object.keys(cart).length === 0) {
      toast({
        variant: "destructive",
        title: "Carrito vacío",
        description: "Agrega productos antes de realizar el pedido",
      });
      return;
    }

    toast({
      title: "¡Pedido realizado!",
      description: `Tu pedido por $${getTotal().toFixed(2)} será entregado pronto`,
    });

    setCart({});
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold neon-text">Cafetería</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Products */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-secondary mb-4">Bebidas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.filter(p => p.category === 'bebidas').map(product => (
                    <div key={product.id} className="cyber-card flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-primary">${product.price.toFixed(2)}</p>
                      </div>
                      <Button
                        onClick={() => addToCart(product.id)}
                        size="icon"
                        className="cyber-button"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-secondary mb-4">Snacks</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.filter(p => p.category === 'snacks').map(product => (
                    <div key={product.id} className="cyber-card flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-primary">${product.price.toFixed(2)}</p>
                      </div>
                      <Button
                        onClick={() => addToCart(product.id)}
                        size="icon"
                        className="cyber-button"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart */}
            <div className="cyber-card h-fit sticky top-8">
              <h2 className="text-2xl font-bold mb-4">Tu Pedido</h2>
              
              {Object.keys(cart).length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Tu carrito está vacío
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {Object.entries(cart).map(([productId, quantity]) => {
                      const product = products.find(p => p.id === productId);
                      if (!product) return null;
                      return (
                        <div key={productId} className="flex items-center justify-between py-2 border-b border-primary/20">
                          <div className="flex-1">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-primary">${product.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => removeFromCart(productId)}
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 border-primary"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-bold">{quantity}</span>
                            <Button
                              onClick={() => addToCart(productId)}
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 border-primary"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-primary pt-4 mb-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-primary">${getTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <Button onClick={handleOrder} className="w-full cyber-button">
                    Realizar Pedido
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
