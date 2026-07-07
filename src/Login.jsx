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
      <div className="login-wrapper">

        {/* Carte contacts gauche */}
        <div className="contacts-card">

          <h2>Direction</h2>

          <div className="contact">
            <h3>👑 Patronne Anna Jiménez</h3>
            <p>📱 962-9384</p>
          </div>

          <div className="contact">
            <h3>👑 Co-patronne Gabii Jiménez</h3>
            <p>📱 333-0303</p>
          </div>

          <div className="contact">
            <h3>📋 DRH Kendrick Stone</h3>
            <p>📱 075-9973</p>
          </div>

          <div className="contact">
            <h3>📋 Manageur Mason Walker</h3>
            <p>📱 368-7626</p>
          </div>

        </div>

        {/* Formulaire */}
        <div className="login-card">

          <div className="login-header">

            <img
              src={logo}
              alt="Logo Ferme BioGood"
              style={{
                width: "200px",
                marginBottom: "15px",
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

        {/* Carte contacts droite */}
        <div className="contacts-card">

          <h2>Commerciaux</h2>

          <div className="contact">
            <h3>🚛 Commercial</h3>
            <p>📱 xxx-xxxx</p>
          </div>

          <div className="contact">
            <h3>🚛 Commercial</h3>
            <p>📱 xxx-xxxx</p>
          </div>

          <div className="contact">
            <h3>🚛 Commercial</h3>
            <p>📱 xxx-xxxx</p>
          </div>

          <div className="contact">
            <h3>🚛 Commercial</h3>
            <p>📱 xxx-xxxx</p>
          </div>

        </div>

      </div>
    </div>
  );
}