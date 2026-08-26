import { useLogoutMutation } from "../../api/auth/authApi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearToken } from "../../api/auth/authSlice";
import { Link } from "react-router";

const Header: React.FC = () => {
  const isAuth = useAppSelector((state) => state.auth.token);
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await logout().unwrap(); // виклик бекенду
    } catch (error) {
      console.error("Помилка при логауті:", error);
    } finally {
      dispatch(clearToken()); // очищаємо токен у Redux
    }
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">🎓 <span className="logo-text">EduHub</span></Link>
        </div>

        <nav className="main-nav">
          { isAuth ? (
            <>
              <Link to="/courses" className="nav-link">Курси</Link>
              <Link to="/profile" className="nav-link">Профіль</Link>
              <button onClick={handleLogout} className="btn-nav btn-logout">
                Вийти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-nav btn-login">Вхід</Link>
              <Link to="/register" className="btn-nav btn-register">Реєстрація</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header
