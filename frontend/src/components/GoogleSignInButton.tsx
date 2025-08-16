import { useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../store/slice/authSlice";
import { toast } from "react-toastify";
import type { AppDispatch } from "../store/store";
import Button from "./Button";
import { FcGoogle } from "react-icons/fc";

const GoogleSignInButton = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleSuccess = async (credentialResponse: { credential?: string }) => {
    try {
      if (!credentialResponse.credential) {
        toast.error("Google sign-in failed. No credential received.");
        return;
      }

      await dispatch(googleLogin(credentialResponse.credential)).unwrap();
      toast.success("Google sign-in successful! Welcome!");
      navigate("/");
    } catch {
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  const handleError = () => {
    toast.error("Google sign-in failed. Please try again.");
  };

  const handleCustomButtonClick = () => {
    const googleButton =
      googleButtonRef.current?.querySelector('div[role="button"]');
    if (googleButton) {
      (googleButton as HTMLElement).click();
    }
  };

  return (
    <div className="w-full">
      <div ref={googleButtonRef} className="hidden">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
          width="100%"
        />
      </div>

      <Button
        onClick={handleCustomButtonClick}
        variant="outline"
        size="lg"
        fullWidth={false}
        className="flex items-center justify-center gap-3 w-full"
      >
        <FcGoogle className="w-5 h-5" />
        Continue with Google
      </Button>
    </div>
  );
};

export default GoogleSignInButton;
