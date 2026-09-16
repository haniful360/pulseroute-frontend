'use client';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import { useModal } from '@/context/ModalContext';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

const DeleteConfirmAlert = () => {
  const { data, closeModal } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const displayName = data?.deleteItem || 'this item';

  const handleDelete = async () => {
    if (!data?.onConfirm) return;

    setIsDeleting(true);
    try {
      await data?.onConfirm();
      closeModal();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Action failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-2 text-center">
      {/* Animated Warning Icon Section */}
      <div className="relative mb-4">
        <div className="absolute inset-0 animate-ping rounded-full bg-red-100 opacity-20" />
        <div className="text-error relative flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <div className="bg-error/5 flex h-10 w-10 items-center justify-center rounded-full">
            <Trash2 size={20} />
          </div>
        </div>
      </div>

      {/* Text Content */}
      <h3 className="mb-2 text-xl font-semibold tracking-tight text-white italic">
        Confirm Deletion
      </h3>
      <div className="mb-6">
        <p className="text-sm leading-relaxed text-white">
          Are you sure you want to permanently delete
          <span className="text-error mx-1 font-semibold">{displayName}</span>?
        </p>
      </div>

      <div className="flex w-full gap-3">
        <DynamicActionButton
          variant="outline"
          label="Cancel"
          onClick={closeModal}
          className="flex-1 text-white"
        />

        <DynamicActionButton
          variant="danger"
          label={isDeleting ? 'Deleting...' : 'Delete'}
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default DeleteConfirmAlert;
