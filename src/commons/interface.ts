
export interface IUserSignup {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    birthDate: string;
    gender: string;
    cpf: string;
    phone: string;
    cep: string;
    country: string;
    state: string;
    city: string;
    district: string;
    street: string;
    number: string;
    reference: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}

export interface ICategory {
    id: number;
    name: string;
    type: string;
}   