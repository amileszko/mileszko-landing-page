import { AnimatePresence } from "motion/react";
import { type ElementType, type ReactNode } from "react";
import {
  createContext,
  use,
  useCallback,
  useMemo,
  useState,
} from "react";

interface DialogContextType {
  hide: () => void
  isOpen: boolean
  show: (Component: ElementType, props?: Record<string, unknown>) => void
}

interface DialogEntry {
  Component: ElementType
  id: string
  props: Record<string, unknown>
}

interface DialogRendererContextType {
  dialogs: DialogEntry[]
}

const DialogContext =
  createContext<DialogContextType | undefined>(undefined);
const DialogRendererContext =
  createContext<DialogRendererContextType | undefined>(undefined);

const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [
    dialogs,
    setDialogs,
  ] = useState<DialogEntry[]>([]);

  const show = useCallback(
    (Component: ElementType, props?: Record<string, unknown>) => {
      const newDialog: DialogEntry = {
        Component,
        id: Math.random()
          .toString(36),
        props: props ?? {},
      };

      setDialogs(prev => [
        ...prev,
        newDialog,
      ]);
    },
    [setDialogs],
  );

  const hide = useCallback(
    () => {
      setDialogs((prev) => {
        return prev.slice(
          0,
          -1,
        );
      });
    },
    [setDialogs],
  );

  const dialogContextValue = useMemo(
    () => ({
      hide,
      isOpen: dialogs.length > 0,
      show,
    }),
    [
      dialogs.length,
      hide,
      show,
    ],
  );
  const dialogRendererContextValue = useMemo(
    () => ({ dialogs }),
    [dialogs],
  );

  return (
    <DialogContext value={dialogContextValue}>
      <DialogRendererContext value={dialogRendererContextValue}>
        {children}
      </DialogRendererContext>
    </DialogContext>
  );
};

const useDialog = () => {
  const context = use(DialogContext);

  if (!context) {
    throw new Error("useDialog must be used within DialogProvider");
  }

  return context;
};

const useDialogRenderer = () => {
  const context = use(DialogRendererContext);

  if (!context) {
    throw new Error("useDialogRenderer must be used within DialogProvider");
  }

  return context;
};

const DialogRenderer = () => {
  const { dialogs } = useDialogRenderer();
  const currentDialog = dialogs.length > 0 ?
    dialogs[dialogs.length - 1] :
    undefined;

  return (
    <AnimatePresence mode="wait">
      {
        currentDialog && (
          <currentDialog.Component
            key={currentDialog.id}
            {...currentDialog.props}
          />
        )
      }
    </AnimatePresence>
  );
};

export { DialogProvider, DialogRenderer, useDialog };
