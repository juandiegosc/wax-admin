import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { adminBrand, adminNavigation } from '@/config/brand';
import { useAdminLogout } from '@/lib/hooks/useAdminAccount';

export const AdminLayout = () => {
  const logoutMutation = useAdminLogout();
  const { pathname } = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const currentSection = adminNavigation.find(
    (item) => pathname === item.path || pathname.startsWith(item.path + '/')
  );

  // cerrar el drawer al cambiar de ruta
  useEffect(() => {
    setIsNavOpen(false);
  }, [pathname]);

  return (
    <div className="admin-shell">
      {isNavOpen ? (
        <button
          type="button"
          className="admin-sidebar-overlay"
          aria-label="Cerrar navegacion"
          onClick={() => setIsNavOpen(false)}
        />
      ) : null}

      <aside className={isNavOpen ? 'admin-sidebar is-open' : 'admin-sidebar'}>
        <div className="admin-brand">
          <img className="admin-brand-logo" src="/LogoWax.svg" alt="WAX" />
          <div className="admin-brand-text">
            <h1 className="admin-brand-title">{adminBrand.name}</h1>
            <span className="admin-brand-kicker">{adminBrand.label}</span>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Navegacion principal">
          {adminNavigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                isActive ? 'admin-nav-link is-active' : 'admin-nav-link'
              }
            >
              <span>{item.label}</span>
              <span className="admin-nav-meta">{item.meta}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-nav-toggle"
            aria-label="Abrir navegacion"
            aria-expanded={isNavOpen}
            onClick={() => setIsNavOpen(true)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>

          <div className="admin-topbar-copy">
            <span className="admin-section-label">
              {currentSection ? currentSection.meta : adminBrand.label}
            </span>
            <h2 className="admin-topbar-title">
              {currentSection ? currentSection.label : adminBrand.name}
            </h2>
          </div>

          <div className="admin-actions">
            <button
              type="button"
              className="admin-button admin-logout-button"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              aria-label={logoutMutation.isPending ? 'Cerrando sesion' : 'Cerrar sesion'}
              title={logoutMutation.isPending ? 'Cerrando sesion' : 'Cerrar sesion'}
            >
              <svg
                className="admin-logout-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M14 4h-5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 12h9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <path
                  d="M16 8l4 4-4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </header>

        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};
