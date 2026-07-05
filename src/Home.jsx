export default function Home({ company }) {
  return (
    <div className="home-box">

      {/* 🔥 TITRE FIXE */}
      <h1 className="main-title">
        Ferme BioGood
      </h1>

      {/* 👋 BIENVENUE DYNAMIQUE */}
      <h2 className="welcome-title">
        Bienvenue {company.name}
      </h2>

      <p>
        Merci de respecter les règles de l'entreprise et de ne pas divulguer vos informations de connexion à des tiers.
      </p>

      {/* 📜 Encadré du règlement */}
      <div className="rules-box">

        <h3>📜 Règlement des commandes</h3>

        <p>
          Bienvenue sur l'interface de commande de la <strong>Ferme BioGood</strong>.
        </p>

        <p>
          Afin de garantir un service rapide, organisé et de qualité, merci de respecter les règles suivantes :
        </p>

        <ol
          style={{
            textAlign: "left",
            lineHeight: "1.8",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <li>
            Toute commande est considérée comme <strong>validée</strong> dès sa confirmation.
          </li>

          <li>
            Vérifiez attentivement les produits et les quantités avant de valider votre panier.
          </li>

          <li>
            Toute demande d'annulation doit être effectuée avant le début de la préparation de la commande.
          </li>

          <li>
            Le champ <strong>Commentaire</strong> est réservé aux informations importantes concernant votre commande, par exemple :
            <ul>
              <li>Numéro de téléphone ;</li>
              <li>Contraintes de livraison ;</li>
              <li>Commande urgente (moins de 24 heures) ;</li>
              <li>Toute autre information utile.</li>
            </ul>
          </li>

          <li>
            Veuillez renseigner une date et une heure de livraison lors de votre commande.
          </li>

          <li>
            Les commandes urgentes ne sont <strong>pas prioritaires</strong> si elles n'ont pas été signalées au préalable par téléphone à un membre de la Ferme BioGood.
          </li>

          <li>
            Toute tentative d'abus, de fausse commande ou de spam pourra entraîner un refus de commande et des sanctions.
          </li>

          <li>
            Merci de faire preuve de respect envers l'ensemble des employés de la Ferme BioGood.
          </li>

          <li>
            En cas de question ou de problème concernant une commande, contactez directement un commercial ou un membre de la direction de la Ferme BioGood.
          </li>

          <li>
            En validant une commande, vous reconnaissez avoir pris connaissance de ce règlement et vous vous engagez à le respecter.
          </li>
        </ol>

        <h3
          style={{
            color: "#4CAF50",
            marginTop: "30px",
            textAlign: "center",
          }}
        >
          🌿 La Ferme BioGood vous remercie de votre confiance. 🌿
        </h3>

      </div>

    </div>
  );
}