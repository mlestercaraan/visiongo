import { ADMIN_DEMO_INVOICES } from '@/lib/mockData';
import InvoiceDetail from './InvoiceDetail';

export function generateStaticParams() {
  return ADMIN_DEMO_INVOICES.map((i) => ({ invoiceId: i.id }));
}

export default function InvoiceDetailPage({ params }: { params: { invoiceId: string } }) {
  return <InvoiceDetail invoiceId={params.invoiceId} />;
}
