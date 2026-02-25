type ModalProps = {
  onClose: () => void;
};

const Modal = ({ onClose }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-1/2 rounded-md p-4 shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="font-bold">생산실적 등록</div>
          <button type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <span>작업지시 *</span>
            <input type="text" className="border p-1" />
          </div>

          <div className="flex flex-col">
            <span>생산수량 *</span>
            <input type="text" className="border p-1" />
          </div>

          <div className="flex flex-col">
            <span>불량수량 *</span>
            <input type="text" className="border p-1" />
          </div>

          <div className="flex flex-col">
            <span>시작시간 *</span>
            <input type="text" className="border p-1" />
          </div>

          <div className="flex flex-col">
            <span>종료시간 *</span>
            <input type="text" className="border p-1" />
          </div>

          <div className="flex flex-col">
            <span>비고</span>
            <input type="text" className="border p-1" />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="border border-violet-400 px-3 py-1 rounded-md mr-3"
          >
            취소
          </button>
          <button
            type="button"
            className="border px-3 py-1 rounded-md bg-violet-400 hover:bg-violet-500 text-white"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
