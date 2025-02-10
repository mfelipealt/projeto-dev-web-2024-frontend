import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "@/service/AuthService";
import { IUserSignup } from "@/commons/interface";
import { Input } from "@/components/input";
import backgroundImage from "@/assets/signup-background.jpg";
import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react";

export function UserSignupPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        phone: "",
        cpf: "",
        birthDate: "",
        gender: ""
    });
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        phone: "",
        cpf: "",
        birthDate: "",
        gender: ""
    });
    const navigate = useNavigate();
    const [pendingApiCall, setPendingApiCall] = useState(false);
    const [apiError, setApiError] = useState("");
    const [apiSuccess, setApiSuccess] = useState("");

    const onChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { value, name } = event.target;
        setForm((previousForm) => {
            return {
                ...previousForm,
                [name]: value,
            };
        });
    };

    const onClickSignup = async () => {
        setPendingApiCall(true);

        const user: IUserSignup = {
            name: form.name,
            email: form.email,
            password: form.password,
            passwordConfirm: form.passwordConfirm,
            phone: form.phone,
            cpf: form.cpf,
            birthDate: form.birthDate,
            gender: form.gender
        };

        const response = await AuthService.signup(user);
        if (response.status === 200 || response.status === 201) {
            setApiSuccess("Cadastro realizado com sucesso!");
            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } else {
            setApiError("Erro ao cadastrar o usuário!");
            if (response.data.validationErrors) {
                setErrors(response.data.validationErrors);
            }
            setTimeout(() => {
                setApiError("");
            }, 3000);
        }

        setPendingApiCall(false);
    };

    return (
        <>
            
            <div className="container-fluid vh-100 d-flex justify-content-center align-items-center"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    overflow: "hidden"
                }}
            >
                <div className="card col-md-7" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
                    <div className="container">
                        <h1 className="text-center mt-2 text-white">Cadastro</h1>
                    </div>
                    <div className="container">
                        <div className="row mb-3">
                            <div className="col-6">
                                <div className="mb-1">
                                    <Input id="name" name="name" className="form-control" label="Nome:" labelClassName="text-white" type="text" value={form.name}
                                        placeholder="Informe seu nome" hasError={!!errors.name} error={errors.name} onChange={onChange} />
                                </div>
                                <div className="mb-1">
                                    <Input id="email" name="email" className="form-control" label="E-mail:" labelClassName="text-white" type="text" value={form.email}
                                        placeholder="Informe seu e-mail" hasError={!!errors.email} error={errors.email} onChange={onChange} />
                                </div>
                                <div className="mb-1">
                                    <Input id="password" name="password" className="form-control" label="Senha:" labelClassName="text-white" type="password" value={form.password}
                                        placeholder="******" hasError={!!errors.password} error={errors.password} onChange={onChange} />
                                </div>
                                <div className="mb-1">
                                    <Input id="passwordConfirm" name="passwordConfirm" className="form-control" label="Confirme sua senha:" labelClassName="text-white" type="password" value={form.passwordConfirm}
                                        placeholder="******" hasError={!!errors.passwordConfirm} error={errors.passwordConfirm} onChange={onChange} />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="mb-1">
                                    <Input id="cpf" name="cpf" className="form-control" label="CPF:" labelClassName="text-white" type="text" value={form.cpf}
                                        placeholder="Informe seu CPF" hasError={!!errors.cpf} error={errors.cpf} onChange={onChange} />
                                </div>
                                <div className="mb-1">
                                    <Input id="phone" name="phone" className="form-control" label="Telefone:" labelClassName="text-white" type="number" value={form.phone}
                                        placeholder="(99) 99999-9999" hasError={!!errors.phone} error={errors.phone} onChange={onChange} />
                                </div>


                                <div className="mb-1">
                                    <label htmlFor="gender" className="text-white">Gênero:</label>
                                    <select
                                        name="gender"
                                        className={`form-control ${errors.gender ? "is-invalid" : ""}`}
                                        value={form.gender}
                                        onChange={onChange}
                                    >
                                        <option value="">Selecione</option>
                                        <option value="male">Masculino</option>
                                        <option value="female">Feminino</option>
                                        <option value="other">Outro</option>
                                    </select>
                                    {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                                </div>

                                <div className="mb-1">
                                    <Input id="birthDate" name="birthDate" className="form-control" label="Data de nascimento:" labelClassName="text-white" type="date" value={form.birthDate}
                                        placeholder="" hasError={!!errors.birthDate} error={errors.birthDate} onChange={onChange} />
                                </div>
                            </div>
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
                    {apiSuccess && (
                        <div className="alert alert-success text-center" style={{ width: "80%", margin: "20px auto" }}>
                        <Alert status='success' flexDirection='column'>
                        <AlertIcon boxSize='40px'/>
                        <AlertDescription  maxWidth='sm' mt={4}>{apiSuccess}</AlertDescription>
                        </Alert>
                        </div>
                    )}
                    <div className="row mb-3">
                        <div className="text-center">
                            <button
                                disabled={pendingApiCall}
                                className="btn btn-primary"
                                onClick={onClickSignup}
                            >
                                {pendingApiCall && (
                                    <div
                                        className="spinner-border spinner-border-sm text-light-spinner mr-sm-1"
                                        role="status"
                                    ></div>
                                )}
                                Cadastrar
                            </button>
                        </div>
                        <div className="text-center">
                            <Link to="/login" color="white">Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}