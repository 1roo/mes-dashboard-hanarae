import LoginForm from "./LoginForm";
import { useLogin } from "./useLogin";

const LoginPage = () => {
  const { id, setId, pw, setPw, keepLogin, setKeepLogin, onSubmit } =
    useLogin();

  return (
    <LoginForm
      id={id}
      pw={pw}
      keepLogin={keepLogin}
      setId={setId}
      setPw={setPw}
      setKeepLogin={setKeepLogin}
      onSubmit={onSubmit}
    />
  );
};

export default LoginPage;
