import React, { useState } from 'react';
import { Plus, Trash2, Users, Building, Mail, Phone, MapPin } from 'lucide-react';
import { createSupplier, deleteSupplier } from '../services/api';

export default function SuppliersView({ suppliers, onRefresh }) {
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createSupplier({
        name: name.trim(),
        contactName: contactName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      setName('');
      setContactName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setSuccess('Proveedor registrado exitosamente');
      onRefresh();
    } catch (err) {
      setError(err.message || 'Error al registrar proveedor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este proveedor?')) return;
    try {
      await deleteSupplier(id);
      onRefresh();
    } catch (err) {
      alert(err.message || 'Error al eliminar proveedor');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Formulario para registrar proveedor */}
      <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl h-fit shadow-lg">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="p-2 bg-indigo-500/10 rounded-xl">
            <Building className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-base font-bold text-white">Nuevo Proveedor</h3>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nombre de la Empresa / Razón Social *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Lenovo Perú S.A."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Persona de Contacto
            </label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Ej. Carlos Mendoza"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ventas@empresa.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+51 987654321"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Dirección / Sede</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Av. Principal 123, Lima"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>{loading ? 'Guardando...' : 'Guardar Proveedor'}</span>
          </button>
        </form>
      </div>

      {/* Lista de Proveedores */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Directorio de Proveedores</h3>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Total: {suppliers.length}
          </span>
        </div>

        {suppliers.length === 0 ? (
          <div className="bg-slate-800/40 border border-slate-700/60 p-8 rounded-2xl text-center">
            <p className="text-slate-400 text-sm">No hay proveedores registrados aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {suppliers.map((sup) => (
              <div
                key={sup.id}
                className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl space-y-2 hover:border-slate-600 transition-all shadow-md group relative"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {sup.name}
                    </h4>
                    {sup.contactName && (
                      <p className="text-xs text-slate-400 font-medium">Contacto: {sup.contactName}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(sup.id)}
                    title="Eliminar proveedor"
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-700/40 space-y-1.5 text-[11px] text-slate-300">
                  {sup.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{sup.email}</span>
                    </div>
                  )}
                  {sup.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{sup.phone}</span>
                    </div>
                  )}
                  {sup.address && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">{sup.address}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
