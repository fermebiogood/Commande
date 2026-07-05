import { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default function App() {
  const [company, setCompany] = useState(null);

  return (
    <>
      {company ? (
        <Dashboard company={company} onLogout={() => setCompany(null)} />
      ) : (
        <Login onLogin={setCompany} />
      )}
    </>
  );
}