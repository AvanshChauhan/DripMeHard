import { setError, setLoading, setUser } from "../../state/auth.slice.js";
import { getMe, login, register, updateContact } from "../auth.api.js";
import { useDispatch } from "react-redux";

/**
 * useAuth — hook exposing auth actions with Redux state management.
 * Errors are re-thrown after dispatching so callers can handle them.
 */
export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({
    email,
    contact,
    password,
    fullname,
    isSeller = false,
  }) {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await register({
        email,
        contact,
        password,
        fullname,
        isSeller,
      });
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
        "Login failed. Please try again.";
      dispatch(setError(message));
      // Re-throw so the form component can handle UI error state
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await getMe();
      dispatch(setUser(data.user));
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to fetch profile.";
      dispatch(setError(message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleUpdateContact({ contact }) {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await updateContact({ contact });
      dispatch(setUser(data.user));
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        "Failed to update contact number. Please try again.";
      dispatch(setError(message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleRegister, handleLogin, handleGetMe, handleUpdateContact };
};

