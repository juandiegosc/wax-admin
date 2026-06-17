import { useState, type SyntheticEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import editorialLoginImage from '@/assets/images/editorial-login.png';
import { useAdminLogin, useAdminLogout, useCurrentAdmin } from '@/lib/hooks/useAdminAccount';
import { routePaths } from '@/routes/routePaths';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: currentUser, isLoading } = useCurrentAdmin();
  const loginMutation = useAdminLogin();
  const logoutMutation = useAdminLogout();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const locationState = location.state as { from?: { pathname?: string } } | null;
  const redirectTo = locationState?.from?.pathname ?? routePaths.overview;

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      await loginMutation.mutateAsync({ email, password });
      navigate(redirectTo, { replace: true });
    } catch {
      setErrorMessage('No fue posible iniciar sesion con esas credenciales.');
    }
  };

  if (currentUser?.roles?.includes('Admin')) {
    return (
      <section className="admin-auth-page">
        <div className="admin-auth-card">
          <span className="admin-section-label">Sesion activa</span>
          <h1 className="admin-auth-title">Ya estas dentro del panel.</h1>
          <p className="admin-auth-text">
            Entraste como {currentUser.email}. Puedes volver directamente al panel administrativo.
          </p>
          <Link to={routePaths.overview} className="admin-button">
            Ir al panel
          </Link>
        </div>
      </section>
    );
  }

  if (currentUser) {
    return (
      <section className="admin-auth-page">
        <div className="admin-auth-card">
          <span className="admin-section-label">Acceso denegado</span>
          <h1 className="admin-auth-title">Esta cuenta no tiene permisos de administrador.</h1>
          <p className="admin-auth-text">
            Entraste como {currentUser.email}, pero esa sesion no tiene el rol necesario para acceder al panel.
          </p>
          <div className="admin-auth-actions">
            <Link to={routePaths.forbidden} className="admin-button">
              Ver pagina 403
            </Link>
            <button
              className="admin-button admin-button-secondary"
              type="button"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? 'Cerrando sesion...' : 'Cerrar sesion'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-auth-page">
      <div className="admin-auth-shell">
        <div className="admin-auth-visual">
          <img
            className="admin-auth-visual-image"
            src={editorialLoginImage}
            alt="Pieza editorial de WAX"
          />
          <div aria-hidden className="admin-auth-visual-overlay" />
          <div className="admin-auth-visual-copy">
            <strong className="admin-auth-visual-title">WAX ADMIN</strong>
          </div>
        </div>

        <div className="admin-auth-card">
          <span className="admin-section-label">Acceso administrador</span>
          <h1 className="admin-auth-title">Iniciar sesion</h1>
          <p className="admin-auth-text">
            Usa el usuario administrador para entrar al modulo interno de gestion.
          </p>

          <form className="admin-auth-form" onSubmit={handleSubmit}>
            <label className="admin-auth-field">
              <span>Correo</span>
              <input
                className="admin-auth-input"
                type="email"
                autoComplete="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={loginMutation.isPending || isLoading}
                required
              />
            </label>

            <label className="admin-auth-field">
              <span>Contrasena</span>
              <div className="admin-password-field">
                <input
                  className="admin-auth-input"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Ingresa la contrasena"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loginMutation.isPending || isLoading}
                  required
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="19" height="19">
                      <path d="M3 3l18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9.4 5.2A8.9 8.9 0 0 1 12 5c5 0 9 5 9 7a11 11 0 0 1-2.3 3M6.3 6.3C3.9 7.8 2 10.4 2 12c0 2 4 7 9 7a9 9 0 0 0 3.6-.7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="19" height="19">
                      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  )}
                </button>
              </div>
            </label>

            {errorMessage ? <p className="admin-auth-feedback is-error">{errorMessage}</p> : null}

            <button className="admin-button admin-button-block" type="submit" disabled={loginMutation.isPending || isLoading}>
              {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};