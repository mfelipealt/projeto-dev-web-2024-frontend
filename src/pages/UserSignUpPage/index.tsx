import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "@/service/AuthService";
import { IUserSignup } from "@/commons/interface";
import { Input } from "@/components/input";

export function UserSignupPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        phone: "",
        cpf: "",
        birthDate: "",
        cep: "",
        country: "",
        state: "",
        city: "",
        district: "",
        street: "",
        number: "",
        reference: "",
        gender: "",
    });
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        phone: "",
        cpf: "",
        birthDate: "",
        cep: "",
        country: "",
        state: "",
        city: "",
        district: "",
        street: "",
        number: "",
        reference: "",
        gender: "",
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
            cep: form.cep,
            country: form.country,
            state: form.state,
            city: form.city,
            district: form.district,
            street: form.street,
            number: form.number,
            reference: form.reference,
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
        }

        setPendingApiCall(false);
    };

    return (
        <>
            <div className="container">
                <div className="">
                    <h1 className="text-center">
                        Cadastro
                    </h1>
                    <div className="row mb-3">
                        <div className="col-6">
                            <div className="mb-1">
                                <Input id="name" name="name" className="form-control" label="Nome:" type="text" value={form.name}
                                    placeholder="Informe seu nome" hasError={!!errors.name} error={errors.name} onChange={onChange} />
                            </div>
                            <div className="mb-1">
                                <Input id="email" name="email" className="form-control" label="E-mail:" type="text" value={form.email}
                                    placeholder="Informe seu e-mail" hasError={!!errors.email} error={errors.email} onChange={onChange} />
                            </div>
                            <div className="mb-1">
                                <Input id="password" name="password" className="form-control" label="Senha:" type="password" value={form.password}
                                    placeholder="******" hasError={!!errors.password} error={errors.password} onChange={onChange} />
                            </div>
                            <div className="mb-1">
                                <Input id="passwordConfirm" name="passwordConfirm" className="form-control" label="Confirme sua senha:" type="password" value={form.passwordConfirm}
                                    placeholder="******" hasError={!!errors.passwordConfirm} error={errors.passwordConfirm} onChange={onChange} />
                            </div>
                            <div className="mb-1">
                                <Input id="cpf" name="cpf" className="form-control" label="CPF:" type="text" value={form.cpf}
                                    placeholder="Informe seu CPF" hasError={!!errors.cpf} error={errors.cpf} onChange={onChange} />
                            </div>
                            <div className="mb-1">
                                <Input id="phone" name="phone" className="form-control" label="Telefone:" type="number" value={form.phone}
                                    placeholder="(99) 99999-9999" hasError={!!errors.phone} error={errors.phone} onChange={onChange} />
                            </div>
                            <div className="mb-1">
                                <label htmlFor="gender">Gênero:</label>
                                <select
                                    name="gender"
                                    className="form-control"
                                    value={form.gender}
                                    onChange={onChange}
                                >
                                    <option value="">Selecione</option>
                                    <option value="male">Masculino</option>
                                    <option value="female">Feminino</option>
                                    <option value="other">Outro</option>
                                </select>
                            </div>

                            <div className="mb-1">
                                <Input id="birthDate" name="birthDate" className="form-control" label="Data de nascimento:" type="date" value={form.birthDate}
                                    placeholder="" hasError={!!errors.birthDate} error={errors.birthDate} onChange={onChange} />
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="mb-1">
                                <Input id="cep" name="cep" className="form-control" label="CEP:" type="text" value={form.cep}
                                    placeholder="Informe o CEP" hasError={!!errors.cep} error={errors.cep} onChange={onChange} />
                            </div>
                            <div className="mb-1">
                                <Input id="country" name="country" className="form-control" label="País:" type="text" value={form.country}
                                    placeholder="Informe seu país" hasError={!!errors.country} error={errors.country} onChange={onChange} />
                            </div>
                            <div className="mb-1">
                                <Input id="state" name="state" className="form-control" label="Estado:" type="text" value={form.state}
                                    placeholder="Informe seu estado" hasError={!!errors.state} error={errors.state} onChange={onChange} />
                            </div>
                            <div className="mb-1">
                                <Input id="city" name="city" className="form-control" label="Cidade:" type="text" value={form.city}
                                    placeholder="Informe sua cidade" hasError={!!errors.city} error={errors.city} onChange={onChange} />
                            </div>
                            <div className="mb-1">
                                <Input id="district" name="district" className="form-control" label="Bairro:" type="text" value={form.district}
                                    placeholder="Informe seu bairro" hasError={!!errors.district} error={errors.district} onChange={onChange} />
                            </div>
                            <div className="mb-1">
                                <Input id="street" name="street" className="form-control" label="Rua:" type="text" value={form.street}
                                    placeholder="Informe sua rua" hasError={!!errors.street} error={errors.street} onChange={onChange} />
                            </div>
                            <div className="mb-1">
                                <Input id="number" name="number" className="form-control" label="Número:" type="number" value={form.number}
                                    placeholder="Informe o número" hasError={!!errors.number} error={errors.number} onChange={onChange} />
                            </div>
                            <div className="mb-1">
                                <Input id="reference" name="reference" className="form-control" label="Referência:" type="reference" value={form.reference}
                                    placeholder="Informe a referência" hasError={!!errors.reference} error={errors.reference} onChange={onChange} />
                            </div>
                        </div>
                    </div>
                    {apiError && (
                        <div className="alert alert-danger text-center">{apiError}</div>
                    )}
                    {apiSuccess && (
                        <div className="alert alert-success text-center">{apiSuccess}</div>
                    )}
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
                        <Link to="/login">Login</Link>
                    </div>
                </div>
            </div>
        </>
    );
}