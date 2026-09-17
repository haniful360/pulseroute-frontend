'use client';

import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import {
  Heart,
  CheckCircle2,
  X,
  Plus,
  ShieldCheck,
  Users,
  Phone,
  Link as LinkIcon,
  Pencil,
  Trash2,
  Megaphone,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import DynamicModal from '@/components/dashboard/DynamicModal/DynamicModal';
import InputField from '@/components/dashboard/Fields/InputField/InputField';

import abdurRahmanImg from '@/assets/dashboard/patient/abdur-rahman.png';
import fatemaBegumImg from '@/assets/dashboard/patient/fatema-begum.png';

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  autoSms: boolean;
  avatar?: StaticImageData | string;
}

const initialContacts: Contact[] = [
  {
    id: '1',
    name: 'Abdur Rahman',
    relationship: 'Husband',
    phone: '+880 1712 345678',
    autoSms: true,
    avatar: abdurRahmanImg,
  },
  {
    id: '2',
    name: 'Fatema Begum',
    relationship: 'Sister',
    phone: '+880 1819 123456',
    autoSms: false,
    avatar: fatemaBegumImg,
  },
];

const bloodGroups = ['A+', 'A-', 'B+ (Positive)', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function MedicalProfileView() {
  // Vital Information state
  const [bloodGroup, setBloodGroup] = useState('B+ (Positive)');
  const [conditions, setConditions] = useState<string[]>(['Hypertension', 'Type 2 Diabetes']);
  const [newCondition, setNewCondition] = useState('');
  const [allergies, setAllergies] = useState<string[]>(['Penicillin', 'Latex']);
  const [newAllergy, setNewAllergy] = useState('');

  // Emergency Contacts state
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);

  // Toast notification state
  const [showToast, setShowToast] = useState(true);
  const [toastMessage, setToastMessage] = useState(
    'Your medical data has been saved successfully.',
  );

  // Modal states for Contact Add/Edit
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactRelation, setContactRelation] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAutoSms, setContactAutoSms] = useState(true);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  // Conditions tag handling
  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleAddCondition = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newCondition.trim()) {
      e.preventDefault();
      if (!conditions.includes(newCondition.trim())) {
        setConditions([...conditions, newCondition.trim()]);
      }
      setNewCondition('');
    }
  };

  // Allergies tag handling
  const handleRemoveAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const handleAddAllergy = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newAllergy.trim()) {
      e.preventDefault();
      if (!allergies.includes(newAllergy.trim())) {
        setAllergies([...allergies, newAllergy.trim()]);
      }
      setNewAllergy('');
    }
  };

  // Toggle Auto-SMS for a contact
  const handleToggleSms = (id: string, checked: boolean) => {
    setContacts(contacts.map((c) => (c.id === id ? { ...c, autoSms: checked } : c)));
  };

  // Open modal to add new contact
  const handleOpenAddContact = () => {
    setEditingContact(null);
    setContactName('');
    setContactRelation('Husband');
    setContactPhone('');
    setContactAutoSms(true);
    setIsContactModalOpen(true);
  };

  // Open modal to edit existing contact
  const handleOpenEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setContactName(contact.name);
    setContactRelation(contact.relationship);
    setContactPhone(contact.phone.replace('+880 ', ''));
    setContactAutoSms(contact.autoSms);
    setIsContactModalOpen(true);
  };

  // Save contact (add or edit)
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) return;

    const formattedPhone = contactPhone.startsWith('+880')
      ? contactPhone
      : `+880 ${contactPhone.trim()}`;

    if (editingContact) {
      setContacts(
        contacts.map((c) =>
          c.id === editingContact.id
            ? {
                ...c,
                name: contactName.trim(),
                relationship: contactRelation.trim() || 'Family',
                phone: formattedPhone,
                autoSms: contactAutoSms,
              }
            : c,
        ),
      );
    } else {
      const newContactItem: Contact = {
        id: Date.now().toString(),
        name: contactName.trim(),
        relationship: contactRelation.trim() || 'Family',
        phone: formattedPhone,
        autoSms: contactAutoSms,
      };
      setContacts([...contacts, newContactItem]);
    }

    setIsContactModalOpen(false);
  };

  // Open delete confirmation
  const handleOpenDeleteContact = (contact: Contact) => {
    setContactToDelete(contact);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (contactToDelete) {
      setContacts(contacts.filter((c) => c.id !== contactToDelete.id));
      setIsDeleteModalOpen(false);
      setContactToDelete(null);
    }
  };

  // Global Save Changes
  const handleSaveChanges = () => {
    setToastMessage('Your medical data has been saved successfully.');
    setShowToast(true);
    setTimeout(() => {
      // toast auto-fades after 5 seconds
    }, 5000);
  };

  // Cancel action
  const handleCancel = () => {
    setBloodGroup('B+ (Positive)');
    setConditions(['Hypertension', 'Type 2 Diabetes']);
    setAllergies(['Penicillin', 'Latex']);
    setContacts(initialContacts);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row with Actions & Toast */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B132B] sm:text-3xl">
            Medical Profile
          </h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Manage your vital information and emergency SOS settings.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="cursor-pointer rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveChanges}
            className="cursor-pointer rounded-xl bg-[#E63946] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-500/20 transition hover:bg-red-600 active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Floating Notification Toast (Matches Figma 2:8120) */}
      {showToast && (
        <div className="relative flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/90 p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Profile Updated</h4>
              <p className="text-xs text-slate-600">{toastMessage}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="text-slate-400 transition hover:text-slate-600"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* ================= LEFT COLUMN ================= */}
        <div className="space-y-6 lg:col-span-6">
          {/* Card 1: Vital Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:p-7">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#E63946]">
                <Heart className="h-5 w-5 fill-[#E63946]/10" />
              </div>
              <h2 className="text-lg font-bold text-[#0B132B]">Vital Information</h2>
            </div>

            <div className="mt-6 space-y-5">
              {/* Blood Group Field */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  BLOOD GROUP
                </label>
                <div className="relative mt-2">
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-slate-50/50 px-4 pr-10 text-sm font-medium text-slate-900 transition focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 focus:outline-none"
                  >
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Existing Conditions Field */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  EXISTING CONDITIONS
                </label>
                <div className="mt-2 flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-slate-50/50 p-2 focus-within:border-red-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-red-500">
                  {conditions.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveCondition(idx)}
                        className="text-slate-400 transition hover:text-[#E63946]"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    onKeyDown={handleAddCondition}
                    placeholder="Add condition..."
                    className="min-w-[120px] flex-1 bg-transparent px-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400 italic">
                  Paramedics will prioritize this info during emergencies.
                </p>
              </div>

              {/* Known Allergies Field */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  KNOWN ALLERGIES
                </label>
                <div className="mt-2 flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-slate-50/50 p-2 focus-within:border-red-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-red-500">
                  {allergies.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergy(idx)}
                        className="text-slate-400 transition hover:text-[#E63946]"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    onKeyDown={handleAddAllergy}
                    placeholder="Add allergy..."
                    className="min-w-[120px] flex-1 bg-transparent px-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Insurance Coverage (Matches Figma Navy Card) */}
          <div className="relative overflow-hidden rounded-2xl bg-[#0B132B] p-6 text-white shadow-sm sm:p-7">
            {/* Red radial glow overlay */}
            <div className="pointer-events-none absolute -top-12 -left-12 h-44 w-44 rounded-full bg-red-600/15 blur-2xl" />

            {/* Faint Shield Watermark */}
            <div className="pointer-events-none absolute right-4 bottom-2 text-white/5">
              <ShieldCheck className="h-28 w-28" />
            </div>

            <div className="relative z-10 space-y-4">
              <div>
                <span className="text-[11px] font-bold tracking-wider text-[#E63946] uppercase">
                  INSURANCE COVERAGE
                </span>
                <h3 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Guardian Health Plus
                </h3>
              </div>

              <div>
                <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  POLICY NUMBER
                </span>
                <p className="mt-0.5 font-mono text-base font-semibold tracking-wider text-white">
                  GH-992-0045-881
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="space-y-6 lg:col-span-6">
          {/* Card 1: Emergency Contacts */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:p-7">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Users className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-[#0B132B]">Emergency Contacts</h2>
              </div>

              <button
                type="button"
                onClick={handleOpenAddContact}
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 bg-slate-50/70 px-3.5 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 active:scale-95"
              >
                <Plus className="h-3.5 w-3.5 text-[#E63946]" />
                Add Contact
              </button>
            </div>

            {/* Contact Items List */}
            <div className="mt-6 space-y-4">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="rounded-2xl border border-gray-100 bg-slate-50/60 p-4 transition-all hover:border-gray-200 hover:shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-slate-200">
                        {contact.avatar ? (
                          <Image
                            src={contact.avatar}
                            alt={contact.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-red-100 text-sm font-bold text-[#E63946]">
                            {contact.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-[#0B132B]">{contact.name}</h4>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <LinkIcon className="h-3.5 w-3.5 text-slate-400" />
                            {contact.relationship}
                          </span>
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            {contact.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Edit & Delete Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditContact(contact)}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-slate-500 transition hover:border-[#E63946] hover:text-[#E63946]"
                        title="Edit Contact"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenDeleteContact(contact)}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-slate-500 transition hover:border-red-500 hover:text-red-600"
                        title="Delete Contact"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="mt-3.5 flex items-center justify-between border-t border-gray-200/60 pt-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-900">Auto-SMS Alert</p>
                      <p className="text-[11px] text-slate-500">Send alert when a trip starts</p>
                    </div>

                    {/* Auto-SMS Switch */}
                    <Switch
                      checked={contact.autoSms}
                      onCheckedChange={(checked) => handleToggleSms(contact.id, checked)}
                      className="data-[state=checked]:bg-[#E63946]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: One-Tap SOS Settings (Matches Figma 2:8109) */}
          <div className="flex items-start gap-4 rounded-2xl border border-dashed border-[#E63946]/40 bg-[#FEF2F2] p-5 sm:p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E63946] text-white shadow-md shadow-red-500/20">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0B132B] sm:text-base">
                One-Tap SOS Settings
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                During an active trip, your &apos;SOS&apos; button will instantly notify these
                contacts with your live location and medical summary.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ADD / EDIT CONTACT MODAL (Figma 2:8110) ================= */}
      <DynamicModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title={editingContact ? 'Edit Emergency Contact' : 'Add New Contact'}
        description="Provide accurate contact information so we can alert them during emergencies."
        variant="light"
      >
        <form onSubmit={handleSaveContact} className="mt-2 space-y-4">
          <InputField
            label="Full Name"
            placeholder="e.g. Abdur Rahman"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700">Relationship *</label>
            <div className="relative mt-1.5">
              <select
                value={contactRelation}
                onChange={(e) => setContactRelation(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 pr-10 text-sm font-medium text-slate-900 transition focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 focus:outline-none"
              >
                <option value="Husband">Husband</option>
                <option value="Wife">Wife</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Sister">Sister</option>
                <option value="Brother">Brother</option>
                <option value="Child">Child</option>
                <option value="Doctor">Doctor</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <InputField
            label="Phone Number"
            placeholder="1712 345678"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            prefix={<span className="px-3 text-xs font-bold text-slate-700">+880</span>}
            required
          />

          <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-slate-50 p-3">
            <div>
              <p className="text-xs font-semibold text-slate-900">Enable Auto-SMS Alert</p>
              <p className="text-[11px] text-slate-500">Send automatic alert on emergency start</p>
            </div>
            <Switch
              checked={contactAutoSms}
              onCheckedChange={setContactAutoSms}
              className="data-[state=checked]:bg-[#E63946]"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsContactModalOpen(false)}
              className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-xl bg-[#E63946] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-red-500/20 transition hover:bg-red-600"
            >
              {editingContact ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </form>
      </DynamicModal>

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      <DynamicModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        variant="light"
      >
        <div className="flex flex-col items-center py-2 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#E63946]">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Remove Contact?</h3>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
            Are you sure you want to remove{' '}
            <span className="font-semibold text-slate-800">{contactToDelete?.name}</span> from your
            emergency contacts? They will no longer receive one-tap SOS notifications.
          </p>

          <div className="mt-6 flex w-full gap-3">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 cursor-pointer rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="flex-1 cursor-pointer rounded-xl bg-[#E63946] py-2.5 text-xs font-semibold text-white shadow-md shadow-red-500/20 transition hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </DynamicModal>
    </div>
  );
}
