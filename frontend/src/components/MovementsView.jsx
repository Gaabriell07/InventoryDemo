import React, { useState } from 'react';
import { Plus, ArrowDownRight, ArrowUpRight, RefreshCw, X, History, Package } from 'lucide-react';
import { createMovement } from '../services/api';

export default function MovementsView({ movements, products, suppliers, onRefresh }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [productId, setProductId] = useState('');
  const [type, setType] = useState('ENTRY');
  const [quantity, setQuantity] = useState('1');
  const [supplierId, setSupplierId] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const openModal = () => {
    setProductId(products.length > 0 ? products[0].id : '');
    setType('ENTRY');
    setQuantity('1');
    setSupplierId('');
    setNotes('');
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      productId: parseInt(productId, 10),
      type: type,
      quantity: parseInt(quantity, 10),
      supplierId: supplierId ? parseInt(supplierId, 10) : null,
      notes: notes.trim(),
    };

    try {
      await createMovement(payload);
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      setError(err.message || 'Error al registrar el movimiento');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {/* Encabezado y Botón de nuevo movimiento */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-indigo-500/10 rounded-xl">
            <History className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Bitácora de Movimientos</h3>
            <p className="text-xs text-slate-400">Historial completo de Entradas, Salidas y Ajustes de Stock</p>
          </div>
        </div>

        <button
          onClick={openModal}
          disabled={products.length === 0}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Movimiento</span>
        </button>
      </div>

      {/* Tabla del Historial de Movimientos */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-700/60">
              <tr>
                <th className="px-5 py-3.5">Fecha / Hora</th>
                <th className="px-5 py-3.5">Tipo</th>
                <th className="px-5 py-3.5">Producto</th>
                <th className="px-5 py-3.5 text-center">Cantidad</th>
                <th className="px-5 py-3.5">Proveedor</th>
                <th className="px-5 py-3.5">Notas / Motivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 text-slate-200">
              {movements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    No se han registrado movimientos de inventario aún.
                  </td>
                </tr>
              ) : (
                movements.map((mov) => {
                  let badgeStyle = '';
                  let badgeText = '';
                  let Icon = ArrowUpRight;

                  if (mov.type === 'ENTRY') {
                    badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                    badgeText = 'ENTRADA';
                    Icon = ArrowUpRight;
                  } else if (mov.type === 'EXIT') {
                    badgeStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
                    badgeText = 'SALIDA';
                    Icon = ArrowDownRight;
                  } else {
                    badgeStyle = 'bg-sky-500/20 text-sky-300 border-sky-500/30';
                    badgeText = 'AJUSTE';
                    Icon = RefreshCw;
                  }

                  return (
                    <tr key={mov.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {formatDate(mov.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center space-x-1 border px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeStyle}`}>
                          <Icon className="w-3 h-3" />
                          <span>{badgeText}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-slate-100">{mov.product ? mov.product.name : 'Producto eliminado'}</p>
                        {mov.product && <p className="text-[10px] font-mono text-slate-400">SKU: {mov.product.sku}</p>}
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-bold text-sm">
                        {mov.type === 'ENTRY' && <span className="text-emerald-400">+{mov.quantity}</span>}
                        {mov.type === 'EXIT' && <span className="text-rose-400">-{mov.quantity}</span>}
                        {mov.type === 'ADJUSTMENT' && <span className="text-sky-400">{mov.quantity} un.</span>}
                      </td>
                      <td className="px-5 py-3.5 text-slate-300">
                        {mov.supplier ? (
                          <span className="font-medium text-slate-200">{mov.supplier.name}</span>
                        ) : (
                          <span className="text-slate-500 italic">-</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs">
                        {mov.notes || <span className="italic text-slate-500">Sin notas</span>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registrar Movimiento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-4">
              <Package className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Registrar Movimiento de Inventario</h3>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Producto *</label>
                <select
                  required
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.sku}] {p.name} — Stock actual: {p.stock} un.
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Movimiento *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ENTRY">🟢 ENTRADA (Aumenta stock)</option>
                    <option value="EXIT">🔴 SALIDA (Disminuye stock)</option>
                    <option value="ADJUSTMENT">🔵 AJUSTE (Auditoría física)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {type === 'ADJUSTMENT' ? 'Nuevo Stock Real *' : 'Cantidad *'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Proveedor (Opcional)</label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Sin Proveedor --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notas / Motivo / N° de Guía</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. Compra Factura F001-982 o Venta rápida"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Registrar Movimiento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
