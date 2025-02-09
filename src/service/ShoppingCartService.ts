import { ICartItem, IShoppingCart, IShoppingCartProduct } from "@/commons/interface";
import { api } from "@/lib/axios";

const shoppingCartURL = "/shopping-cart";

const finalizePurchase = async (cartItems: ICartItem[]): Promise<any> => {
  const dateTime = new Date().toISOString(); // Data e hora atual em formato ISO 8601
  const payment = "APPROVED";
  const totalPurchase = 0.0; 

  const shoppingCartProducts: IShoppingCartProduct[] = cartItems.map((item) => ({
    productId: item.id,
    quantity: item.quantity,
    finalPrice: item.price - item.price * item.discount,
  }));

  const shoppingCart: IShoppingCart = {
    dateTime,
    payment,
    totalPurchase,
    shoppingCartProducts,
  };

  let response;
  try {
    response = await api.post(shoppingCartURL, shoppingCart);
  } catch (err: any) {
    response = err.response;
  }
  return response;
};

const getOrders = async (): Promise<IShoppingCart[]> => {
  let response;
  try {
    response = await api.get(shoppingCartURL);
    return response.data;
  } catch (err: any) {
    response = err.response;
    return [];
  }
};

const ShoppingCartService = {
  finalizePurchase,
  getOrders,
};

export default ShoppingCartService;