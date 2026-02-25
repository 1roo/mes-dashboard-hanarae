import type { NewWorkOrderForm, Status } from "./types";

export const PAGE_SIZE = 5;

export const initialNewWorkOrderForm: NewWorkOrderForm = {
  id: "",
  productName: "",
  plannedQty: "",
  startDate: "",
};

export const statusOptions: Array<{ label: string; value: "" | Status }> = [
  { label: "상태 전체", value: "" },
  { label: "완료", value: "COMPLETED" },
  { label: "진행중", value: "IN_PROGRESS" },
  { label: "대기", value: "PENDING" },
];

export const statusLabel: Record<Status, string> = {
  COMPLETED: "완료",
  IN_PROGRESS: "진행중",
  PENDING: "대기",
};
