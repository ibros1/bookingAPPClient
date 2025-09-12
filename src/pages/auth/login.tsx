import LoginForm from "@/components/auth/loginForm";
import type { RootState } from "@/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const userState = useSelector((state: RootState) => state.loginSlice);
  const user = userState.data?.user;
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default Login;
