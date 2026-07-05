import { useState, useEffect } from "react";
import { items } from "./data/items";
import Sidebar from "./Sidebar";
import Home from "./Home";
import Commander from "./Commander";

import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";

export default function Dashboard({ company, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);

  const [itemId, setItemId] = useState(items[0]?.id || 0);
  const [quantity, setQuantity] = useState(1);
  const [page, setPage] = useState("home");
  const [comment, setComment] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  const [editOrder, setEditOrder] = useState(null);
const [filterCompany, setFilterCompany] = useState("all");
const [sortByDate, setSortByDate] = useState("desc");

  // 🔥 ORDERS LIVE
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snapshot) => {
      setOrders(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsub();
  }, []);

  // 🛒 CART SYNC FIRESTORE
  useEffect(() => {
    const cartRef = doc(db, "carts", company.name);

    const unsub = onSnapshot(cartRef, (snap) => {
      if (snap.exists()) {
        setCart(snap.data().items || []);
      } else {
        setCart([]);
      }
    });

    return () => unsub();
  }, [company.name]);

  // 💾 SAVE CART
  useEffect(() => {
    const saveCart = async () => {
      const cartRef = doc(db, "carts", company.name);
      await setDoc(cartRef, { items: cart }, { merge: true });
    };

    saveCart();
  }, [cart, company.name]);

  // ➕ ADD CART
  const addToCart = () => {
    const item = items.find((i) => i.id === Number(itemId));
    if (!item) return;

    const qty = Number(quantity);
    if (qty <= 0) return;

    setCart((prev) => {
      const exist = prev.find((p) => p.id === item.id);

      if (exist) {
        return prev.map((p) =>
          p.id === item.id
            ? {
                ...p,
                quantity: p.quantity + qty,
                total: (p.quantity + qty) * p.price,
              }
            : p
        );
      }

      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: qty,
          total: item.price * qty,
        },
      ];
    });
  };

  // ➖ UPDATE CART
  const updateCartQuantity = (index, value) => {
    const newQty = Number(value);

    if (value === "") return;
    if (newQty < 1) return;

    setCart((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: newQty, total: item.price * newQty }
          : item
      )
    );
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };
const removeItemFromOrder = async (order, index) => {
  if (!order?.items) return;

  const newItems = order.items.filter((_, i) => i !== index);

  const newTotal = newItems.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  // 🔥 si plus aucun item → suppression complète de la commande
  if (newItems.length === 0) {
    await deleteDoc(doc(db, "orders", order.id));
    return;
  }

  await updateDoc(doc(db, "orders", order.id), {
    items: newItems,
    total: newTotal,
  });
};
  // 📦 CREATE ORDER
  const addOrder = async () => {
    if (cart.length === 0) return;

    const now = new Date();

    const newOrder = {
      from: company.name.trim(),
      to: "Ferme Biogood",
      items: cart,
      total: cart.reduce((sum, i) => sum + i.total, 0),
      status: "En attente",
      createdAt: Date.now(),
      dateDisplay: now.toLocaleDateString(),
      timeDisplay: now.toLocaleTimeString(),

      comment: comment,
      deliveryDate: deliveryDate,
    };

    await addDoc(collection(db, "orders"), newOrder);

    setComment("");
    setDeliveryDate("");

    setCart([]);
    setPage("livraison");
  };

  // 🗑 DELETE ORDER
  const deleteOrder = async (order) => {
    if (!order?.id) return;
    await deleteDoc(doc(db, "orders", order.id));
  };

  // ✏️ UPDATE STATUS (IMPORTANT: PAS TOTAL)
  const updateOrder = async () => {
    if (!editOrder) return;

    await updateDoc(doc(db, "orders", editOrder.id), {
      status: editOrder.status,
    });

    setEditOrder(null);
  };

const isBiogood = company.name === "Ferme Biogood";

const visibleOrders = orders
  .filter((o) => {
    if (!isBiogood) {
      return o.from?.trim() === company.name.trim();
    }

    if (page === "archive") {
      return o.status === "Livré";
    }

    return o.status !== "Livré";
  })
  .filter((o) => {
    if (!isBiogood) return true;

    return filterCompany === "all" || o.from === filterCompany;
  })
  .sort((a, b) =>
    sortByDate === "asc"
      ? a.createdAt - b.createdAt
      : b.createdAt - a.createdAt
  );

  const renderPage = () => {
    if (page === "home") return <Home company={company} />;
if (page === "archive")
  return (
    <div>
      <h1>📦 Archive (Livré)</h1>

{company.name === "Ferme Biogood" && (
  <div style={{ marginBottom: 10 }}>

  <label style={{ marginRight: "10px" }}>
    Trier par entreprise :
  </label>

  <select
    value={filterCompany}
    onChange={(e) => setFilterCompany(e.target.value)}
    style={{ padding: "6px" }}
  >
    <option value="all">Toutes les entreprises</option>

    {[...new Set(orders.map((o) => o.from))].map((name) => (
      <option key={name} value={name}>
        {name}
      </option>
    ))}
  </select>

</div>
)}

{company.name === "Ferme Biogood" && (
  <div style={{ marginBottom: 10 }}>

    <label style={{ marginRight: "10px" }}>
      Trier par date :
    </label>

    <select
      value={sortByDate}
      onChange={(e) => setSortByDate(e.target.value)}
      style={{ padding: "6px" }}
    >
      <option value="desc">📅 Plus récent</option>
      <option value="asc">📅 Plus ancien</option>
    </select>

  </div>
)}

      {visibleOrders.map((order) => (
        <div key={order.id} className="order-card">

          <p>🏢 <strong>{order.from}</strong></p>
          <p>📅 {order.dateDisplay}</p>
          <p>🕒 {order.timeDisplay}</p>

          {order.deliveryDate && (
            <p>
  📦 Livraison prévue : {order.deliveryDate?.replace("T", " ")}
</p>
          )}

          {order.comment && (
            <p>📝 Commentaire : {order.comment}</p>
          )}

          <hr />

          <h4>📦 Produits</h4>

          {order.items?.map((item, index) => (
  <div
    key={index}
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "5px",
    }}
  >
    <span>
      {item.quantity}x {item.name}
    </span>

    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <span>{item.total}$</span>

      {company.name === "Ferme Biogood" &&
        order.status?.toLowerCase().includes("attente") && (
          <button onClick={() => removeItemFromOrder(order, index)}
            style={{
              background: "#e53935",
              color: "white",
              border: "none",
              padding: "5px 8px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            ✖
          </button>
        )}
    </div>
  </div>
))}

          <hr />

          <p><strong>Total :</strong> {order.total}$</p>

          <span
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "12px",
              display: "inline-block",
              background: "rgba(76, 175, 80, 0.15)",
              color: "#4caf50",
            }}
          >
            Livré
          </span>

{company.name === "Ferme Biogood" && (
  <button
    onClick={() => deleteOrder(order)}
    style={{
      marginLeft: "10px",
      background: "#e53935",
      color: "white",
      border: "none",
      padding: "6px 10px",
      borderRadius: "8px",
      cursor: "pointer",
    }}
  >
    🗑 Supprimer
  </button>
)}

        </div>
      ))}
    </div>
  );

    if (page === "commander")
      return (
        <div className="commander-layout">
          <div className="commander-left">
            <Commander
              items={items}
              itemId={itemId}
              setItemId={setItemId}
              quantity={quantity}
              setQuantity={setQuantity}
              addOrder={addToCart}
            />
          </div>

          <div className="commander-right order-card">
            <h3>🛒 Panier</h3>
            <div style={{ marginBottom: "15px" }}>
  <h4>📦 Infos livraison</h4>

  {/* commentaire */}
<textarea
  className="comment-box"
  placeholder="Commentaire"
  value={comment}
  onChange={(e) => setComment(e.target.value)}
/>

  {/* date + heure livraison */}
  <input
    type="datetime-local"
    value={deliveryDate}
    onChange={(e) => setDeliveryDate(e.target.value)}
    style={{
      width: "100%",
      padding: "8px",
      borderRadius: "8px"
    }}
  />
</div>

            {cart.length === 0 ? (
              <p>Panier vide</p>
            ) : (
              cart.map((i, idx) => (
                <div key={idx} className="cart-item">
                  <span>{i.name}</span>

                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <button onClick={() => updateCartQuantity(idx, i.quantity - 1)}>
                      -
                    </button>

                    {/* 🔥 QUANTITÉ BIEN AFFICHÉE */}
                    <span>{i.quantity}</span>

                    <button onClick={() => updateCartQuantity(idx, i.quantity + 1)}>
                      +
                    </button>

                    <span>{i.total}$</span>

                    <button className="btn-delete" onClick={() => removeFromCart(idx)}>
  ✖
</button>
                  </div>
                </div>
              ))
            )}

<p
  style={{
    marginTop: "20px",
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "right",
    color: "#4CAF50",
  }}
>
  Total : {cart.reduce((sum, item) => sum + item.total, 0)}$
</p>

            <button onClick={addOrder}>✔ Valider</button>
          </div>
        </div>
      );

    if (page === "livraison")
      return (
        <div>
          <h1>📜 Commandes</h1>

          {visibleOrders.map((order) => (
            <div key={order.id} className="order-card">
              <p>🏢 <strong>{order.from}</strong></p>
              <p>📅 {order.dateDisplay}</p>
              <p>🕒 {order.timeDisplay}</p>
              {order.deliveryDate && (
  <p>
  📦 Livraison prévue :{" "}
  {new Date(order.deliveryDate).toLocaleDateString("fr-FR")} à{" "}
  {new Date(order.deliveryDate).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })}
</p>
)}

{order.comment && (
  <p>📝 Commentaire : {order.comment}</p>
)}

              <hr />

              <h4>📦 Produits</h4>

              {order.items?.map((item, index) => (
                
                
  <div
    key={index}
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "5px"
    }}
  >
    <span>
      {item.quantity}x {item.name}
    </span>

    <span>
      {item.total}$
    </span>
  </div>
))}

              <hr />

              <p><strong>Total :</strong> {order.total}$</p>

              <p className={`status ${order.status}`}>{order.status}</p>
              

              {/* 🔥 ADMIN FERME BIOGOOD */}
              {company.name === "Ferme Biogood" && (
                <>
                  <button onClick={() => setEditOrder(order)}>✏️ Statut</button>
                  <button
  onClick={() => deleteOrder(order)}
  style={{
    background: "#e53935",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    marginLeft: "10px",
  }}
>
  🗑 Supprimer
</button>
                </>
              )}
              {company.name !== "Ferme Biogood" &&
  order.status === "En attente" && (
    <button
      onClick={() => deleteOrder(order)}
      style={{
        marginLeft: "10px",
        background: "#e53935",
        color: "white",
        border: "none",
        padding: "6px 10px",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      ❌ Annuler la commande
    </button>
)}

              {/* EDIT STATUS UNIQUEMENT */}
              {editOrder?.id === order.id && (
                <div style={{ marginTop: 10 }}>
<div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>

  <button
    onClick={() => setEditOrder({ ...editOrder, status: "En attente" })}
    style={{
      background: editOrder.status === "En attente" ? "#ff9800" : "transparent",
      color: editOrder.status === "En attente" ? "black" : "#ff9800",
      border: "1px solid #ff9800",
      padding: "6px 10px",
      borderRadius: "8px",
      cursor: "pointer"
    }}
  >
    🟠 En attente
  </button>

  <button
    onClick={() => setEditOrder({ ...editOrder, status: "En préparation" })}
    style={{
      background: editOrder.status === "En préparation" ? "#2196f3" : "transparent",
      color: editOrder.status === "En préparation" ? "white" : "#2196f3",
      border: "1px solid #2196f3",
      padding: "6px 10px",
      borderRadius: "8px",
      cursor: "pointer"
    }}
  >
    🔵 En préparation
  </button>

  <button
    onClick={() => setEditOrder({ ...editOrder, status: "Livré" })}
    style={{
      background: editOrder.status === "Livré" ? "#4caf50" : "transparent",
      color: editOrder.status === "Livré" ? "white" : "#4caf50",
      border: "1px solid #4caf50",
      padding: "6px 10px",
      borderRadius: "8px",
      cursor: "pointer"
    }}
  >
    🟢 Livré
  </button>

</div>

                  <button onClick={updateOrder}>✔ Sauvegarder</button>
                  <button onClick={() => setEditOrder(null)}>❌ Annuler</button>
                </div>
              )}
            </div>
          ))}
        </div>
      );
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        company={company}
        page={page}
        setPage={setPage}
        onLogout={onLogout}
      />

      <div className="dashboard-content">{renderPage()}</div>
    </div>
  );
}