"use client";

import { useState } from 'react';
import { DatosLaborales, LiquidacionResultados } from '../types';
import { calcularLiquidacion } from '../lib/calculations';
import ResultsPanel from './ResultsPanel';

export default function CalculatorForm() {
  const [formData, setFormData] = useState({
    salarioMensual: '' as number | string,
    aniosLaborados: '' as number | string,
    mesesLaborados: '' as number | string,
    causaFinalizacion: 'despido',
    horasExtrasDiurnas: '' as number | string,
    horasExtrasNocturnas: '' as number | string,
    diasAsueto: '' as number | string,
    diasDescanso: '' as number | string,
  });

  const [noAplicaJornadas, setNoAplicaJornadas] = useState(false);
  const [resultados, setResultados] = useState<LiquidacionResultados | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNoAplicaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setNoAplicaJornadas(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        horasExtrasDiurnas: '',
        horasExtrasNocturnas: '',
        diasAsueto: '',
        diasDescanso: '',
      }));
    }
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const datosLimpios: DatosLaborales = {
      salarioMensual: Number(formData.salarioMensual) || 0,
      aniosLaborados: Number(formData.aniosLaborados) || 0,
      mesesLaborados: Number(formData.mesesLaborados) || 0,
      causaFinalizacion: formData.causaFinalizacion as 'despido' | 'renuncia',
      horasExtrasDiurnas: Number(formData.horasExtrasDiurnas) || 0,
      horasExtrasNocturnas: Number(formData.horasExtrasNocturnas) || 0,
      diasAsueto: Number(formData.diasAsueto) || 0,
      diasDescanso: Number(formData.diasDescanso) || 0,
    };

    const calculo = calcularLiquidacion(datosLimpios);
    setResultados(calculo);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
        
        {/* BLOQUE 1 — Datos financieros y antigüedad */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-100 pb-2 mb-4">
            1. Datos Financieros y Antigüedad
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ingreso Mensual ($)</label>
              <input 
                type="number" 
                name="salarioMensual" 
                min="0.01" 
                step="0.01"
                required
                value={formData.salarioMensual} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Años Laborados</label>
              <input 
                type="number" 
                name="aniosLaborados" 
                min="0" 
                required
                value={formData.aniosLaborados} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meses Laborados</label>
              <input 
                type="number" 
                name="mesesLaborados" 
                min="0" 
                max="11" 
                required
                value={formData.mesesLaborados} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
          </div>
        </section>

        {/* BLOQUE 2 — Causa de finalización */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-100 pb-2 mb-4">
            2. Causa de Finalización
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center space-x-2 cursor-pointer p-3 border rounded hover:bg-gray-50 flex-1">
              <input 
                type="radio" 
                name="causaFinalizacion" 
                value="despido"
                checked={formData.causaFinalizacion === 'despido'}
                onChange={handleChange}
                className="text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="text-gray-700 font-medium">Despido Injustificado</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer p-3 border rounded hover:bg-gray-50 flex-1">
              <input 
                type="radio" 
                name="causaFinalizacion" 
                value="renuncia"
                checked={formData.causaFinalizacion === 'renuncia'}
                onChange={handleChange}
                className="text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="text-gray-700 font-medium">Renuncia Voluntaria</span>
            </label>
          </div>
        </section>

        {/* BLOQUE 3 — Jornadas extraordinarias y días especiales */}
        <section className="mb-8">
          <div className="flex justify-between items-center border-b-2 border-blue-100 pb-2 mb-4">
            <h2 className="text-xl font-bold text-blue-900">
              3. Jornadas Especiales
            </h2>
            <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
              <input 
                type="checkbox" 
                checked={noAplicaJornadas}
                onChange={handleNoAplicaChange}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>No aplica</span>
            </label>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity ${noAplicaJornadas ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horas Extras Diurnas</label>
              <input 
                type="number" 
                name="horasExtrasDiurnas" 
                min="0"
                required={!noAplicaJornadas}
                disabled={noAplicaJornadas}
                value={formData.horasExtrasDiurnas} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horas Extras Nocturnas</label>
              <input 
                type="number" 
                name="horasExtrasNocturnas" 
                min="0"
                required={!noAplicaJornadas}
                disabled={noAplicaJornadas}
                value={formData.horasExtrasNocturnas} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Días de Asueto Laborados</label>
              <input 
                type="number" 
                name="diasAsueto" 
                min="0"
                required={!noAplicaJornadas}
                disabled={noAplicaJornadas}
                value={formData.diasAsueto} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Días de Descanso Semanal Laborados</label>
              <input 
                type="number" 
                name="diasDescanso" 
                min="0"
                required={!noAplicaJornadas}
                disabled={noAplicaJornadas}
                value={formData.diasDescanso} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-black"
              />
            </div>
          </div>
        </section>

        <button 
          type="submit" 
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md text-lg"
        >
          Calcular Liquidación
        </button>
      </form>

      <ResultsPanel resultados={resultados} />
    </>
  );
}