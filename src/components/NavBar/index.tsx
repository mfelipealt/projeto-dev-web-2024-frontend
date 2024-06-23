
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import AuthService from "@/service/AuthService";
import "./index.css"
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export function NavBar() {

  const navigate = useNavigate();

  const onClickLogout = () => {
    AuthService.logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ backgroundColor: "rgba(1, 24, 38)" }}>
      <nav className="navbar navbar-expand">
        <div className="col-4 d-flex justify-content-center align-items-center">
          <Link to="/" className="navbar-brand">
            <img src={logo} width="60" />
          </Link>
          <p className="text-white minor">"Peças que aceleram sua paixão. <br />Encontre o melhor para o seu carro!"</p>
        </div>
        <div className="col-4">
          <ul className="navbar-nav justify-content-center align-items-center">
            <li>
              <NavLink
                to="/"
                className={(navData) =>
                  navData.isActive ? "nav-link active" : "nav-link text-white"
                }
                style={{ color: "grey" }}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/categories"
                className={(navData) =>
                  navData.isActive ? "nav-link active" : "nav-link text-white"
                }
                style={{ color: "grey" }}
              >
                Categorias
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className={(navData) =>
                  navData.isActive ? "nav-link active" : "nav-link text-white"
                }
                style={{ color: "grey" }}
              >
                Produtos
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="col-4 d-flex justify-content-center align-items-center text-align-center">
          
          <div className="col-6 justify-content-center align-items-center text-align-center">
            <ul className="navbar-nav  me-auto mb-2 mb-md-0 justify-content-center align-items-center">
              <li className=" minor">
                <NavLink
                  to="/login"
                  className={(navData) =>
                    navData.isActive ? "nav-link active text-white" : "nav-link text-white"
                  }
                >
                  Entrar
                </NavLink>
              </li>
              <li className=" minor">
                <NavLink
                  to=""
                  className={(navData) =>
                    navData.isActive ? "nav-link text-white" : "nav-link text-white"
                  }
                >
                  |
                </NavLink>
              </li>
              <li className=" minor">
                <NavLink
                  to="/cadastrar"
                  className={(navData) =>
                    navData.isActive ? "nav-link active text-white" : "nav-link text-white"
                  }
                >
                  Cadastrar-se
                </NavLink>
              </li>
              {/* <button className="btn btn-light" onClick={onClickLogout}>
                &times; Sair
              </button> */}
            </ul>
          </div>
          <div className="col-4 align-items-center text-align-center">
            <ul className="navbar-nav mb-2 mb-md-0 justify-content-center align-items-center">
              <li className=" col-4">
                <NavLink
                  to="/user"
                  style={{ color: "white" }}
                >
                  <PersonIcon />
                </NavLink>
              </li>
              <li className=" col-4">
                <NavLink
                  to="/user"
                  style={{ color: "white" }}
                >
                  <ShoppingCartIcon />
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
