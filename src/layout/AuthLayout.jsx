import { Outlet } from "react-router";

/*
  AuthLayout behavior:
  ┌─────────────────────────────────────┐
  │  DESKTOP (≥768px)                   │
  │  ┌──────────────┬──────────────┐    │
  │  │  Left side   │  Form/Outlet │    │
  │  │  (branding,  │  (Login /    │    │
  │  │   image etc) │   Register)  │    │
  │  └──────────────┴──────────────┘    │
  ├─────────────────────────────────────┤
  │  MOBILE (<768px)                    │
  │  ┌──────────────────────────────┐   │
  │  │  Form / Outlet  (TOP)        │   │
  │  ├──────────────────────────────┤   │
  │  │  Left side content  (BELOW)  │   │
  │  └──────────────────────────────┘   │
  └─────────────────────────────────────┘

  On mobile we use `order` to push the form above the left content.
*/

const AuthLayout = () => {
  return (
    <>
      <style>{`
        .al-root {
          min-height: 100vh;
          background: #f0f4ff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
        }

        .al-card {
          width: 100%;
          max-width: 960px;
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(59,130,246,0.1);

          /* Desktop: side by side */
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        /* Left branding column */
        .al-left {
          background: linear-gradient(145deg, #1d4ed8 0%, #3b82f6 60%, #60a5fa 100%);
          padding: 52px 44px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 32px;
          position: relative;
          overflow: hidden;
        }
        .al-left::before {
          content: '';
          position: absolute; bottom: -60px; right: -60px;
          width: 220px; height: 220px;
          background: rgba(255,255,255,0.07); border-radius: 50%;
        }
        .al-left::after {
          content: '';
          position: absolute; top: -40px; left: -40px;
          width: 160px; height: 160px;
          background: rgba(255,255,255,0.05); border-radius: 50%;
        }
        .al-logo {
          display: flex; align-items: center; gap: 14px;
          position: relative; z-index: 1;
        }
        .al-logo-icon {
          width: 52px; height: 52px;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px;
        }
        .al-logo-name {
          font-size: 26px; font-weight: 700;
          color: #fff; letter-spacing: -0.3px;
        }
        .al-logo-sub {
          font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 2px;
        }
        .al-tagline {
          font-size: 14px; font-weight: 300;
          color: rgba(255,255,255,0.75); line-height: 1.7;
          position: relative; z-index: 1;
        }
        .al-features {
          display: flex; flex-direction: column; gap: 10px;
          position: relative; z-index: 1;
        }
        .al-feat {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 10px;
        }
        .al-feat-icon {
          width: 28px; height: 28px;
          background: rgba(255,255,255,0.15); border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; flex-shrink: 0;
        }
        .al-feat-txt { font-size: 12px; color: rgba(255,255,255,0.82); }
        .al-copy {
          font-size: 10px; color: rgba(255,255,255,0.35);
          position: relative; z-index: 1;
        }

        /* Right form column */
        .al-right {
          padding: 52px 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .al-right > * { width: 100%; max-width: 380px; }

        /* ════════════════════════════════
           MOBILE  ≤ 767px
           Switch to single column.
           Form (right/outlet) comes FIRST via order.
           Branding (left) comes SECOND below.
        ════════════════════════════════ */
        @media (max-width: 767px) {
          .al-root { padding: 16px 14px; align-items: flex-start; padding-top: 24px; }

          .al-card {
            grid-template-columns: 1fr;   /* single column */
            border-radius: 18px;
            max-width: 440px;
            margin: 0 auto;
          }

          /* FORM moves to top */
          .al-right {
            order: 1;
            padding: 32px 24px 24px;
          }

          /* BRANDING moves to bottom */
          .al-left {
            order: 2;
            padding: 28px 24px;
            gap: 16px;
            /* lighter on mobile — just a strip */
          }

          /* hide decorative pseudo-elements on mobile for cleaner look */
          .al-left::before, .al-left::after { display: none; }

          /* collapse features on mobile — show just logo + tagline */
          .al-features { display: none; }
          .al-copy { display: none; }

          .al-logo-name { font-size: 20px; }
          .al-tagline { font-size: 13px; }
        }

        @media (max-width: 400px) {
          .al-right { padding: 26px 18px 20px; }
          .al-left  { padding: 22px 18px; }
        }
      `}</style>

      <div className="al-root">
        <div className="al-card">

          {/* LEFT — branding */}
          <div className="al-left">
            <div className="al-logo">
              <div className="al-logo-icon">💊</div>
              <div>
                <div className="al-logo-name">PharmaHub</div>
                <div className="al-logo-sub">Management System</div>
              </div>
            </div>

            <p className="al-tagline">
              The ultimate solution for managing your pharmacy inventory and sales with precision.
            </p>

            <div className="al-features">
              <div className="al-feat">
                <div className="al-feat-icon">📦</div>
                <span className="al-feat-txt">Smart inventory tracking & alerts</span>
              </div>
              <div className="al-feat">
                <div className="al-feat-icon">📊</div>
                <span className="al-feat-txt">Real-time sales analytics dashboard</span>
              </div>
              <div className="al-feat">
                <div className="al-feat-icon">🔒</div>
                <span className="al-feat-txt">Secure role-based access control</span>
              </div>
            </div>

            <p className="al-copy">© 2026 PharmaHub Management System</p>
          </div>

          {/* RIGHT — Login / Register via Outlet */}
          <div className="al-right">
            <Outlet />
          </div>

        </div>
      </div>
    </>
  );
};

export default AuthLayout;