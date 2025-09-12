// OAuthSuccess.tsx
import { handleGoogleCallback } from "@/redux/slices/users/auth/login";
import type { AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refresh_token");
    const user = searchParams.get("user");

    if (token && refreshToken && user) {
      console.log(token, user, refreshToken);
      const parsedUser = JSON.parse(decodeURIComponent(user));
      dispatch(handleGoogleCallback({ token, refreshToken, user: parsedUser }))
        .unwrap()
        .then(() => navigate("/"))
        .catch(() => navigate("/login?error=google_login_failed"));
    }
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Processing Google Login...</h2>
        <p>Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
