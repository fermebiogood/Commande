export default function Sidebar({ company, page, setPage, onLogout }) {
  return (
    <div className="sidebar">

      <h2 className="sidebar-title">Espace Entreprise</h2>

      <p className="sidebar-company">
        🏢 {company.name}
      </p>

      <button
        className={page === "home" ? "active" : ""}
        onClick={() => setPage("home")}
      >
        🏠 Accueil
      </button>

      <button
        className={page === "commander" ? "active" : ""}
        onClick={() => setPage("commander")}
      >
        📦 Commander
      </button>

      <button
        className={page === "livraison" ? "active" : ""}
        onClick={() => setPage("livraison")}
      >
        🚛 Livraison
      </button>

      <button
        className={page === "archive" ? "active" : ""}
        onClick={() => setPage("archive")}
      >
        📦 Archive
      </button>

      <button className="logout" onClick={onLogout}>
        🚪 Déconnexion
      </button>

    </div>
  );
}