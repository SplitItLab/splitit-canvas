import { CreateEventDialog } from '@/components/create-event-dialog'
import { EventsScreen } from '@/components/events-screen'
import { mockEvents } from '@/lib/mock-data'

/**
 * Crear evento no es una pantalla aparte: es un modal sobre el listado, como
 * en el Figma. La ruta existe igual para que el flujo sea linkeable y para que
 * el canvas la pueda mostrar como artboard.
 */
export default function NewEventPage() {
  return (
    <>
      <EventsScreen events={mockEvents} />
      <CreateEventDialog />
    </>
  )
}
