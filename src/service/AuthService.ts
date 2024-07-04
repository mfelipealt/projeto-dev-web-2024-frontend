import { api } from "@/lib/axios";
import { IUserLogin, IUserSignup } from "@/commons/interface";

const signup = async (user: IUserSignup): Promise<any> => {
    let response;
    try {
        response = await api.post('/users', user);
    } catch (error: any) {
        response = error.response;
    }
    return response;
}

const login = async (user: IUserLogin) => {
    let response;
    try {
      response = await api.post("/login", user);
      if (response.status === 200) {
        localStorage.setItem("token", JSON.stringify(response.data.token));
        api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      }
    } catch (err: any) {
      response = err.response;
    }
    return response;
};

const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${JSON.parse(token)}`;
    }
    return token ? true : false;
};

const logout = () => {
    localStorage.removeItem("token");
    api.defaults.headers.common["Authorization"] = "";
  };

const AuthService = {
    signup,
    login,
    isAuthenticated,
    logout,
};

export default AuthService;