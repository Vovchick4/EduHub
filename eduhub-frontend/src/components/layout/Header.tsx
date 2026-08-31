import { useLogoutMutation } from "../../api/auth/authApi";
import { clearTokens } from "../../api/auth/tokenStorage";
import { useIsAuthenticated } from "../../auth/useAuthState";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import styles from './Header.module.css'

const Header: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const logout = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } catch (error) {
      console.error("Помилка при логауті:", error);
    } finally {
      clearTokens();
      navigate('/');
    }
  };

  return (
    <header className={styles.mainHeader}>
      <div className={styles.headerContainer}>
        <div className={styles.logo}>
          <Link to="/">🎓 <span className={styles.logoText}>EduHub</span></Link>
        </div>

        <nav className={styles.mainNav}>
          { isAuthenticated ? (
            <>
              <Link to="/courses" className={styles.navLink}>Курси</Link>
              <Link to="/profile" className={styles.navLink}>Профіль</Link>
              <button onClick={handleLogout} className={`${styles.btnNav} ${styles.btnLogout}`}>
                Вийти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`${styles.btnNav} ${styles.btnLogin}`}>Вхід</Link>
              <Link to="/register" className={`${styles.btnNav} ${styles.btnRegister}`}>Реєстрація</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header
