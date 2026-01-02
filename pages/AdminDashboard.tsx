
import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Box, 
  Users, 
  ShoppingCart, 
  Settings, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Loader2,
  ChevronLeft,
  BarChart3
} from 'lucide-react';
import { Product } from '../types';
import { generateProductDescription } from '../geminiService';
import { CATEGORIES } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const MOCK_STATS = [
  { name: 'Mon', sales: 4000, orders: 24 },
  { name: 'Tue', sales: 3000, orders: 18 },
  { name: 'Wed', sales: 2000, orders: 12 },
  { name: 'Thu', sales: 2780, orders: 20 },
  { name: 'Fri', sales: 1890, orders: 15 },
  { name: 'Sat', sales: 2390, orders: 19 },
  { name: 'Sun', sales: 3490, orders: 22 },
];

interface AdminProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const AdminOverview = ({ products }: { products: Product[] }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><TrendingUp size={24} /></div>
          <span className="text-green-500 text-xs font-bold flex items-center">+12.5% <ArrowUpRight size={12} /></span>
        </div>
        <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
        <h3 className="text-2xl font-bold">$124,592</h3>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ShoppingCart size={24} /></div>
          <span className="text-green-500 text-xs font-bold flex items-center">+5.2% <ArrowUpRight size={12} /></span>
        </div>
        <p className="text-gray-500 text-sm mb-1">Total Orders</p>
        <h3 className="text-2xl font-bold">1,482</h3>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Box size={24} /></div>
          <span className="text-amber-500 text-xs font-bold flex items-center">4 low stock</span>
        </div>
        <p className="text-gray-500 text-sm mb-1">Inventory Items</p>
        <h3 className="text-2xl font-bold">{products.length}</h3>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Users size={24} /></div>
          <span className="text-rose-500 text-xs font-bold flex items-center">+2.1% <ArrowUpRight size={12} /></span>
        </div>
        <p className="text-gray-500 text-sm mb-1">Active Customers</p>
        <h3 className="text-2xl font-bold">8,294</h3>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold mb-8">Sales Performance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_STATS}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold mb-8">Recent Orders</h3>
        <div className="space-y-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">JD</div>
              <div className="flex-1">
                <p className="text-sm font-bold">John Doe</p>
                <p className="text-xs text-gray-500">Order #WKS-928{i}</p>
              </div>
              <span className="text-sm font-bold">$129.00</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ProductManager = ({ products, setProducts }: AdminProps) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <button 
          onClick={() => navigate('/admin/products/new')}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>
      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={product.images[0]} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                <td className="px-6 py-4 font-bold text-sm">${product.price}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${product.stock < 10 ? 'text-rose-500' : 'text-gray-900'}`}>{product.stock} units</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${product.stock > 0 ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
                    {product.stock > 0 ? 'Active' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"><Edit3 size={18} /></button>
                    <button 
                      onClick={() => setProducts(prev => prev.filter(p => p.id !== product.id))}
                      className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProductForm = ({ products, setProducts }: AdminProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[1],
    price: '',
    stock: '',
    features: '',
    description: '',
    sku: ''
  });

  const handleGenerateDescription = async () => {
    if (!formData.name || !formData.features) {
      alert("Please enter a product name and some key features first.");
      return;
    }
    setLoading(true);
    const desc = await generateProductDescription(formData.name, formData.category, formData.features);
    setFormData(prev => ({ ...prev, description: desc }));
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      sku: formData.sku || `WKS-${Math.floor(Math.random() * 1000)}`,
      images: [`https://picsum.photos/seed/${formData.name}/800/800`],
      rating: 5,
      reviews: [],
      specs: { 'Material': 'Quality Choice' }
    };
    setProducts(prev => [...prev, newProduct]);
    navigate('/admin/products');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 font-medium">
        <ChevronLeft size={20} /> Back to Products
      </button>
      <h2 className="text-3xl font-bold mb-8">Add New Product</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Product Name</label>
            <input 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="e.g., Silk Sleep Mask"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Category</label>
            <select 
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
            >
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Price ($)</label>
            <input 
              required type="number"
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.price}
              onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Stock Quantity</label>
            <input 
              required type="number"
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.stock}
              onChange={e => setFormData(prev => ({ ...prev, stock: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-gray-700">Description</label>
            <button 
              type="button"
              disabled={loading}
              onClick={handleGenerateDescription}
              className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800 disabled:opacity-50"
            >
              {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              Generate with Gemini AI
            </button>
          </div>
          <textarea 
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="Tell us about this product..."
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Key Features (for AI generation)</label>
          <input 
            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="e.g., pure silk, hypoallergenic, machine washable"
            value={formData.features}
            onChange={e => setFormData(prev => ({ ...prev, features: e.target.value }))}
          />
        </div>

        <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
          Save Product
        </button>
      </form>
    </div>
  );
};

const AdminDashboard: React.FC<AdminProps> = ({ products, setProducts }) => {
  const location = useLocation();
  const menuItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Box },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-indigo-600">WAKS</Link>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map(item => (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'}`}
            >
              <item.icon size={20} />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-gray-100">
           <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-rose-600 transition-colors text-sm font-medium">
             <Edit3 size={18} /> Exit Admin
           </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="relative max-w-md w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              placeholder="Search data, orders, items..." 
              className="w-full bg-gray-50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              <ShoppingCart size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">A</div>
          </div>
        </header>

        <main className="p-8 overflow-y-auto">
          <Routes>
            <Route index element={<AdminOverview products={products} />} />
            <Route path="products" element={<ProductManager products={products} setProducts={setProducts} />} />
            <Route path="products/new" element={<ProductForm products={products} setProducts={setProducts} />} />
            <Route path="*" element={<div className="p-20 text-center text-gray-400 font-medium">Coming Soon in v1.1</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
