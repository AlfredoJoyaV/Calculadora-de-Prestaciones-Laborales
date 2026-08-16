// lib/constants.ts

// Salario mínimo actual en El Salvador para el sector comercio y servicios.
// Si la ley cambia, solo actualizamos este archivo.
export const SALARIO_MINIMO = 408.80; 

// Base legal: "para el cálculo de dicha prestación, ningún salario puede considerarse mayor a cuatro veces el salario mínimo legal vigente."
export const TECHO_INDEMNIZACION_DESPIDO = SALARIO_MINIMO * 4; 

// Base legal: Ley Reguladora de la Prestación Económica por Renuncia Voluntaria.
// "ningún salario podrá ser superior a dos veces el salario mínimo legal"
export const TECHO_INDEMNIZACION_RENUNCIA = SALARIO_MINIMO * 2;