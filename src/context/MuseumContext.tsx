import React, { createContext, useContext, useState, ReactNode } from "react";

interface MuseumState {
  currentRoom: number;
  setCurrentRoom: (room: number) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  modalContent: any;
  setModalContent: (content: any) => void;
  focusTarget: [number, number, number] | null;
  setFocusTarget: (target: [number, number, number] | null) => void;
}

const MuseumContext = createContext<MuseumState | undefined>(undefined);

export const MuseumProvider = ({ children }: { children: ReactNode }) => {
  const [currentRoom, setCurrentRoom] = useState(0);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<any>(null);
  const [focusTarget, setFocusTarget] = useState<[number, number, number] | null>(null);

  return (
    <MuseumContext.Provider
      value={{
        currentRoom,
        setCurrentRoom,
        activeModal,
        setActiveModal,
        modalContent,
        setModalContent,
        focusTarget,
        setFocusTarget,
      }}
    >
      {children}
    </MuseumContext.Provider>
  );
};

export const useMuseum = () => {
  const context = useContext(MuseumContext);
  if (!context) {
    throw new Error("useMuseum must be used within a MuseumProvider");
  }
  return context;
};
