import { useEffect } from "react";
import Spinner from "../../shared/ui/Spinner";

type Props = {
  open: boolean;
  title?: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

const ConfirmModal = ({
  open,
  title = "확인",
  message,
  confirmText = "확인",
  cancelText = "취소",
  loading = false,
  onConfirm,
  onCancel,
}: Props) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-5 w-96 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold">{title}</span>
        </div>

        <div className="text-sm text-gray-700">{message}</div>

        <div className="flex justify-end gap-2 mt-5 items-center">
          {loading && <Spinner />}

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-3 py-2 border rounded-sm hover:bg-gray-100 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-3 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 disabled:opacity-50"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
