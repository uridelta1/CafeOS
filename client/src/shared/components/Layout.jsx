import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { api } from "../utils/api.js";
import {
  Coffee, LayoutDashboard, ChartNoAxesCombined, ReceiptText,
  ClipboardList, Utensils, Package, Store, Settings as SettingsIcon,
  ChevronDown, Command, Menu as MenuIcon, X, Bell, Search,
} from "lucide-react";

const nav = [
  { label: "OVERVIEW", items: [["Dashboard", "/", LayoutDashboard], ["Sales overview", "/sales", ChartNoAxesCombined], ["Store manager", "/manager", Store]] },
  { label: "OPERATIONS", items: [["Billing / POS", "/billing", ReceiptText], ["Orders", "/orders", ClipboardList], ["Menu management", "/menu", Utensils], ["Inventory", "/inventory", Package]] },
  { label: "PREFERENCES", items: [["Settings", "/settings", SettingsIcon]] },
];

const titles = {
  "/": "Dashboard", "/sales": "Sales overview", "/manager": "Store manager dashboard",
  "/billing": "Billing / POS", "/orders": "Orders", "/menu": "Menu management",
  "/inventory": "Inventory", "/settings": "Settings",
};

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    api.get("/settings")
      .then((response) => localStorage.setItem("cafeos-currency", response.data.currency || "INR"))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setSearchOpen(false);
    setNotificationsOpen(false);
    setSearchQuery("");
  }, [location.pathname]);

  const pages = useMemo(() => nav.flatMap((group) => group.items), []);
  const filteredPages = pages.filter(([label]) => label.toLowerCase().includes(searchQuery.trim().toLowerCase()));

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Coffee size={23} /></div>
          <div><strong>cafe<span>os</span></strong><small>YOUR CAFÉ, IN SYNC</small></div>
          <button className="mobile-close" aria-label="Close menu" onClick={() => setMobileOpen(false)}><X /></button>
        </div>
        <div className="location-card">
          <div className="location-dot"><Coffee size={17} /></div>
          <div><b>Sunday Coffee</b><span>Baner, Pune</span></div>
          <ChevronDown size={15} />
        </div>
        <nav className="nav-groups">
          {nav.map((group) => (
            <div className="nav-group" key={group.label}>
              <div className="nav-label">{group.label}</div>
              {group.items.map(([label, path, Icon]) => (
                <NavLink end={path === "/"} to={path} key={path} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  <Icon size={18} /><span>{label}</span>{path === "/billing" && <span className="nav-kbd">⌘ B</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon"><Command size={18} /></div>
            <b>Good things brew here.</b>
            <p>Keep your café running smoothly, one cup at a time.</p>
            <div className="upgrade-line"><span /></div>
            <small>CAFEOS WORKSPACE <b>• ACTIVE</b></small>
          </div>
          <div className="profile">
            <div className="avatar">SC</div><div className="profile-info"><b>Sam Carter</b><span>Store owner</span></div>
            <button className="icon-button" aria-label="Profile options"><ChevronDown size={16} /></button>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu icon-button" aria-label="Open menu" onClick={() => setMobileOpen(true)}><MenuIcon size={20} /></button>
            <div className="breadcrumb">Workspace <span>/</span> <b>{titles[location.pathname] || "Page"}</b></div>
          </div>
          <div className="topbar-right">
            <div className="today-label"><span className="online-dot" /> Store is open</div>
            <div className="header-action-wrap">
              <button className="icon-button top-search" aria-label="Search pages" aria-expanded={searchOpen} onClick={() => { setSearchOpen((open) => !open); setNotificationsOpen(false); }}><Search size={18} /></button>
              {searchOpen && (
                <div className="header-dropdown search-dropdown">
                  <input autoFocus type="search" placeholder="Search pages..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} aria-label="Search pages" />
                  <div className="header-results">
                    {filteredPages.map(([label, path, Icon]) => (
                      <NavLink key={path} to={path} className="search-result" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}><Icon size={16} /><span>{label}</span></NavLink>
                    ))}
                    {filteredPages.length === 0 && <p className="search-empty">No matching pages found.</p>}
                  </div>
                </div>
              )}
            </div>
            <div className="header-action-wrap">
              <button className="icon-button notification" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen((open) => !open); setSearchOpen(false); }}><Bell size={18} /><i /></button>
              {notificationsOpen && (
                <div className="header-dropdown notification-dropdown">
                  <div className="dropdown-heading"><strong>Notifications</strong><span>Quick links to store activity</span></div>
                  <NavLink to="/manager" className="notification-item" onClick={() => setNotificationsOpen(false)}><Package size={18} /><div><strong>Inventory alerts</strong><p>Visit the manager dashboard to review stock alerts.</p></div></NavLink>
                  <NavLink to="/orders" className="notification-item" onClick={() => setNotificationsOpen(false)}><ClipboardList size={18} /><div><strong>Order activity</strong><p>Open orders to review current order status.</p></div></NavLink>
                  <p className="notification-note">These are shortcuts, not live alerts.</p>
                </div>
              )}
            </div>
            <div className="top-avatar">SC</div>
          </div>
        </header>
        <div className="page-content"><Outlet /></div>
        <footer className="footer"><span>© 2026 CafeOS</span><span>Made for the love of good coffee <Coffee size={13} /></span></footer>
      </main>
    </div>
  );
}
