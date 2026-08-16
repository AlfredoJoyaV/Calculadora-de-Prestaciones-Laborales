// types/index.ts

// Esta interfaz define exactamente qué datos recibiremos del formulario
export interface DatosLaborales {
  salarioMensual: number;
  aniosLaborados: number;
  mesesLaborados: number;
  causaFinalizacion: 'despido' | 'renuncia';
  horasExtrasDiurnas: number;
  horasExtrasNocturnas: number;
  diasAsueto: number;
  diasDescanso: number;
}

// Esta interfaz define exactamente qué datos devolverá nuestro cálculo
export interface LiquidacionResultados {
  vacacionProporcional: number;
  aguinaldoProporcional: number;
  indemnizacion: number;
  subtotalExtrasDiurnas: number;
  subtotalExtrasNocturnas: number;
  subtotalAsuetos: number;
  subtotalDescanso: number;
  // Deducciones requeridas por la rúbrica
  deduccionISSS: number;
  deduccionAFP: number;
  deduccionRenta: number;
  totalNeto: number;
}