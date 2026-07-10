import { ADMIN_DEMO_TICKETS } from '@/lib/mockData';
import TicketDetail from './TicketDetail';

export function generateStaticParams() {
  return ADMIN_DEMO_TICKETS.map((t) => ({ ticketId: t.id }));
}

export default function TicketDetailPage({ params }: { params: { ticketId: string } }) {
  return <TicketDetail ticketId={params.ticketId} />;
}
