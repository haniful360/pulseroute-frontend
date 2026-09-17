'use client';

import React, { createContext, useContext, useState } from 'react';

interface ModalContextType {
  isOpen: boolean;
  view: string | null;
  title?: string;
  data?: any;
  openModal: (options: { view: string; title?: string; data?: any }) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<string | null>(null);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [data, setData] = useState<any>(undefined);

  const openModal = (options: { view: string; title?: string; data?: any }) => {
    setView(options.view);
    setTitle(options.title);
    setData(options.data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setView(null);
    setTitle(undefined);
    setData(undefined);
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        view,
        title,
        data,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    // Provide a safe fallback if used outside provider
    return {
      isOpen: false,
      view: null,
      title: undefined,
      data: undefined,
      openModal: () => {},
      closeModal: () => {},
    };
  }
  return context;
}
