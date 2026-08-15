import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProductsView from './components/ProductsView';
import CategoriesView from './components/CategoriesView';
import SuppliersView from './components/SuppliersView';
import MovementsView from './components/MovementsView';
import { getCategories, getProducts, getSuppliers, getMovements } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [movements, setMovements] = useState([]);
  const [search, setSearch] = useState('');
  const [backendConnected, setBackendConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [catData, prodData, supData, movData] = await Promise.all([
        getCategories(),
        getProducts(search),
        getSuppliers(),
        getMovements(),
      ]);
      setCategories(catData || []);
      setProducts(prodData || []);
      setSuppliers(supData || []);
      setMovements(movData || []);
      setBackendConnected(true);
    } catch (err) {
      console.error('Error conectando al backend:', err);
      setBackendConnected(false);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar backendConnected={backendConnected} />

      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 overflow-y-auto max-w-7xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-3">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 font-medium">Cargando datos de InventoryIA...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  products={products}
                  categories={categories}
                  setActiveTab={setActiveTab}
                />
              )}
              {activeTab === 'products' && (
                <ProductsView
                  products={products}
                  categories={categories}
                  search={search}
                  setSearch={setSearch}
                  onRefresh={fetchData}
                />
              )}
              {activeTab === 'categories' && (
                <CategoriesView
                  categories={categories}
                  onRefresh={fetchData}
                />
              )}
              {activeTab === 'suppliers' && (
                <SuppliersView
                  suppliers={suppliers}
                  onRefresh={fetchData}
                />
              )}
              {activeTab === 'movements' && (
                <MovementsView
                  movements={movements}
                  products={products}
                  suppliers={suppliers}
                  onRefresh={fetchData}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
