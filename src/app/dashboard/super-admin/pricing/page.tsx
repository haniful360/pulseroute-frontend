import AdminDataView from '@/components/dashboard/super-admin/AdminDataView';

export default function PricingCommissionPage() {
  return (
    <AdminDataView
      title="Pricing & Commission Strategy"
      description="Set base ambulance dispatch fares, per-kilometer rates, night surcharges, and operator commissions."
      stats={[
        { label: 'Standard base fare', value: 'BDT 1,200', delta: 'Current schedule' },
        { label: 'Per kilometer', value: 'BDT 45', delta: 'Dhaka metro' },
        { label: 'ICU surcharge', value: 'BDT 1,500', delta: 'Critical care premium' },
        { label: 'Operator commission', value: '12%', delta: 'Across all trips' },
      ]}
      form="pricing"
      actionLabel="Preview changes"
    />
  );
}
