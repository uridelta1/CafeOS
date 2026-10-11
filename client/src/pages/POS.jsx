import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Receipt,
  ShoppingBag,
  CheckCircle2,
  Printer,
  Utensils,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api, money, getError } from "../shared/utils/api.js";
import {
  PageHeader,
  Panel,
  Loading,
  ErrorNotice,
  Pill,
  Button,
  Empty,
} from "../shared/components/Primitives.jsx";
export default function POS() {
  const [products, setProducts] = useState([]),
    [cart, setCart] = useState([]),
    [search, setSearch] = useState(""),
    [category, setCategory] = useState("All"),
    [orderType, setOrderType] = useState("Dine in"),
    [tableNumber, setTableNumber] = useState(""),
    [paymentMethod, setPaymentMethod] = useState("UPI"),
    [discount, setDiscount] = useState(0),
    [taxRate, setTaxRate] = useState(5),
    [settings, setSettings] = useState(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [success, setSuccess] = useState(null);
  const nav = useNavigate();
  useEffect(() => {
    Promise.all([api.get("/products"), api.get("/settings")])
      .then(([p, s]) => {
        setProducts(p.data);
        setSettings(s.data);
        setTaxRate(Number(s.data.taxRate || 5));
      })
      .catch((e) => setError(getError(e)))
      .finally(() => setLoading(false));
  }, []);
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const visible = products.filter(
    (p) =>
      p.available &&
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || p.category === category),
  );
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0),
    discountAmount = Math.min(subtotal, Math.max(0, Number(discount) || 0)),
    serviceCharge =
      Math.round(
        (subtotal - discountAmount) * Number(settings?.serviceCharge || 0),
      ) / 100,
    tax =
      Math.round((subtotal - discountAmount + serviceCharge) * taxRate) / 100,
    total =
      Math.round((subtotal - discountAmount + serviceCharge + tax) * 100) / 100;
  function add(p) {
    setSuccess(null);
    setCart((old) => {
      const found = old.find((i) => i._id === p._id);
      if (found)
        return old.map((i) =>
          i._id === p._id
            ? { ...i, quantity: Math.min(i.quantity + 1, p.stock) }
            : i,
        );
      return [...old, { ...p, quantity: 1 }];
    });
  }
  function qty(id, delta) {
    setCart((old) =>
      old.map((i) =>
        i._id === id
          ? {
              ...i,
              quantity: Math.max(1, Math.min(i.stock, i.quantity + delta)),
            }
          : i,
      ),
    );
  }
  async function checkout() {
    setError("");
    try {
      const r = await api.post("/orders", {
        items: cart.map((i) => ({ productId: i._id, quantity: i.quantity })),
        discount: discountAmount,
        orderType,
        tableNumber: orderType === "Dine in" ? tableNumber : "",
        paymentMethod,
      });
      setSuccess(r.data);
      setCart([]);
      setDiscount(0);
      const p = await api.get("/products");
      setProducts(p.data);
    } catch (e) {
      setError(getError(e));
    }
  }
  function printReceipt() {
    if (!success) return;
    window.print();
  }
  if (loading) return <Loading />;
  return (
    <>
      <PageHeader
        eyebrow="POINT OF SALE"
        title="Make it a good one."
        description="Build an order, take payment and send a little happiness."
        action={
          <Button variant="secondary" onClick={() => nav("/orders")}>
            <Receipt size={16} /> Order history
          </Button>
        }
      />
      {error && <ErrorNotice message={error} onRetry={() => setError("")} />}
      {success && (
        <div className="notice success">
          <CheckCircle2 size={18} />
          <span>
            <b>Order {success.orderNumber} created.</b> Total paid:{" "}
            {money(success.total)}.
          </span>
          <button className="text-button" onClick={printReceipt}>
            <Printer size={15} /> Print receipt
          </button>
          <button className="text-button" onClick={() => setSuccess(null)}>
            Dismiss
          </button>
        </div>
      )}
      <div className="print-receipt">
        <div className="print-receipt-head">
          <h2>{settings?.cafeName || "Sunday Coffee"}</h2>
          <p>{settings?.address || ""}</p>
          <p>{settings?.phone || ""}</p>
        </div>
        <hr />
        <p>Receipt: {success?.orderNumber}</p>
        <p>
          {success?.createdAt
            ? new Date(success.createdAt).toLocaleString()
            : new Date().toLocaleString()}
        </p>
        <hr />
        {(success?.items || []).map((item, i) => (
          <div className="print-line" key={i}>
            <span>
              {item.quantity} × {item.name}
            </span>
            <span>{money(item.price * item.quantity)}</span>
          </div>
        ))}
        <hr />
        <div className="print-line">
          <span>Subtotal</span>
          <span>{money(success?.subtotal)}</span>
        </div>
        <div className="print-line">
          <span>Discount</span>
          <span>− {money(success?.discount)}</span>
        </div>
        <div className="print-line">
          <span>Service charge</span>
          <span>{money(success?.serviceCharge)}</span>
        </div>
        <div className="print-line">
          <span>Tax</span>
          <span>{money(success?.tax)}</span>
        </div>
        <hr />
        <div className="print-line print-total">
          <b>Total paid</b>
          <b>{money(success?.total)}</b>
        </div>
        <p className="print-thanks">
          {settings?.receiptFooter || "Thanks for stopping by. See you soon!"}
        </p>
      </div>
      <div className="pos-layout">
        <div className="pos-products">
          <div className="pos-tools">
            <label className="search-box">
              <Search size={16} />
              <input
                placeholder="Find your favourite…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <div className="category-pills">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={category === c ? "chosen" : ""}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="product-grid">
            {visible.map((p, i) => (
              <button
                key={p._id}
                className="product-tile"
                onClick={() => add(p)}
                disabled={p.stock <= 0}
              >
                <div className={`product-art art-${i % 6}`}>
                  <span>
                    {p.name
                      .split(" ")
                      .map((x) => x[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <i>
                    <Plus size={16} />
                  </i>
                </div>
                <div className="product-tile-copy">
                  <b>{p.name}</b>
                  <small>{p.category}</small>
                  <div>
                    <strong>{money(p.price)}</strong>
                    <span>{p.stock} left</span>
                  </div>
                </div>
              </button>
            ))}
            {!visible.length && (
              <Empty
                title="Nothing on the menu"
                text="Try another search or category."
              />
            )}
          </div>
        </div>
        <aside className="cart-panel">
          <div className="cart-title">
            <div>
              <h3>Current order</h3>
              <p>
                {cart.reduce((s, i) => s + i.quantity, 0)} items in your basket
              </p>
            </div>
            <span className="cart-bag">
              <ShoppingBag size={19} />
            </span>
          </div>
          <div className="order-type-switch">
            {["Dine in", "Takeaway", "Delivery"].map((t) => (
              <button
                key={t}
                className={orderType === t ? "selected" : ""}
                onClick={() => setOrderType(t)}
              >
                {t}
              </button>
            ))}
          </div>
          {orderType === "Dine in" && (
            <label className="field-label">
              Table number
              <input
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g. 04"
              />
            </label>
          )}
          <div className="cart-items">
            {cart.map((i) => (
              <div className="cart-item" key={i._id}>
                <div className="cart-item-art">{i.name.slice(0, 1)}</div>
                <div className="cart-item-copy">
                  <b>{i.name}</b>
                  <small>{money(i.price)} each</small>
                  <div className="qty-control">
                    <button onClick={() => qty(i._id, -1)}>
                      <Minus size={12} />
                    </button>
                    <span>{i.quantity}</span>
                    <button
                      onClick={() => qty(i._id, 1)}
                      disabled={i.quantity >= i.stock}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <div className="cart-item-total">
                  <b>{money(i.price * i.quantity)}</b>
                  <button
                    onClick={() =>
                      setCart((c) => c.filter((x) => x._id !== i._id))
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {!cart.length && (
              <Empty
                title="Your basket is empty"
                text="Choose a menu item to start an order."
              />
            )}
          </div>
          <div className="cart-bottom">
            <label className="field-label">
              Payment method
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option>UPI</option>
                <option>Cash</option>
                <option>Card</option>
              </select>
            </label>
            <label className="field-label">
              Discount amount (₹)
              <input
                type="number"
                min="0"
                max={subtotal}
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </label>
            <div className="bill-lines">
              <div>
                <span>Subtotal</span>
                <b>{money(subtotal)}</b>
              </div>
              <div>
                <span>Discount</span>
                <b>− {money(discountAmount)}</b>
              </div>
              <div>
                <span>
                  Service charge ({Number(settings?.serviceCharge || 0)}%)
                </span>
                <b>{money(serviceCharge)}</b>
              </div>
              <div>
                <span>Tax ({taxRate}%)</span>
                <b>{money(tax)}</b>
              </div>
              <div className="bill-total">
                <span>Total due</span>
                <strong>{money(total)}</strong>
              </div>
            </div>
            <Button block disabled={!cart.length} onClick={checkout}>
              <Receipt size={17} /> Charge {money(total)}
            </Button>
            <p className="secure-note">
              Taxes calculated using your café settings.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
