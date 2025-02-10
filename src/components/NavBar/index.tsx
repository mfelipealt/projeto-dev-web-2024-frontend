import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import AuthService from "@/service/AuthService";
import "./index.css";
import PersonIcon from "@mui/icons-material/Person";
import { useEffect, useState } from "react";
import { CartDrawer } from "@/components/ShoppingCartPage";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated) {
        try {
          const user = await AuthService.getCurrentUser();
          if (user) {
            setUserName(user.name);
            console.log("user.name:" + user.name);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const onClickLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUserName(null);
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ backgroundColor: "rgba(1, 24, 38)" }}>
      <nav className="navbar navbar-expand">
        <div className="col-4 d-flex justify-content-center align-items-center">
          <Link to="/" className="navbar-brand">
            <img src={logo} width="60" />
          </Link>
          <p className="text-white minor">
            "Peças que aceleram sua paixão. <br />
            Encontre o melhor para o seu carro!"
          </p>
        </div>
        <div className="col-4">
          <ul className="navbar-nav justify-content-center align-items-center">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link text-white")} style={{ color: "grey" }}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/categories" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link text-white")} style={{ color: "grey" }}>
                Categorias
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link text-white")} style={{ color: "grey" }}>
                Produtos
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="col-4 d-flex justify-content-center align-items-center text-align-center">
          <div className="col-6 justify-content-center align-items-center text-align-center">
            <ul className="navbar-nav me-auto mb-2 mb-md-0 justify-content-center align-items-center">
              {isAuthenticated ? (
                <>
                  <li>
                    <span className="nav-link text-white truncate">Olá, {userName}!</span>
                  </li>
                  <li className="minor">
                    <span className="nav-link text-white">|</span>
                  </li>
                  <li>
                    <button className="nav-link text-white btn btn-link" onClick={onClickLogout} style={{ textDecoration: "none" }}>
                      Sair
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink to="/login" className="nav-link text-white">
                      Entrar
                    </NavLink>
                  </li>
                  <li className="minor">
                    <span className="nav-link text-white">|</span>
                  </li>
                  <li>
                    <NavLink to="/cadastrar" className="nav-link text-white">
                      Cadastrar-se
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="col-4 align-items-center text-align-center">
            <ul className="navbar-nav mb-2 mb-md-0 justify-content-center align-items-center">
              <li className="col-4">
                <NavLink to="/user" style={{ color: "white" }}>
                  <PersonIcon />
                </NavLink>
              </li>
              <li className="col-4">
                <nav>
                  <NavLink to="#" onClick={() => setIsCartOpen(true)}>
                    <ShoppingCartIcon style={{ color: "white", cursor: "pointer" }} />
                  </NavLink>
                  <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                </nav>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
