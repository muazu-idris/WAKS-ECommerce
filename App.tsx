
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  ShoppingCart, 
  User as UserIcon, 
  Search, 
  Menu, 
  X, 
  Heart, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle,
  LayoutDashboard,
  Box,
  Users,
  BarChart3,
  Settings,
  ChevronRight,
  ArrowRight,
  Filter,
  Package,
  LogOut,
  Star,
  Zap
} from 'lucide-react';
import { Product, CartItem, User, Order } from './types';
import { INITIAL_PRODUCTS, CATEGORIES } from './constants';
import AdminDashboard from './pages/AdminDashboard';
import { generateProductDescription } from './geminiService';

// --- Components ---

const Navbar = ({ cartCount, user }: { cartCount: number, user: User | null }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-indigo-600">WAKS</Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/shop" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Shop All</Link>
              <Link to="/categories" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Categories</Link>
              <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">About</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"><Search size={20} /></button>
            <Link to="/cart" className="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to={user?.role === 'admin' ? '/admin' : '/account'} className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
              <UserIcon size={20} />
            </Link>
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <h3 className="text-2xl font-bold text-indigo-600 mb-4">WAKS</h3>
            <p className="text-gray-500 max-w-xs mb-6">Elevating everyday living through curated design and exceptional craftsmanship. Join our journey for a better home.</p>
            <div className="flex gap-4">
              {['FB', 'TW', 'IG', 'LI'].map(social => (
                <a key={social} href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">{social}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/shop">New Arrivals</Link></li>
              <li><Link to="/shop">Best Sellers</Link></li>
              <li><Link to="/shop">Home Decor</Link></li>
              <li><Link to="/shop">Furniture</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
              <li><Link to="/shipping">Shipping & Returns</Link></li>
              <li><Link to="/tracking">Order Tracking</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookie">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">&copy; 2024 Waks E-Commerce. All rights reserved.</p>
          <div className="flex gap-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Pages ---

const HomePage = ({ products }: { products: Product[] }) => {
  const featured = products.filter(p => p.isFeatured).slice(0, 3);
  
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover" 
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <span className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-widest mb-6">New Collection 2024</span>
          <h1 className="text-5xl md:text-7xl font-bold max-w-2xl mb-8 leading-tight">Elevated Living for Modern Souls</h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-xl mb-10">Discover our curated selection of home essentials designed for comfort, aesthetics, and lasting quality.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/shop" className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-all flex items-center gap-2">
              Shop Collection <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="px-8 py-4 bg-transparent border border-white/40 text-white rounded-full font-bold hover:bg-white/10 transition-all">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Featured Essentials</h2>
            <p className="text-gray-500">Hand-picked by our design team for your perfect space.</p>
          </div>
          <Link to="/shop" className="text-indigo-600 font-semibold hover:underline flex items-center gap-1">View All <ChevronRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Browse by Lifestyle</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:h-[500px]">
            <div className="relative group overflow-hidden rounded-2xl md:col-span-2 row-span-2">
              <img src="https://picsum.photos/seed/living/800/800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Living" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Living Space</h3>
                <Link to="/shop?category=Furniture" className="text-white/80 hover:text-white flex items-center gap-2">Explore <ArrowRight size={16} /></Link>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl">
              <img src="https://picsum.photos/seed/kitchen/600/600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Kitchen" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Link to="/shop?category=Kitchen" className="px-6 py-2 bg-white rounded-full font-semibold">Kitchen</Link>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl">
              <img src="https://picsum.photos/seed/bedroom/600/600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Bedroom" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <Link to="/shop?category=Bedding" className="px-6 py-2 bg-white rounded-full font-semibold">Bedding</Link>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl md:col-span-2">
               <img src="https://picsum.photos/seed/decor/800/400" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Decor" />
               <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Home Accents</h3>
                <Link to="/shop?category=Home%20Decor" className="text-white/80 hover:text-white flex items-center gap-2">Shop Now <ArrowRight size={16} /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-20"><Zap size={120} /></div>
          <h2 className="text-3xl font-bold mb-4">Join the Waks Club</h2>
          <p className="text-indigo-100 mb-8 max-w-xl mx-auto">Be the first to know about new arrivals, limited editions, and exclusive design insights. Get 15% off your first order.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Your email address" className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:ring-2 focus:ring-indigo-300 outline-none" />
            <button className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold hover:bg-gray-100 transition-all">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Explicitly type ProductCard as React.FC to fix the 'key' property error
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="group">
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden rounded-2xl bg-gray-100 mb-4">
        <img 
          src={product.images[0]} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          alt={product.name} 
        />
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 bg-white rounded-full shadow-md hover:text-red-500 transition-colors">
            <Heart size={20} />
          </button>
        </div>
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase rounded-full">Low Stock</span>
          </div>
        )}
      </Link>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{product.category}</p>
          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>
          <div className="flex items-center gap-1 mt-1 text-amber-400">
            <Star size={12} fill="currentColor" />
            <span className="text-xs text-gray-500 font-medium">{product.rating}</span>
          </div>
        </div>
        <p className="font-bold text-lg">${product.price}</p>
      </div>
    </div>
  );
};

const ProductPage = ({ products, addToCart }: { products: Product[], addToCart: (p: Product) => void }) => {
  // Fix the invalid useNavigate prototype usage and use useParams instead
  const { id: productId } = useParams<{ id: string }>();
  const product = products.find(p => p.id === productId);
  
  if (!product) return <div className="p-20 text-center">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all">
                <img src={`https://picsum.photos/seed/${product.id + i}/200/200`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-4">{product.category}</p>
          <h1 className="text-4xl font-bold mb-6">{product.name}</h1>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />)}
            </div>
            <span className="text-gray-400">({product.rating} / 5.0)</span>
            <span className="text-gray-300">|</span>
            <span className="text-green-600 font-semibold">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
          </div>
          <p className="text-3xl font-bold mb-8">${product.price}</p>
          <p className="text-gray-500 leading-relaxed mb-10">{product.description}</p>
          
          <div className="space-y-6 mb-10">
             {Object.entries(product.specs).map(([key, value]) => (
               <div key={key} className="flex justify-between border-b border-gray-100 pb-2">
                 <span className="text-gray-500 font-medium">{key}</span>
                 <span className="text-gray-900">{value}</span>
               </div>
             ))}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => addToCart(product)}
              className="flex-1 bg-indigo-600 text-white py-4 rounded-full font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button className="p-4 border border-gray-200 rounded-full hover:bg-gray-50 transition-all">
              <Heart size={20} />
            </button>
          </div>
          
          <p className="mt-8 text-xs text-gray-400 text-center uppercase tracking-widest">SKU: {product.sku}</p>
        </div>
      </div>
    </div>
  );
};

const CartPage = ({ cart, updateQuantity, removeFromCart }: { 
  cart: CartItem[], 
  updateQuantity: (id: string, q: number) => void,
  removeFromCart: (id: string) => void
}) => {
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = 15;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 text-gray-400 mb-6">
          <ShoppingCart size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-12">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {cart.map(item => (
            <div key={item.productId} className="flex gap-6 pb-8 border-b border-gray-100">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                <img src={item.product.images[0]} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">{item.product.category}</p>
                  </div>
                  <p className="font-bold text-lg">${item.product.price * item.quantity}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-2">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-1 hover:text-indigo-600"><Minus size={16} /></button>
                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-1 hover:text-indigo-600"><Plus size={16} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={20} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-8 h-fit space-y-6">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Tax (calculated at checkout)</span>
              <span>$0.00</span>
            </div>
            <div className="h-px bg-gray-100 w-full" />
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout" className="block w-full text-center bg-indigo-600 text-white py-4 rounded-full font-bold hover:bg-indigo-700 transition-all">
            Proceed to Checkout
          </Link>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <CheckCircle size={14} className="text-green-500" />
            Secure checkout powered by Stripe
          </div>
        </div>
      </div>
    </div>
  );
};

const ShopPage = ({ products }: { products: Product[] }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory !== 'All') {
      filtered = products.filter(p => p.category === selectedCategory);
    }
    
    if (sortBy === 'Price Low') return [...filtered].sort((a,b) => a.price - b.price);
    if (sortBy === 'Price High') return [...filtered].sort((a,b) => b.price - a.price);
    return filtered;
  }, [products, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Shop All</h1>
          <p className="text-gray-500">Showing {filteredProducts.length} results</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none w-full bg-white border border-gray-200 px-6 py-3 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
            </select>
            <Filter size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative group flex-1 md:flex-none">
             <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-full bg-white border border-gray-200 px-6 py-3 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Newest</option>
              <option>Price Low</option>
              <option>Price High</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'u1',
    name: 'Admin User',
    email: 'admin@waks.com',
    role: 'admin',
    orders: [],
    wishlist: []
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId: product.id, product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, q: number) => {
    if (q < 1) return removeFromCart(id);
    setCart(prev => prev.map(item => item.productId === id ? { ...item, quantity: q } : item));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.productId !== id));
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} user={currentUser} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage products={products} />} />
            <Route path="/shop" element={<ShopPage products={products} />} />
            <Route path="/product/:id" element={<ProductPage products={products} addToCart={addToCart} />} />
            <Route path="/cart" element={<CartPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />} />
            <Route path="/admin/*" element={<AdminDashboard products={products} setProducts={setProducts} />} />
            <Route path="*" element={<div className="p-20 text-center">Page Coming Soon</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
