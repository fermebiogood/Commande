export default function Commander({
  items,
  itemId,
  setItemId,
  quantity,
  setQuantity,
  addOrder,
}) {
  const selectedItem = items.find((i) => i.id === Number(itemId));

  return (
    <div className="commander-box">

      <h2 className="commander-title">
        🧾 Passer une commande
      </h2>

      {/* PRODUIT */}
      <label>Produit :</label>
      <select
        value={itemId}
        onChange={(e) => setItemId(Number(e.target.value))}
        className="select-box"
      >
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name} - {item.price}$
          </option>
        ))}
      </select>

      {/* QUANTITÉ */}
      <label>Quantité :</label>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => {
          const val = e.target.value;

          // autorise écriture temporaire (meilleure UX)
          if (val === "") {
            setQuantity("");
            return;
          }

          const num = Number(val);

          if (isNaN(num) || num < 1) return;

          setQuantity(num);
        }}
        className="quantity-input"
      />

      {/* TOTAL */}
      <p style={{
        marginTop: "10px",
        color: "#4CAF50",
        fontWeight: "bold"
      }}>
        Total : {selectedItem ? selectedItem.price * (quantity || 0) : 0}$
      </p>

      {/* BOUTON */}
      <button
        className="add-btn"
        onClick={() => {
          if (!selectedItem || !quantity || quantity < 1) return;
          addOrder();
        }}
      >
        ✔ Ajouter au panier
      </button>

    </div>
  );
}