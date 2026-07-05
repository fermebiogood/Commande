import { useState } from "react";
import { companies } from "./data/companies";
import logo from "./assets/Logo_Ferme_BioGood-removebg-preview.png";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const company = companies.find(
      (c) => c.username === username && c.password === password
    );

    if (company) {
      onLogin(company);
    } else {
      alert("Identifiants incorrects");
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">

<div
  className="logo"
  style={{ backgroundImage: `url(${logo})` }}
></div>

<img
  src={logo}
  alt="Logo Ferme BioGood"
  style={{
    width: "200px",
    marginBottom: "15px"
  }}
/>

  <h1>🌿 Bienvenue 🌿</h1>

</div>

        <label>Identifiant</label>

<input
  type="text"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  placeholder="Entrez votre identifiant"
/>

<label>Mot de passe</label>

<input
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Entrez votre mot de passe"
/>

        <button onClick={handleLogin}>
          Connexion
        </button>

      </div>

    </div>
  );
}