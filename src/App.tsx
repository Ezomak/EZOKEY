import { useState } from "react";
import EzKeyDashboard from "./components/EzKeyDashboard";
import { EzKeyAdminPanel } from "./components/EzKeyAdminPanel";
import { EzKeyMultiUserBoard } from "./components/EzKeyMultiUserBoard";

// Option : Sélection du mode d’affichage (user, admin, leaderboard)
export default function App() {
  const [selectedPanel, setSelectedPanel] = useState<
    "user" | "admin" | "multi"
  >("user");

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        background: "#f5f6fa",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: "18px 0",
          background: "#fff",
        }}
      >
        <img
          src="/logo192.png"
          alt="Logo Ez-Key"
          style={{ width: 48, borderRadius: 8 }}
        />
        <h1>Ez-Key Dashboard</h1>
      </header>
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "18px 0",
          gap: 16,
        }}
      >
        <button onClick={() => setSelectedPanel("user")}>
          Mon Dashboard
        </button>
        <button onClick={() => setSelectedPanel("multi")}>
          Leaderboard/Multi-user
        </button>
        <button onClick={() => setSelectedPanel("admin")}>
          Panel Admin
        </button>
      </nav>
      <main
        style={{
          maxWidth: 620,
          margin: "0 auto",
          padding: 18,
        }}
      >
        {selectedPanel === "user" && <EzKeyDashboard />}
        {selectedPanel === "multi" && (
          <EzKeyMultiUserBoard />
        )}
        {selectedPanel === "admin" && <EzKeyAdminPanel />}
      </main>
      <footer
        style={{
          textAlign: "center",
          color: "#BBB",
          padding: 14,
          fontSize: 14,
          marginTop: 16,
        }}
      >
        Ez-Key Polygon © {new Date().getFullYear()} •
        Powered by ethers.js (+ React)
      </footer>
    </div>
  );
}
