import React from 'react';
import { Package, Activity } from 'lucide-react';

export default function Navbar({ backendConnected }) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-tr from-indigo-600 to-purple-500 p-2.5 rounded-xl shadow-md shadow-indigo-500/20">
          <Package className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            InventoryIA
          </h1>
          <p className="text-xs text-slate-400 font-medium">Sistema de Gestión & Analytics (V1)</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700/60 backdrop-blur-sm">
        <Activity className={`w-4 h-4 ${backendConnected ? 'text-emerald-400 animate-pulse' : 'text-rose-400'}`} />
        <span className="text-xs font-semibold text-slate-300">
          Backend: {backendConnected ? (
            <span className="text-emerald-400 font-medium">Conectado (PostgreSQL)</span>
          ) : (
            <span className="text-rose-400 font-medium">Desconectado</span>
          )}
        </span>
      </div>
    </header>
  );
}
