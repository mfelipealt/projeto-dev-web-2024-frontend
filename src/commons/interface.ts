
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
    id: number;
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
    imageName?: string;
    contentType?: string;
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
    finalPrice: number;
}

export interface IShoppingCart {
    id?: number;
    dateTime: string;
    payment: string;
    totalPurchase: number;
    shoppingCartProducts: IShoppingCartProduct[];
}

export interface IAddress {
    id?: number;
    cep: string;
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
}