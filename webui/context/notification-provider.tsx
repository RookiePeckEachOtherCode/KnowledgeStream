"use client";

import clsx from "clsx";
import "@/styles/notification.css";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faInfo, faXmark } from "@fortawesome/free-solid-svg-icons";

type MessageType = "success" | "error" | "info";
interface MessageProps {
  id?: string;
  title: string;
  content: string;
  type: MessageType;
  del?: boolean;
}

interface NotificationContextProps {
  showNotification: (msg: MessageProps) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<Array<MessageProps>>([]);
  const add = (msg: MessageProps) => {
    setMessage((prev) => [msg, ...prev]);
  };
  const popFirst = () => {
    setMessage((prev) => prev.slice(1));
  };

  const showNotification = (msg: MessageProps) => {
    const id = Date.now().toString();
    add({
      ...msg,
      id: id,
      del: false,
    });

    setTimeout(() => {
      setMessage((prev) =>
        prev.map((m) => (m.id === id ? { ...m, del: true } : m))
      );
    }, 2900);
    setTimeout(() => {
      popFirst();
    }, 3000);
  };

  const messageInfo = useCallback(() => {
    const typeStyles = (type: MessageType) => {
      switch (type) {
        case "success":
          return "bg-secondary-container text-on-secondary-container";
        case "error":
          return "bg-error-container text-on-error-container";
        case "info":
          return "bg-surface-variant bg-on-surface-variant";
      }
    };

    const icon = (type: MessageType) => {
      switch (type) {
        case "success":
          return <FontAwesomeIcon icon={faCheck} />;
        case "error":
          return <FontAwesomeIcon icon={faXmark} />;
        case "info":
          return <FontAwesomeIcon icon={faInfo} />;
      }
    };

    if (message.length === 0) return null;

    return (
      <div className="fixed top-0 right-0 z-[100] flex flex-col w-1/5 p-2 gap-4 overflow-hidden m-4 transition-all duration-300 ease-in-out">
        {message.map((msg, index) => (
          <div
            key={index}
            className={clsx(
              "p-4 rounded-2xl flex flex-col gap-4",
              "animate-in slide-in-from-right fade-in",
              "animate-out slide-out-to-right fade-out ",
              typeStyles(msg.type),
              msg.del ? "message-exit" : "message-enter"
            )}
          >
            <div className="text-base font-semibold flex items-center justify-between px-2">
              <div className="text-base font-semibold">{msg.title}</div>
              <div>{icon(msg.type)}</div>
            </div>
            <div className="text-sm">{msg.content}</div>
          </div>
        ))}
      </div>
    );
  }, [message]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {messageInfo()}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification必须在NotificationProvider内使用");
  }
  return context;
};
