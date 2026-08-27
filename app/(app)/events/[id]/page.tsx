import { EventDetailScreen } from '@/components/event-detail-screen'

type TabValue = 'expenses' | 'balances' | 'members'

const validTabs: TabValue[] = ['expenses', 'balances', 'members']

export default async function EventDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { id } = await params
  const { tab } = await searchParams
  const initialTab = validTabs.find((value) => value === tab) ?? 'expenses'

  return <EventDetailScreen eventId={id} initialTab={initialTab} />
}
