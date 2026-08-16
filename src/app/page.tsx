// app/page.tsx

import Header from '../components/Header';
import CalculatorForm from '../components/CalculatorForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Nuestro componente de encabezado */}
      <Header />

      {/* Contenedor principal que se expande para empujar el footer hacia abajo */}
      <main className="grow container mx-auto px-4 py-8 max-w-4xl">
        <CalculatorForm />
      </main>

      {/* Pie de página con el aviso legal exigido */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-xs mt-auto">
        <div className="max-w-4xl mx-auto px-4">
          <p className="mb-1">
            Proyecto académico desarrollado por estudiante.
          </p>
          <p>
            Codigo de los estudiantes: DSNP021823, DSNP158023, DSNP117823
          </p>
          <p>
            La aplicación debe considerarse una herramienta educativa y no un sustituto de una liquidación oficial avalada por el Ministerio de Trabajo.
          </p>
        </div>
      </footer>
    </div>
  );
}