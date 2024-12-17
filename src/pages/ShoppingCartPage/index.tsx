// src/context/CartContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import CartService from '@/service/ShoppingCartService';
import { Box, Button, Stack, Text, Image } from '@chakra-ui/react';
import { IProduct } from '@/commons/interface';
import logo from '@/assets/utfpr-logo.png';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(CartService.getCart());

  useEffect(() => {
    const storedCart = CartService.getCart();
    setCart(storedCart);
  }, []);

  const addToCart = (product) => {
    const updatedCart = CartService.addItemToCart(product);
    setCart(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = CartService.removeItemFromCart(productId);
    setCart(updatedCart);
  };

  const clearCart = () => {
    CartService.clearCart();
    setCart(CartService.getCart());
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// src/pages/CartPage.js



export function CartPage() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  return (
    <Box p={5}>
      <Stack spacing={4}>
        {cart.products.length === 0 ? (
          <Text>Seu carrinho está vazio.</Text>
        ) : (
          cart.products.map((product: IProduct) => (
            <Box key={product.id} borderWidth="1px" borderRadius="lg" overflow="hidden">
              <Stack direction="row" p={5}>
                <Image src={logo} alt={product.name} boxSize="100px" objectFit="cover" />
                <Stack flex="1" spacing={2}>
                  <Text fontWeight="bold" fontSize="xl">
                    {product.name}
                  </Text>
                  <Text>{product.description}</Text>
                  <Text fontWeight="bold" fontSize="lg" color="teal.600">
                    R$ {(product.price - product.price * product.discount).toFixed(2)}
                  </Text>
                  <Button variant="solid" colorScheme="red" onClick={() => removeFromCart(product.id)}>
                    Remover
                  </Button>
                </Stack>
              </Stack>
            </Box>
          ))
        )}
        <Button variant="solid" colorScheme="red" onClick={clearCart}>
          Limpar Carrinho
        </Button>
      </Stack>
    </Box>
  );
}
