import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { CartProvider } from "./components/context/cartProvider.tsx";
import { store } from "./store/store";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <StrictMode>
        <CartProvider>
          <Provider store={store}>
            <App />
            <Toaster />
          </Provider>
        </CartProvider>
      </StrictMode>
    </ThemeProvider>
  </BrowserRouter>
);
