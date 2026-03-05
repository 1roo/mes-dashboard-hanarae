import type { NewWorkOrderForm, WorkOrder } from "../types";

export const calcDueDate = (startDate: string, addDays = 3) => {
  const d = new Date(startDate);
  d.setDate(d.getDate() + addDays);
  return d.toISOString().slice(0, 10);
};

export const validateNewForm = (form: NewWorkOrderForm, rows: WorkOrder[]) => {
  if (!form.id.trim()) return "작업지시번호를 입력하세요.";
  if (!form.productName.trim()) return "제품명을 입력해주세요.";

  const planned = Number(form.plannedQty);
  if (!form.plannedQty.trim() || Number.isNaN(planned) || planned <= 0) {
    return "1 이상의 숫자를 입력해주세요.";
  }

  if (!form.startDate) return "지시일을 선택해주세요";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(form.startDate);
  start.setHours(0, 0, 0, 0);

  if (start <= today) return "지시일은 오늘 이후로 선택해주세요.";

  const newId = form.id.trim();
  if (rows.some((r) => r.id === newId))
    return "이미 존재하는 작업지시번호입니다.";

  return null;
};
