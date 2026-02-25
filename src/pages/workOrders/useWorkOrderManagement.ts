import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { instance } from "../../shared/axios/axios";

import { PAGE_SIZE, initialNewWorkOrderForm } from "./constants";
import type { NewWorkOrderForm, Status, WorkOrder } from "./types";

const STORAGE_KEY = "workOrders";

const calcDueDate = (startDate: string, addDays = 3) => {
  const d = new Date(startDate);
  d.setDate(d.getDate() + addDays);
  return d.toISOString().slice(0, 10);
};

const validateNewForm = (form: NewWorkOrderForm, rows: WorkOrder[]) => {
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

const safeLoadRows = (): WorkOrder[] | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    return parsed as WorkOrder[];
  } catch {
    return null;
  }
};

export const useWorkOrderManagement = () => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<"" | Status>("");

  const [rows, setRows] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState<NewWorkOrderForm>(
    initialNewWorkOrderForm,
  );

  const [page, setPage] = useState(1);
  const [hydrated, setHydrated] = useState(false);

  const fetchWorkOrders = async () => {
    setLoading(true);

    const saved = safeLoadRows();
    if (saved && saved.length > 0) {
      setRows(saved);
      setPage(1);
      setHydrated(true);
      setLoading(false);
      return;
    }

    try {
      const res = await instance.get<WorkOrder[]>("/workOrders");
      setRows(res.data);
      setPage(1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
    } catch (err) {
      toast.error("작업지시 조회에 실패했습니다.");
      console.error(err);
    } finally {
      setHydrated(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    } catch {
      toast.error("저장에 실패했습니다.");
    }
  }, [rows, hydrated]);

  useEffect(() => {
    setPage(1);
  }, [keyword, status]);

  const filteredRows = useMemo(() => {
    const q = keyword.trim();
    return rows.filter((r) => {
      const okKeyword = !q || r.productName.includes(q);
      const okStatus = !status || r.status === status;
      return okKeyword && okStatus;
    });
  }, [rows, keyword, status]);

  const totalPages = useMemo(() => {
    const n = Math.ceil(filteredRows.length / PAGE_SIZE);
    return n === 0 ? 1 : n;
  }, [filteredRows.length]);

  const pagedRows = useMemo(() => {
    const total = filteredRows.length;
    const end = total - (page - 1) * PAGE_SIZE;
    const start = Math.max(0, end - PAGE_SIZE);
    return filteredRows.slice(start, end);
  }, [filteredRows, page]);

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const onClickAdd = () => {
    setIsAdding(true);
    setNewForm(initialNewWorkOrderForm);
  };

  const onChangeNewForm =
    (key: keyof NewWorkOrderForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const onCancelNew = () => {
    setIsAdding(false);
    setNewForm(initialNewWorkOrderForm);
  };

  const onSaveNew = async () => {
    const msg = validateNewForm(newForm, rows);
    if (msg) {
      toast.error(msg);
      return;
    }

    const payload: WorkOrder = {
      id: newForm.id.trim(),
      productName: newForm.productName.trim(),
      plannedQty: Number(newForm.plannedQty),
      completedQty: 0,
      status: "PENDING",
      assignedLine: "",
      startDate: newForm.startDate,
      dueDate: calcDueDate(newForm.startDate, 3),
    };

    try {
      const res = await instance.post<WorkOrder>("/workOrders", payload, {
        headers: { "Content-Type": "application/json" },
      });

      setRows((prev) => [...prev, res.data]);
      setPage(1);

      setIsAdding(false);
      setNewForm(initialNewWorkOrderForm);
    } catch (err) {
      toast.error("저장에 실패했습니다.");
      console.error(err);
    }
  };

  return {
    // filters
    keyword,
    setKeyword,
    status,
    setStatus,

    // data
    rows,
    loading,

    // paging
    page,
    setPage,
    totalPages,
    filteredRows,
    pagedRows,

    // add form
    isAdding,
    newForm,
    onClickAdd,
    onChangeNewForm,
    onCancelNew,
    onSaveNew,
  };
};
