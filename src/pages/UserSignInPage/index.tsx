import { ChangeEvent, useState } from "react";
import AuthService from "@/service/AuthService";
import { Link, useNavigate } from "react-router-dom";
import { IUserLogin } from "@/commons/interface";
import { Input } from "@/components/input";
import backgroundImage from "@/assets/signin-background.jpg";
import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react";

export function UserSignInPage() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();
    const [pendingApiCall, setPendingApiCall] = useState(false);
    const [apiError, setApiError] = useState("");

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
            const redirectUrl = localStorage.getItem("redirectAfterLogin");
            if (redirectUrl) {
                localStorage.removeItem("redirectAfterLogin");
                navigate(redirectUrl);
                window.location.reload();
            }
            else {
                navigate("/home");
                window.location.reload();
            }
        } else {
            setApiError(
                "Falha ao autenticar no sistema, verifique os dados informados"
            );
            setTimeout(() => {
                setApiError("");
            }, 3000);
            setPendingApiCall(false);
        }
    };

    return (
        <>
            <div className="container-fluid vh-100 d-flex justify-content-center align-items-center"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >                
            <div className="card col-md-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>

                    <div className="container">
                        <h1 className="text-center mt-2 text-white">Login</h1>
                    </div>
                    <div className="container">
                        <div className="mb-3">
                            <Input id="email" name="email" className="form-control" label="Email:" labelClassName="text-white" type="text" value={form.email}
                                placeholder="Informe seu nome" hasError={false} error="" onChange={onChange} />
                        </div>
                        <div className="mb-3">
                            <Input id="password" name="password" className="form-control" label="Senha:" labelClassName="text-white" type="password" value={form.password}
                                placeholder="*******" hasError={false} error="" onChange={onChange} />
                        </div>
                    </div>
                    {apiError && (
                        <div className="alert alert-danger text-center" style={{ width: "80%", margin: "20px auto" }}>
                            <Alert status='error' flexDirection='column'>
                            <AlertIcon boxSize='40px'/>
                            <AlertDescription  maxWidth='sm' mt={4}>{apiError}</AlertDescription>
                            </Alert>
                        </div>
                    )}
                    <div>
                        <div className="container text-center">
                            <button className="btn btn-primary mb-2" onClick={onClickLogin}>Login</button>
                        </div>
                        <div className="container text-center mb-2">
                            <Link to="/cadastrar" color="white">Cadastrar-se</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}