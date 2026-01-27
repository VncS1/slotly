import { createFileRoute, Link } from '@tanstack/react-router'
import { Briefcase, Calendar } from 'lucide-react' // Ícones para ilustrar

export const Route = createFileRoute('/register/')({
  component: RegisterSelection,
})

function RegisterSelection() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Domine seu tempo, agende online.
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          A solução completa para agendamentos, desenhada tanto para profissionais quanto para clientes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        
        {/* Card Profissional */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-start gap-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <Briefcase size={32} />
          </div>
          <h2 className="text-xl font-bold">Para Profissionais</h2>
          <p className="text-gray-500">
            Quero oferecer meus serviços e gerenciar minha agenda de forma inteligente.
          </p>
          <Link 
            to="/register/provider" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors mt-auto"
          >
            Começar como Profissional
          </Link>
        </div>

        {/* Card Cliente */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-start gap-4">
          <div className="bg-teal-100 p-3 rounded-lg text-teal-600">
            <Calendar size={32} />
          </div>
          <h2 className="text-xl font-bold">Para Clientes</h2>
          <p className="text-gray-500">
            Quero agendar horários, ver histórico e encontrar profissionais.
          </p>
          <Link 
            to="/register/client" 
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors mt-auto"
          >
            Criar conta de Cliente
          </Link>
        </div>

      </div>
      
      <div className="mt-8 text-gray-400">
        Já tem uma conta? <Link to="/login" className="text-blue-600 font-semibold">Faça Login</Link>
      </div>
    </div>
  )
}