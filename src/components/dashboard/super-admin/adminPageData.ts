export const tripRows = [
  {
    id: 'TRP-8821',
    Patient: 'Rashida Khatun',
    Driver: 'Rahim Uddin',
    Route: 'Dhanmondi → Gulshan',
    Type: 'ICU',
    Status: 'Completed',
  },
  {
    id: 'TRP-8816',
    Patient: 'Sajid Ahmed',
    Driver: 'Kamal Hossain',
    Route: 'Uttara → Banani',
    Type: 'AC',
    Status: 'In Transit',
  },
  {
    id: 'TRP-8794',
    Patient: 'Mina Begum',
    Driver: 'Arif Hasan',
    Route: 'Mirpur → Square Hospital',
    Type: 'Basic',
    Status: 'Critical',
  },
  {
    id: 'TRP-8788',
    Patient: 'Nusrat Jahan',
    Driver: 'Nayeem Islam',
    Route: 'Gulshan → Evercare',
    Type: 'CCU',
    Status: 'Completed',
  },
];

export const fleetRows = [
  { id: 'DH-102', Vehicle: 'Pulse ICU 102', Operator: 'PulseRoute', Type: 'ICU', Status: 'Online' },
  {
    id: 'DH-204',
    Vehicle: 'Care AC 204',
    Operator: 'Care Ambulance',
    Type: 'AC',
    Status: 'Online',
  },
  {
    id: 'DH-311',
    Vehicle: 'Metro BLS 311',
    Operator: 'Metro Health',
    Type: 'Basic',
    Status: 'Maintenance',
  },
  { id: 'DH-418', Vehicle: 'Pulse CCU 418', Operator: 'PulseRoute', Type: 'CCU', Status: 'Online' },
];

export const userRows = [
  { id: 'USR-201', Name: 'Rahim Uddin', Role: 'Paramedic', Region: 'Dhanmondi', Status: 'Active' },
  { id: 'USR-188', Name: 'Kamal Hossain', Role: 'Driver', Region: 'Gulshan', Status: 'Active' },
  {
    id: 'USR-164',
    Name: 'Square Hospital Desk',
    Role: 'Triage Officer',
    Region: 'Panthapath',
    Status: 'Active',
  },
  { id: 'USR-142', Name: 'Arif Hasan', Role: 'Driver', Region: 'Mirpur', Status: 'Suspended' },
];

export const revenueRows = [
  {
    id: 'INV-8821',
    Date: 'Sep 24, 2026',
    Trip: 'TRP-8821',
    Gross: 'BDT 3,500',
    Commission: 'BDT 420',
    Status: 'Settled',
  },
  {
    id: 'INV-8816',
    Date: 'Sep 24, 2026',
    Trip: 'TRP-8816',
    Gross: 'BDT 2,200',
    Commission: 'BDT 264',
    Status: 'Pending',
  },
  {
    id: 'INV-8794',
    Date: 'Sep 23, 2026',
    Trip: 'TRP-8794',
    Gross: 'BDT 1,450',
    Commission: 'BDT 174',
    Status: 'Settled',
  },
];
