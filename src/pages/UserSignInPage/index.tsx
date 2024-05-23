import React, { ChangeEvent, useState } from "react";
import AuthService from "@/service/AuthService";
import { Link, useNavigate } from "react-router-dom";
import { IUserLogin } from "@/commons/interface";
import { Input } from "@/components/input";

export function UserSignInPage() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();
    const [pendingApiCall, setPendingApiCall] = useState(false);
    const [apiError, setApiError] = useState("");
    const [apiSuccess, setApiSuccess] = useState("");

    const { login } = AuthService;

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        setForm((previousForm) => {
            return {
                ...previousForm,
                [name]: value,
            };
        });
    };

    const onClickLogin = async () => {
        setPendingApiCall(true);
    
        const userLogin: IUserLogin = {
          email: form.email,
          password: form.password,
        };
        const response = await login(userLogin);
        if (response.status === 200) {
          setPendingApiCall(false);
          navigate("/home");
        } else {
          setApiError(
            "Falha ao autenticar no sistema, verifique os dados informados"
          );
          setPendingApiCall(false);
        }
      };

    return (
        <>
            <div className="container-fluid vh-100 bg-primary-subtle d-flex justify-content-center align-items-center">
                <div className='card bg-warning col-md-4'>
                    <div className="container">
                        <h1 className="text-center">Login</h1>
                    </div>
                    <div className="container">
                        <div className="mb-3">
                            <Input id="email" name="email" className="form-control" label="Email:" type="text" value={form.email}
                                    placeholder="Informe seu nome" hasError={false} error="" onChange={onChange} />
                        </div>
                        <div className="mb-3">
                            <Input id="password" name="password" className="form-control" label="Senha:" type="password" value={form.password}
                                    placeholder="*******" hasError={false} error="" onChange={onChange} />    
                        </div>
                    </div>
                    <div>
                        <div className="container text-center">
                            <button className="btn btn-primary mb-2" onClick={onClickLogin}>Login</button>
                        </div>
                        <div className="container text-center mb-2">
                            <Link to="/cadastrar">Cadastrar-se</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}