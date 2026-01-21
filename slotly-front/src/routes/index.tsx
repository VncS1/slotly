import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-600">Bem-vindo ao Slotly!</h1>
      <p className="mt-2 text-gray-600">Stack de Elite configurada com sucesso.</p>
    </div>
  )
}