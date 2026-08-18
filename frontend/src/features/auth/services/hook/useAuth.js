import { setError, setLoading, setUser } from "../../state/auth.slice.js";
import { register, login } from "../auth.api.js";
import { useDispatch } from "react-redux";

/**
 * useAuth — hook exposing auth actions with Redux state management.
 * Errors are re-thrown after dispatching so callers can handle them.
 */
export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({ email, contact, password, fullname, isSeller = false }) {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await register({ email, contact, password, fullname, isSeller });
      dispatch(setUser(data.user));
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        "Registration failed. Please try again.";
      dispatch(setError(message));
      // Re-throw so the form component can handle UI error state
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await login({ email, password });
      dispatch(setUser(data.user));
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        "Login failed. Please check your credentials and try again.";
      dispatch(setError(message));
      // Re-throw so the form component can handle UI error state
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleRegister, handleLogin };
};

