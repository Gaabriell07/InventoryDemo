import React from 'react';
import { LayoutDashboard, Package, Tags, Users, History } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'categories', label: 'Categorías', icon: Tags },
    { id: 'suppliers', label: 'Proveedores', icon: Users },
    { id: 'movements', label: 'Movimientos', icon: History },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 p-4 flex flex-col justify-between min-h-[calc(100vh-73px)]">
      <nav className="space-y-1.5">
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Menú Principal
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="bg-slate-800/40 border border-slate-800 p-3.5 rounded-2xl">
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>InventoryIA V1 Completo</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Spring Boot + PostgreSQL + React</p>
      </div>
    </aside>
  );
}
