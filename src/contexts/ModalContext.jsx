import { createContext, useState } from "react";
import AlertModal from "../components/common/AlertModal";

export const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);

  const showAlert = (message, type = "sucess") => {
    return new Promise((resolve) => {
      setModal({
        message,
        type,
        showCancel: false,
        onConfirm: () => {
          setModal(null);
          resolve(true);
        },
      });
    });
  };

  const showConfirm = (message) => {
    return new Promise((resolve) => {
      setModal({
        message,
        type: "confirm",
        showCancel: true,
        onConfirm: () => {
          setModal(null);
          resolve(true);
        },
        onCancel: () => {
          setModal(null);
          resolve(false);
        },
      });
    });
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {modal && <AlertModal {...modal} />}
    </ModalContext.Provider>
  );
}