import React, { useState } from 'react';
import { Plus, Trash2, Tags, FolderPlus } from 'lucide-react';
import { createCategory, deleteCategory } from '../services/api';

export default function CategoriesView({ categories, onRefresh }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
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
      await createCategory({ name: name.trim(), description: description.trim() });
      setName('');
      setDescription('');
      setSuccess('Categoría creada exitosamente');
      onRefresh();
    } catch (err) {
      setError(err.message || 'Error al crear categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;
    try {
      await deleteCategory(id);
      onRefresh();
    } catch (err) {
      alert(err.message || 'Error al eliminar categoría');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Formulario para agregar categoría */}
      <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl h-fit shadow-lg">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="p-2 bg-purple-500/10 rounded-xl">
            <FolderPlus className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-base font-bold text-white">Nueva Categoría</h3>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Electrónica, Ropa, Abarrotes"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Descripción (Opcional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descripción del sector..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-purple-600/30 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{loading ? 'Guardando...' : 'Guardar Categoría'}</span>
          </button>
        </form>
      </div>

      {/* Lista de Categorías */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Tags className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Categorías Registradas</h3>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Total: {categories.length}
          </span>
        </div>

        {categories.length === 0 ? (
          <div className="bg-slate-800/40 border border-slate-700/60 p-8 rounded-2xl text-center">
            <p className="text-slate-400 text-sm">No hay categorías registradas aún.</p>
            <p className="text-xs text-slate-500 mt-1">Crea la primera categoría usando el formulario de la izquierda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl flex justify-between items-start hover:border-slate-600 transition-all shadow-md group"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {cat.description || 'Sin descripción'}
                  </p>
                  <span className="inline-block mt-2 text-[10px] text-slate-500 font-mono">
                    ID: #{cat.id}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  title="Eliminar categoría"
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
