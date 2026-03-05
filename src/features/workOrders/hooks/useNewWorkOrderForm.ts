import { useState } from "react";
import { initialNewWorkOrderForm } from "../constants";
import type { NewWorkOrderForm } from "../types";

export const useNewWorkOrderForm = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState<NewWorkOrderForm>(
    initialNewWorkOrderForm,
  );

  const onClickAdd = () => {
    setIsAdding(true);
    setNewForm(initialNewWorkOrderForm);
  };

  const onCancelNew = () => setIsAdding(false);

  const onChangeNewForm =
    (key: keyof NewWorkOrderForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setNewForm((p) => ({ ...p, [key]: e.target.value }));

  const reset = () => setNewForm(initialNewWorkOrderForm);

  return {
    isAdding,
    setIsAdding,
    newForm,
    setNewForm,
    onClickAdd,
    onCancelNew,
    onChangeNewForm,
    reset,
  };
};
