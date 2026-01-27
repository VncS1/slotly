import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding/3')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/onboarding/3"!</div>
}
