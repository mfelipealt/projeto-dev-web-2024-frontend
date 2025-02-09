
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

export interface ICartItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    discount: number;
}

export interface IShoppingCartProduct {
    productId: number;
    quantity: number;
}

export interface IShoppingCart {
    dateTime: string;
    payment: string;
    totalPurchase: number;
    products: IShoppingCartProduct[];
}