import { useRef, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (credentialResponse: { credential?: string }) => {
    try {
      setIsLoading(true);
      console.log("Google OAuth success:", credentialResponse);

      if (!credentialResponse.credential) {
        toast.error("Google sign-in failed. No credential received.");
        return;
      }

      await dispatch(googleLogin(credentialResponse.credential)).unwrap();
      toast.success("Google sign-in successful! Welcome!");
      navigate("/");
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    console.error("Google OAuth error occurred");
    toast.error("Google sign-in failed. Please try again.");
  };

  const handleCustomButtonClick = () => {
    try {
      const googleButton =
        googleButtonRef.current?.querySelector('div[role="button"]');
      if (googleButton) {
        (googleButton as HTMLElement).click();
      } else {
        console.warn("Google button not found, falling back to direct click");

        const fallbackButton = googleButtonRef.current?.querySelector(
          'button, [role="button"]'
        );
        if (fallbackButton) {
          (fallbackButton as HTMLElement).click();
        }
      }
    } catch (error) {
      console.error("Error clicking Google button:", error);
      toast.error("Unable to trigger Google sign-in. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <div ref={googleButtonRef} className="hidden">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap={false}
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
        disabled={isLoading}
      >
        <FcGoogle className="w-5 h-5" />
        {isLoading ? "Signing in..." : "Continue with Google"}
      </Button>
    </div>
  );
};

export default GoogleSignInButton;
