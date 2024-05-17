import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";

export function UserSignInPage() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        setForm((previousForm) => {
            return {
                ...previousForm,
                [name]: value,
            };
        });
    };

    const onClickLogin = () => {
        const login = {
            email: form.email,
            password: form.password,
        };

        axios
            .post("http://localhost:8025/login", login)
            .then((response) => {
                console.log(response.data.message);
            })
            .catch((error) => {
                console.log(error);
            });
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
                            <label htmlFor="email">E-mail:</label>
                            <input type="text" name="email" placeholder="Informe seu usuário" className="form-control" value={form.email} onChange={onChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password">Senha:</label>
                            <input type="password" name="password" placeholder="******" className="form-control" value={form.password} onChange={onChange} />
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