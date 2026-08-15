import React from 'react';
import { Package, Tags, AlertTriangle, DollarSign, Plus } from 'lucide-react';

export default function Dashboard({ products, categories, setActiveTab }) {
  const lowStockProducts = products.filter(
    (p) => p.stock <= (p.minStock ?? 5)
  );

  const totalInventoryValue = products.reduce(
    (acc, p) => acc + (Number(p.price) || 0) * (Number(p.stock) || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Banner de bienvenida */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-800/80 to-purple-900/40 p-6 rounded-2xl border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">
            Panel de Control de Inventario
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Bienvenido a **InventoryIA V1**. Gestiona tus productos, categorías y supervisa las alertas de stock crítico en tiempo real.
          </p>
          <div className="flex items-center space-x-3 mt-4">
            <button
              onClick={() => setActiveTab('products')}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Producto</span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className="inline-flex items-center space-x-2 bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-600 transition-all"
            >
              <Tags className="w-4 h-4" />
              <span>Nueva Categoría</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Productos */}
        <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Productos</span>
            <div className="p-2.5 bg-indigo-500/10 rounded-xl">
              <Package className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{products.length}</p>
          <p className="text-xs text-slate-400 mt-1">Registrados en PostgreSQL</p>
        </div>

        {/* Total Categorías */}
        <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Categorías</span>
            <div className="p-2.5 bg-purple-500/10 rounded-xl">
              <Tags className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{categories.length}</p>
          <p className="text-xs text-slate-400 mt-1">Sectores activos</p>
        </div>

        {/* Alertas Stock Bajo */}
        <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Stock Crítico</span>
            <div className={`p-2.5 rounded-xl ${lowStockProducts.length > 0 ? 'bg-amber-500/15' : 'bg-emerald-500/10'}`}>
              <AlertTriangle className={`w-5 h-5 ${lowStockProducts.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`} />
            </div>
          </div>
          <p className={`text-3xl font-extrabold mt-3 ${lowStockProducts.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {lowStockProducts.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Requieren reabastecimiento</p>
        </div>

        {/* Valor Total del Inventario */}
        <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Valor Estimado</span>
            <div className="p-2.5 bg-emerald-500/10 rounded-xl">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">
            ${totalInventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-400 mt-1">Suma acumulada de stock</p>
        </div>
      </div>

      {/* Alertas de Stock Bajo en detalle */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5">
          <div className="flex items-center space-x-2.5 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-amber-300">
              Productos con Stock Mínimo Alcanzado
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-slate-900/80 border border-amber-500/20 p-3.5 rounded-xl flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-200">{prod.name}</p>
                  <p className="text-xs text-slate-400">SKU: {prod.sku}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-lg border border-amber-500/30">
                    {prod.stock} un. (Mín: {prod.minStock})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
