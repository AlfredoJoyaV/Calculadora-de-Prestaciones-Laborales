// components/ResultsPanel.tsx

import { LiquidacionResultados } from '../types';

interface ResultsPanelProps {
  resultados: LiquidacionResultados | null;
}

export default function ResultsPanel({ resultados }: ResultsPanelProps) {
  // Si los resultados aún no existen (el usuario no ha presionado calcular), no mostramos nada
  if (!resultados) return null;

  // Función nativa de JavaScript para formatear a dólares de forma segura y consistente
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="mt-8 bg-blue-50 p-6 md:p-8 rounded-xl border border-blue-200 shadow-inner animate-fade-in">
      <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center border-b-2 border-blue-200 pb-4">
        Resumen de Liquidación
      </h2>

      {/* SECCIÓN DE INGRESOS */}
      <div className="space-y-3 mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Ingresos a Favor</h3>
        <div className="flex justify-between text-gray-700">
          <span>Vacación proporcional</span>
          <span className="font-medium">{formatCurrency(resultados.vacacionProporcional)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Aguinaldo proporcional</span>
          <span className="font-medium">{formatCurrency(resultados.aguinaldoProporcional)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Indemnización / Compensación</span>
          <span className="font-medium">{formatCurrency(resultados.indemnizacion)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Horas extras diurnas</span>
          <span className="font-medium">{formatCurrency(resultados.subtotalExtrasDiurnas)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Horas extras nocturnas</span>
          <span className="font-medium">{formatCurrency(resultados.subtotalExtrasNocturnas)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Días de asueto laborados</span>
          <span className="font-medium">{formatCurrency(resultados.subtotalAsuetos)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Días de descanso semanal</span>
          <span className="font-medium">{formatCurrency(resultados.subtotalDescanso)}</span>
        </div>
      </div>

      {/* SECCIÓN DE DEDUCCIONES (Requisito de la rúbrica) */}
      <div className="space-y-3 mb-6 pt-4 border-t border-blue-200">
        <h3 className="text-lg font-semibold text-red-700">Deducciones de Ley</h3>
        <div className="flex justify-between text-red-600">
          <span>ISSS (3%)</span>
          <span>- {formatCurrency(resultados.deduccionISSS)}</span>
        </div>
        <div className="flex justify-between text-red-600">
          <span>AFP (7.25%)</span>
          <span>- {formatCurrency(resultados.deduccionAFP)}</span>
        </div>
        {resultados.deduccionRenta > 0 && (
          <div className="flex justify-between text-red-600">
            <span>Renta</span>
            <span>- {formatCurrency(resultados.deduccionRenta)}</span>
          </div>
        )}
      </div>

      {/* TOTAL GENERAL */}
      <div className="pt-4 border-t-4 border-blue-900 flex justify-between items-center">
        <span className="text-xl font-bold text-gray-900">TOTAL NETO A PAGAR</span>
        <span className="text-2xl font-black text-blue-700 bg-white px-4 py-2 rounded-lg border border-blue-200 shadow-sm">
          {formatCurrency(resultados.totalNeto)}
        </span>
      </div>
    </div>
  );
}