import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { logout, clearError } from "../store/slice/authSlice";
import type { RootState, AppDispatch } from "../store/store";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentUser, isAuthenticated, loading, error, token } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    currentUser,
    isAuthenticated,
    loading,
    error,
    token,
    logout: handleLogout,
    clearError: clearAuthError,
  };
};
