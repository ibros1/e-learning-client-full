import { RouterProvider } from "react-router";
import { mainRoter } from "./routes";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store/store";
import { WhoAmiFn } from "./store/slices/auth/user/getMe";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    dispatch(WhoAmiFn());
  }, [dispatch]);

  useEffect(() => {
    const saved = localStorage.getItem("dark");
    if (saved === "true") setIsDarkMode(true);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("dark", "true");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("dark", "false");
    }
  }, [isDarkMode]);

  return <RouterProvider router={mainRoter} />;
};

export default App;
