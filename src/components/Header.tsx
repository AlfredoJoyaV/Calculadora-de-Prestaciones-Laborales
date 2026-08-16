// components/Header.tsx

export default function Header() {
  return (
    <header className="bg-blue-900 text-white py-6 shadow-md">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Calculadora de Prestaciones Laborales
        </h1>
        <p className="text-blue-200 text-sm md:text-base font-medium">
          Derecho Empresarial e Informático
        </p>
        <p className="text-blue-100 text-xs mt-2 opacity-80 uppercase tracking-wide">
          Ingenieria en Desarrollo de Software 
        </p>
      </div>
    </header>
  );
}