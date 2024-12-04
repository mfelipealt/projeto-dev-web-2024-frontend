
export interface IUserSignup {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    birthDate: string;
    gender: string;
    cpf: string;
    phone: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}

export interface ICategory {
    id?: number;
    name: string;
    type: string;
}

export interface IProduct {
    id?: number;
    name: string;
    description: string;
    price: number;
    discount: number;
    category: ICategory;
  }