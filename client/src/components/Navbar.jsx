import { useState } from "react";
import { UserButton, useUser } from "@clerk/react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

        .navbar {
          height: 68px;
          width: 100%;
          padding: 0 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(12, 15, 26, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.2rem;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #fbbf24, #f97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-logo-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fbbf24, #f97316);
          display: inline-block;
          flex-shrink: 0;
          box-shadow: 0 0 8px rgba(251,191,36,0.6);
          /* needed to show since parent has text-fill transparent */
          -webkit-text-fill-color: initial;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-greeting {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .greeting-name {
          color: #94a3b8;
          font-weight: 500;
        }

        .greeting-separator {
          width: 1px;
          height: 16px;
          background: rgba(255,255,255,0.07);
        }

        /* Mobile toggle */
        .mobile-toggle {
          display: none;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          width: 38px;
          height: 38px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          padding: 0;
        }

        .mobile-toggle:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.12);
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: center;
          justify-content: center;
          width: 18px;
        }

        .hamburger span {
          display: block;
          height: 1.5px;
          background: #94a3b8;
          border-radius: 2px;
          transition: all 0.25s ease;
          transform-origin: center;
        }

        .hamburger span:nth-child(1) { width: 18px; }
        .hamburger span:nth-child(2) { width: 13px; }
        .hamburger span:nth-child(3) { width: 18px; }

        .hamburger.open span:nth-child(1) {
          width: 18px;
          transform: translateY(5.5px) rotate(45deg);
        }
        .hamburger.open span:nth-child(2) { opacity: 0; width: 0; }
        .hamburger.open span:nth-child(3) {
          width: 18px;
          transform: translateY(-5.5px) rotate(-45deg);
        }

        /* Mobile drawer */
        .mobile-drawer {
          position: absolute;
          top: 68px;
          left: 0;
          width: 100%;
          background: #0e1220;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 20px 28px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.5);
          animation: drawerDown 0.22s cubic-bezier(0.16,1,0.3,1);
        }

        @keyframes drawerDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .drawer-user {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
        }

        .drawer-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          color: #94a3b8;
        }

        @media (max-width: 767px) {
          .nav-right { display: none; }
          .mobile-toggle { display: flex; }
          .navbar { padding: 0 20px; }
        }
      `}</style>

      <nav className="navbar">
        {/* Logo */}
        <span className="nav-logo">
          <span className="nav-logo-dot" />
          AssignMate
        </span>

        {/* Desktop Right */}
        <div className="nav-right">
          <span className="nav-greeting">
            Hey,&nbsp;<span className="greeting-name">{user?.firstName || "there"}</span>
          </span>
          <span className="greeting-separator" />
          <UserButton afterSignOutUrl="/" />
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <div className={`hamburger ${open ? "open" : ""}`}>
            <span />
            <span />
            <span />
          </div>
        </button>

        {/* Mobile Drawer */}
        {open && (
          <div className="mobile-drawer">
            <div className="drawer-user">
              <UserButton afterSignOutUrl="/" />
              <span className="drawer-name">{user?.fullName || "User"}</span>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;