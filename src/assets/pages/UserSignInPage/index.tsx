import axios from 'axios'
import { ChangeEvent, useState} from "react";

export function UserSignInPage() {

    const [form, setForm] = useState({
        name: '',
        username: '',
        password: '',
    })

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {value, name} = event.target;
        setForm((previousForm) => {
            return {
                ...previousForm,
                [name]: value,
            }    
        })
    }

    const onClickSignup = () => {
        const user = {
            name: form.name,
            username: form.username,
            password: form.password
        }
        axios.post('http://localhost:8025/login', user).then((response) => {
            console.log(response.data.message)
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <>
            <div className="container">
                <h1 className="text-center">Sign In - {form.name} - {form.username}</h1>
                <div className="col-12 mb-3">
                    <label htmlFor="name">Informe seu nome:</label>
                    <input type="text" name="name" placeholder="Informe seu nome" className="form-control" value={form.name} onChange={onChange}/>
                </div>
                <div className="col-12 mb-3">
                    <label htmlFor="username">Informe seu usuário:</label>
                    <input type="text" name="username" placeholder="Informe seu usuário" className="form-control" value={form.username} onChange={onChange}/>
                </div>
                <div className="col-12 mb-3">
                    <label htmlFor="password">Informe sua senha:</label>
                    <input type="password" name="password" placeholder="******" className="form-control" value={form.password} onChange={onChange}/>
                </div>
                <div className="text-center">
                    <button className="btn btn-primary" onClick={onClickSignup}>Cadastrar</button>
                </div>
            </div>
        </>
    )
}