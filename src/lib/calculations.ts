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
  const salarioHora = sbd / 8; 

  // 2. VACACIÓN PROPORCIONAL
  const vacacionCompleta = sbd * 15 * 1.3;
  const vacacionProporcional = (vacacionCompleta * mesesLaborados) / 12;

  // 3. AGUINALDO PROPORCIONAL
  let diasAguinaldo = 15;
  if (aniosLaborados >= 3 && aniosLaborados < 10) diasAguinaldo = 19; 
  if (aniosLaborados >= 10) diasAguinaldo = 21; 
  
  const aguinaldoCompleto = sbd * diasAguinaldo;
  const aguinaldoProporcionalDiario = aguinaldoCompleto / 360; 
  const diasTrabajadosUltimoPeriodo = mesesLaborados * 30;
  const aguinaldoProporcional = aguinaldoProporcionalDiario * diasTrabajadosUltimoPeriodo;

  // 4. INDEMNIZACIÓN O COMPENSACIÓN
  let indemnizacion = 0;
  if (causaFinalizacion === 'despido') {
    const salarioBaseDespido = Math.min(salarioMensual, TECHO_INDEMNIZACION_DESPIDO);
    const indemAnios = salarioBaseDespido * aniosLaborados;
    const indemMeses = (salarioBaseDespido / 360) * (mesesLaborados * 30);
    indemnizacion = indemAnios + indemMeses;
  } else if (causaFinalizacion === 'renuncia') {
    if (aniosLaborados >= 2) {
      const salarioBaseRenuncia = Math.min(salarioMensual, TECHO_INDEMNIZACION_RENUNCIA);
      const sbdRenuncia = salarioBaseRenuncia / 30;
      const indemAnios = (sbdRenuncia * 15) * aniosLaborados;
      const indemMeses = sbdRenuncia * 1.25 * mesesLaborados; 
      indemnizacion = indemAnios + indemMeses;
    }
  }

  // 5. JORNADAS EXTRAORDINARIAS Y DÍAS ESPECIALES
  const subtotalExtrasDiurnas = salarioHora * horasExtrasDiurnas * 2;
  const tarifaNocturna = salarioHora * 1.25;
  const subtotalExtrasNocturnas = tarifaNocturna * horasExtrasNocturnas * 2; 
  const subtotalAsuetos = (sbd * 2) * diasAsueto;
  const subtotalDescanso = (sbd * 1.5) * diasDescanso;

  // 6. DEDUCCIONES LEGALES TRIBUTARIAS (Información Externa)
  // Consolidamos solo los ingresos que son gravados por la ley.
  const montoSujetoDescuentos = vacacionProporcional + subtotalExtrasDiurnas + subtotalExtrasNocturnas + subtotalAsuetos + subtotalDescanso;
  
  // ISSS: 3% (con techo máximo salarial de $1,000, descuento máximo de $30)
  const deduccionISSS = montoSujetoDescuentos > 1000 ? 30 : montoSujetoDescuentos * 0.03;
  
  // AFP: 7.25% (El tope es sumamente alto, por lo que aplicamos el % directo)
  const deduccionAFP = montoSujetoDescuentos * 0.0725;

  // Renta (ISR): Cálculo con la tabla mensual de retención de El Salvador
  const baseImponible = montoSujetoDescuentos - deduccionISSS - deduccionAFP;
  let deduccionRenta = 0;

  if (baseImponible > 550.00 && baseImponible <= 895.24) {
    deduccionRenta = ((baseImponible - 550.00) * 0.10) + 17.67;
  } else if (baseImponible > 895.24 && baseImponible <= 2038.10) {
    deduccionRenta = ((baseImponible - 895.24) * 0.20) + 60.00;
  } else if (baseImponible > 2038.10) {
    deduccionRenta = ((baseImponible - 2038.10) * 0.30) + 288.57;
  }

  // 7. CÁLCULO FINAL
  const subtotalBruto = aguinaldoProporcional + indemnizacion + montoSujetoDescuentos;
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