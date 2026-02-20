import { createFileRoute } from '@tanstack/react-router'
import { BookingCalendar } from '../../components/client/BookingCalendar' 

export const Route = createFileRoute('/_client/book/$serviceId')({
  component: BookServicePage,
})

function BookServicePage() {
  const { serviceId } = Route.useParams()

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <BookingCalendar serviceId={serviceId} />
    </div>
  )
}