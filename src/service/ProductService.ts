import { IProduct } from "@/commons/interface";
import { api } from "@/lib/axios";

const productURL = "/products";

const save = async (product: IProduct): Promise<any> => {
  let response;
  try {
    response = await api.post(productURL, product);
  } catch (err: any) {
    response = err.response;
  }
  return response;
};

const findAll = async (): Promise<any> => {
  let response;
  try {
    response = await api.get(productURL);
  } catch (err: any) {
    response = err.response;
  }
  return response;
};

const findOne = async (id: number): Promise<any> => {
  let response;
  try {
    response = await api.get(`${productURL}/${id}`);
  } catch (err: any) {
    response = err.response;
  }
  return response;
};

const remove = async (id: number): Promise<any> => {
  let response;
  try {
    response = await api.delete(`${productURL}/${id}`);
  } catch (err: any) {
    response = err.response;
  }
  return response;
};

const findByCategory = async (categoryId: number): Promise<any> => {
  let response;
  try {
    response = await api.get(`${productURL}/category/${categoryId}`);
  } catch (err: any) {
    response = err.response;
  }
  return response;
}

const addToCart = (product: IProduct) => {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  // Verifica se o produto já está no carrinho
  const existingProduct = cart.find((item: any) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};


const ProductService = {
  save,
  findAll,
  findOne,
  remove,
  findByCategory,
  addToCart,
};

export default ProductService;