import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { startMocks } from "@/mock/init";
import { db,seed } from "./mock/db.ts";

async function bootstrap() {
  await startMocks();
   //await db.delete();
  await seed();
  
  const root = ReactDOM.createRoot(document.getElementById("root")!);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap();
