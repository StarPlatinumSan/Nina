import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./style.scss";
import "./edit.scss";
import "./components/PhotoCarousel.scss";
import "./components/MusicWidget.scss";
import "./components/SongSidebar.scss";
import "./components/FloatingCats.scss";
import "./pages/GalleryPage.scss";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
