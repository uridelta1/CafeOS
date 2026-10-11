import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Wallet,
  ShoppingBag,
  Receipt,
  Package,
  Plus,
  Clock3,
  TrendingUp,
  Coffee,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { api, money, shortTime, getError } from "../shared/utils/api.js";
import {
  PageHeader,
  StatCard,
  Panel,
  Loading,
  ErrorNotice,
  Pill,
  Button,
  Empty,
} from "../shared/components/Primitives.jsx";
const fallback = [];
export default function Dashboard() {
  const [data, setData] = useState(null),
    [products, setProducts] = useState([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  const nav = useNavigate();
  async function load() {
    setLoading(true);
    setError("");
    try {
      const [a, b] = await Promise.all([
        api.get("/analytics/overview"),
        api.get("/products"),
      ]);
      setData(a.data);
      setProducts(b.data);
    } catch (e) {
      setError(getError(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  if (loading) return <Loading />;
  const week = data?.weekRows || [];
  return (
    <>
      <PageHeader
        eyebrow="SATURDAY, YOUR WAY"
        title="Good evening, Sam ☕"
        description="Here's what's brewing at your café today."
        action={
          <Button onClick={() => nav("/billing")}>
            <Plus size={17} /> New order
          </Button>
        }
      />
      {error && <ErrorNotice message={error} onRetry={load} />}
      <div className="stat-grid">
        <StatCard
          label="Today's revenue"
          value={money(data?.today?.revenue)}
          icon={Wallet}
          change={0}
          note="Today so far"
        />
        <StatCard
          label="Orders today"
          value={data?.today?.orders || 0}
          icon={ShoppingBag}
          change={0}
          note="Orders placed today"
          tone="purple"
        />
        <StatCard
          label="Average order value"
          value={money(data?.today?.average)}
          icon={Receipt}
          note="Per paid order"
          tone="orange"
        />
        <StatCard
          label="Low stock items"
          value={data?.lowStock || 0}
          icon={Package}
          note="Need a little love"
          tone="pink"
        />
      </div>
      <div className="dashboard-grid">
        <Panel
          title="Revenue at a glance"
          subtitle="Your last 7 days"
          action={
            <button className="link-button" onClick={() => nav("/sales")}>
              Full report <ArrowUpRight size={14} />
            </button>
          }
        >
          <div className="chart-summary">
            <strong>{money(data?.week?.revenue)}</strong>
            <span>
              <TrendingUp size={15} /> Last 7 days
            </span>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={week.map((r) => ({
                  day: new Date(r._id + "T12:00:00").toLocaleDateString(
                    "en-IN",
                    { weekday: "short" },
                  ),
                  revenue: r.revenue || 0,
                }))}
              >
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#285c45" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#285c45" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#edf0ea" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8b938b", fontSize: 11 }}
                />
                <YAxis hide />
                <Tooltip
                  formatter={(v) => money(v)}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e6e9e2",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#285c45"
                  strokeWidth={2.5}
                  fill="url(#revenueFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Quick actions" subtitle="The things you do most">
          <div className="quick-actions">
            <button onClick={() => nav("/billing")}>
              <span className="quick-icon lime">
                <Receipt size={20} />
              </span>
              <span>
                <b>Create a bill</b>
                <small>Start a new customer order</small>
              </span>
              <ArrowRight size={16} />
            </button>
            <button onClick={() => nav("/menu")}>
              <span className="quick-icon mint">
                <Coffee size={20} />
              </span>
              <span>
                <b>Update the menu</b>
                <small>Prices, availability and items</small>
              </span>
              <ArrowRight size={16} />
            </button>
            <button onClick={() => nav("/inventory")}>
              <span className="quick-icon peach">
                <Package size={20} />
              </span>
              <span>
                <b>Check inventory</b>
                <small>{data?.lowStock || 0} items at low stock</small>
              </span>
              <ArrowRight size={16} />
            </button>
          </div>
        </Panel>
      </div>
      <div className="dashboard-grid bottom-grid">
        <Panel
          title="Recent orders"
          subtitle="Latest activity from your café"
          action={
            <button className="link-button" onClick={() => nav("/orders")}>
              View all <ArrowUpRight size={14} />
            </button>
          }
        >
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>TIME</th>
                  <th>TYPE</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recent || []).slice(0, 5).map((o) => (
                  <tr key={o._id}>
                    <td className="mono">{o.orderNumber}</td>
                    <td>{shortTime(o.createdAt)}</td>
                    <td>{o.orderType}</td>
                    <td className="amount">{money(o.total)}</td>
                    <td>
                      <Pill
                        tone={
                          o.status === "Completed"
                            ? "green"
                            : o.status === "Cancelled"
                              ? "red"
                              : o.status === "Ready"
                                ? "blue"
                                : "orange"
                        }
                      >
                        {o.status}
                      </Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data?.recent?.length && (
              <Empty
                title="No orders yet"
                text="Your first order will show up here."
              />
            )}
          </div>
        </Panel>
        <Panel
          title="Menu pulse"
          subtitle="Items and availability"
          action={
            <button className="link-button" onClick={() => nav("/menu")}>
              Manage menu <ArrowUpRight size={14} />
            </button>
          }
        >
          <div className="menu-pulse">
            {products.slice(0, 4).map((p, i) => (
              <div className="pulse-item" key={p._id}>
                <div className={`food-dot food-${i % 4}`}>
                  {p.name?.slice(0, 1)}
                </div>
                <div className="pulse-info">
                  <b>{p.name}</b>
                  <small>{p.category}</small>
                </div>
                <div className="pulse-price">
                  <b>{money(p.price)}</b>
                  <small>{p.stock} in stock</small>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
