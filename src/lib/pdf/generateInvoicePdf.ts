import { jsPDF } from 'jspdf';

export interface InvoicePdfData {
  invoiceNumber: string;
  tripId?: string;
  tripCode?: string;
  issuedAt: string;
  paidAt?: string | null;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number | string;
  baseFare?: number | string;
  distanceFare?: number | string;
  surgeFare?: number | string;
  discountAmount?: number | string;
  taxAmount?: number | string;
  platformCommission?: number | string;
  driverEarning?: number | string;
  paidAmount?: number | string;
  transactionId?: string;
  patient?: {
    name?: string;
    email?: string;
    contactNumber?: string;
  };
  driver?: {
    name?: string;
    contactNumber?: string;
    licenseNumber?: string;
  };
  trip?: {
    tripCode?: string;
    ambulanceType?: string;
    emergencySeverity?: string;
    pickupAddress?: string;
    destinationAddress?: string;
    distanceKm?: number;
    estimatedDurationMins?: number;
  };
}

export function generateInvoicePdf(data: InvoicePdfData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header Banner (Dark Navy #0b132b)
  doc.setFillColor(11, 19, 43);
  doc.rect(0, 0, 210, 36, 'F');

  // Accent Line (Pulse Red #e63946)
  doc.setFillColor(230, 57, 70);
  doc.rect(0, 36, 210, 2.5, 'F');

  // Logo / Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('PulseRoute', 16, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('EMERGENCY MEDICAL DISPATCH & AMBULANCE SERVICE', 16, 26);

  // Invoice Tag in Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('OFFICIAL INVOICE', 194, 18, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(226, 232, 240);
  doc.text(data.invoiceNumber || 'INV-PENDING', 194, 26, { align: 'right' });

  // Status Badge
  const isPaid = (data.paymentStatus || '').toUpperCase() === 'PAID';
  if (isPaid) {
    doc.setFillColor(16, 185, 129); // emerald
  } else {
    doc.setFillColor(230, 57, 70);  // red
  }
  doc.roundedRect(16, 46, 28, 7, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(isPaid ? 'PAID' : 'UNPAID', 30, 50.8, { align: 'center' });

  // Key Metadata (Issue Date, Paid Date, Gateway)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Issued Date:', 52, 51);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(11, 19, 43);
  const issuedDateStr = data.issuedAt
    ? new Date(data.issuedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';
  doc.text(issuedDateStr, 72, 51);

  if (isPaid && data.paidAt) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Paid Date:', 110, 51);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(11, 19, 43);
    const paidDateStr = new Date(data.paidAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    doc.text(paidDateStr, 127, 51);
  }

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Payment Gateway:', 155, 51);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(11, 19, 43);
  doc.text(data.paymentMethod || 'STRIPE', 183, 51);

  // Section 1: Patient and Driver Columns
  let y = 63;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(16, y, 194, y);

  y += 6;
  // Left Column: Patient
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(11, 19, 43);
  doc.text('PATIENT / BILLED TO:', 16, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  y += 5;
  doc.text(`Name: ${data.patient?.name || 'PulseRoute Patient'}`, 16, y);
  y += 4.5;
  doc.text(`Phone: ${data.patient?.contactNumber || 'N/A'}`, 16, y);
  y += 4.5;
  doc.text(`Email: ${data.patient?.email || 'N/A'}`, 16, y);

  // Right Column: Assigned Paramedic Driver
  let rightY = 69;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(11, 19, 43);
  doc.text('PARAMEDIC & DISPATCH DETAILS:', 110, rightY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  rightY += 5;
  doc.text(`Driver: ${data.driver?.name || 'Assigned Paramedic'}`, 110, rightY);
  rightY += 4.5;
  doc.text(`Contact: ${data.driver?.contactNumber || 'N/A'}`, 110, rightY);
  rightY += 4.5;
  doc.text(`License No: ${data.driver?.licenseNumber || 'N/A'}`, 110, rightY);

  y = Math.max(y, rightY) + 7;

  // Section 2: Trip Route Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(16, y, 178, 25, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(16, y, 178, 25, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(11, 19, 43);
  doc.text(
    `Trip Code: ${data.trip?.tripCode || data.tripCode || 'N/A'}  •  Ambulance Tier: ${
      data.trip?.ambulanceType || 'ICU'
    } Support  •  Severity: ${data.trip?.emergencySeverity || 'CRITICAL'}`,
    20,
    y + 6
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const pickup = data.trip?.pickupAddress || 'Emergency Location';
  const dest = data.trip?.destinationAddress || 'Hospital';
  doc.text(`Pickup: ${pickup.slice(0, 75)}`, 20, y + 12);
  doc.text(`Destination: ${dest.slice(0, 75)}`, 20, y + 17);
  doc.text(
    `Distance: ${data.trip?.distanceKm || 0} km  |  Estimated Time: ${
      data.trip?.estimatedDurationMins || 10
    } mins`,
    20,
    y + 22
  );

  y += 33;

  // Section 3: Itemized Financial Table
  doc.setFillColor(11, 19, 43);
  doc.rect(16, y, 178, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('DESCRIPTION', 20, y + 4.8);
  doc.text('AMOUNT (BDT)', 190, y + 4.8, { align: 'right' });

  y += 7;
  const items: [string, string][] = [
    [
      `Base Emergency Dispatch Fare (${data.trip?.ambulanceType || 'ICU'} Tier)`,
      Number(data.baseFare || 2000).toFixed(2),
    ],
    [
      `Distance Mileage Fare (${data.trip?.distanceKm || 0} KM)`,
      Number(data.distanceFare || 0).toFixed(2),
    ],
    ['Zero-Surge Guaranteed Emergency Fee', '0.00'],
    ['Applicable Medical Subsidies & Discounts', '- 0.00'],
    ['Health Ministry VAT / Tax', '0.00'],
  ];

  items.forEach(([label, amt], idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(16, y, 178, 7, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(label, 20, y + 4.8);
    doc.text(amt, 190, y + 4.8, { align: 'right' });
    y += 7;
  });

  // Total Row
  doc.setFillColor(254, 242, 242);
  doc.rect(16, y, 178, 9, 'F');
  doc.setDrawColor(230, 57, 70);
  doc.setLineWidth(0.6);
  doc.line(16, y, 194, y);
  doc.line(16, y + 9, 194, y + 9);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(11, 19, 43);
  doc.text('TOTAL AMOUNT DUE / PAID:', 20, y + 6);

  doc.setTextColor(230, 57, 70);
  doc.text(
    `BDT ${Number(data.totalAmount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    190,
    y + 6,
    { align: 'right' }
  );

  y += 16;

  // Transaction Reference
  if (data.transactionId && data.transactionId !== 'N/A') {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(11, 19, 43);
    doc.text('Stripe Transaction ID / PaymentIntent:', 16, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(data.transactionId, 75, y);
    y += 7;
  }

  // Footer & Disclaimer
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(16, 270, 194, 270);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'This is a verified computer-generated medical transport invoice by PulseRoute Emergency Dispatch.',
    105,
    275,
    { align: 'center' }
  );
  doc.text(
    'For billing inquiries or insurance claim certifications, contact support@pulseroute.com | 24/7 Hotline: 999',
    105,
    279,
    { align: 'center' }
  );

  // Trigger Save
  const filename = `Invoice_${data.invoiceNumber || 'PulseRoute'}.pdf`;
  doc.save(filename);
}
