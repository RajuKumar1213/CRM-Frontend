import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./tailwind.css";
import "./styles/base.css";
import "./styles/pattern.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

// Log theme initialization timing for debugging
if (process.env.NODE_ENV !== 'production' && window.__themeInitializedAt) {
  console.log(`Theme initialized at: ${window.__themeInitializedAt}`);
  console.log(`React mount at: ${new Date().toISOString()}`);
  console.log(`Time difference: ${new Date() - new Date(window.__themeInitializedAt)}ms`);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
