// lib/calculations.ts

import { DatosLaborales, LiquidacionResultados } from '../types';
import { TECHO_INDEMNIZACION_DESPIDO, TECHO_INDEMNIZACION_RENUNCIA } from './constants';

export const calcularLiquidacion = (datos: DatosLaborales): LiquidacionResultados => {
  const {
    salarioMensual,
    aniosLaborados,
    mesesLaborados,
    causaFinalizacion,
    horasExtrasDiurnas,
    horasExtrasNocturnas,
    diasAsueto,
    diasDescanso
  } = datos;

  // 1. SALARIO BÁSICO DIARIO (SBD)
  const sbd = salarioMensual / 30;
  const salarioHora = sbd / 8; // Asumiendo jornada ordinaria de 8 horas

  // 2. VACACIÓN PROPORCIONAL
  // Cálculo de vacación completa: SBD x 15 x 1.3
  const vacacionCompleta = sbd * 15 * 1.3;
  // Vacación proporcional = (Total de vacaciones x meses trabajados) / 12
  const vacacionProporcional = (vacacionCompleta * mesesLaborados) / 12;

  // 3. AGUINALDO PROPORCIONAL
  let diasAguinaldo = 15;
  if (aniosLaborados >= 3 && aniosLaborados < 10) diasAguinaldo = 19; //[cite: 1]
  if (aniosLaborados >= 10) diasAguinaldo = 21; //[cite: 1]
  
  const aguinaldoCompleto = sbd * diasAguinaldo;
  const aguinaldoProporcionalDiario = aguinaldoCompleto / 360; // Base de año comercial[cite: 1]
  const diasTrabajadosUltimoPeriodo = mesesLaborados * 30;
  const aguinaldoProporcional = aguinaldoProporcionalDiario * diasTrabajadosUltimoPeriodo;

  // 4. INDEMNIZACIÓN O COMPENSACIÓN POR RENUNCIA
  let indemnizacion = 0;
  
  if (causaFinalizacion === 'despido') {
    // Techo: 4 salarios mínimos vigentes[cite: 1]
    const salarioBaseDespido = Math.min(salarioMensual, TECHO_INDEMNIZACION_DESPIDO);
    
    // 30 días de salario por año[cite: 1] (Equivale al salario mensual base)
    const indemAnios = salarioBaseDespido * aniosLaborados;
    // Proporcional de meses: (SBM / 360) * (meses * 30)[cite: 1]
    const indemMeses = (salarioBaseDespido / 360) * (mesesLaborados * 30);
    
    indemnizacion = indemAnios + indemMeses;
  } 
  else if (causaFinalizacion === 'renuncia') {
    // Requiere mínimo 2 años de servicio continuo[cite: 1]
    if (aniosLaborados >= 2) {
      // Techo: 2 salarios mínimos vigentes[cite: 1]
      const salarioBaseRenuncia = Math.min(salarioMensual, TECHO_INDEMNIZACION_RENUNCIA);
      const sbdRenuncia = salarioBaseRenuncia / 30;
      
      // 15 días de salario por año[cite: 1]
      const indemAnios = (sbdRenuncia * 15) * aniosLaborados;
      const indemMeses = sbdRenuncia * 1.25 * mesesLaborados; // 15 días / 12 meses = 1.25 días/mes
      
      indemnizacion = indemAnios + indemMeses;
    }
  }

  // 5. JORNADAS EXTRAORDINARIAS Y DÍAS ESPECIALES
  // Horas Extras Diurnas (Recargo 100%): HE = H x HL x 2[cite: 1]
  const subtotalExtrasDiurnas = salarioHora * horasExtrasDiurnas * 2;
  
  // Horas Extras Nocturnas: Hora base nocturna = HD x 1.25[cite: 1]
  const tarifaNocturna = salarioHora * 1.25;
  const subtotalExtrasNocturnas = tarifaNocturna * horasExtrasNocturnas * 2; // Extra lleva recargo 100% adicional
  
  // Días de Asueto: SE = SBD x 2[cite: 1]
  const subtotalAsuetos = (sbd * 2) * diasAsueto;
  
  // Días de Descanso Semanal: SDD = SBD x 1.5[cite: 1]
  const subtotalDescanso = (sbd * 1.5) * diasDescanso;

  // 6. DEDUCCIONES LEGALES (ISSS 3%, AFP 7.25%)
  // Solo aplicamos descuentos a ingresos gravables (Vacaciones, Extras, Asuetos)
  const montoSujetoDescuentos = vacacionProporcional + subtotalExtrasDiurnas + subtotalExtrasNocturnas + subtotalAsuetos + subtotalDescanso;
  
  const deduccionISSS = montoSujetoDescuentos * 0.03;
  const deduccionAFP = montoSujetoDescuentos * 0.0725;
  const deduccionRenta = 0; // Para simplificar fines académicos a menos que existan tablas complejas.

  const subtotalBruto = vacacionProporcional + aguinaldoProporcional + indemnizacion + montoSujetoDescuentos;
  const totalNeto = subtotalBruto - (deduccionISSS + deduccionAFP + deduccionRenta);

  return {
    vacacionProporcional,
    aguinaldoProporcional,
    indemnizacion,
    subtotalExtrasDiurnas,
    subtotalExtrasNocturnas,
    subtotalAsuetos,
    subtotalDescanso,
    deduccionISSS,
    deduccionAFP,
    deduccionRenta,
    totalNeto
  };
};