import {
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  Button, Stack, Text, Box, useToast,
  AlertDialog, AlertDialogContent, AlertDialogOverlay, AlertDialogHeader,
  AlertDialogBody, AlertDialogFooter, useDisclosure, DrawerFooter,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "@/service/AuthService";
import { ICartItem, IProduct } from "@/commons/interface";
import ProductService from "@/service/ProductService";
import ProductShoppingCart from "../ProductShoppingCart";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [productDetails, setProductDetails] = useState<Record<number, IProduct>>({});
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]") as ICartItem[];
    setCartItems(cart);
  }, [isOpen]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const details: Record<number, IProduct> = {};
      const requests = cartItems.map(async (item) => {
        try {
          const product = await ProductService.findOne(item.id);
          if (product?.data) {
            details[item.id] = product.data;
          }
        } catch (error) {
          console.error(`Erro ao buscar produto ${item.id}:`, error);
        }
      });

      await Promise.all(requests);
      setProductDetails(details);
    };

    if (cartItems.length > 0) {
      fetchProductDetails();
    }
  }, [cartItems]);

  const removeFromCart = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalSemDesconto = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const subtotalComDesconto = cartItems.reduce(
    (acc, item) => acc + (item.price - item.price * item.discount) * item.quantity, 0
  );

  const handleFinalizePurchase = () => {
    if (!AuthService.isAuthenticated()) {
      toast({
        title: "Você precisa estar logado para finalizar a compra.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      onClose();
      localStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/login");
      return;
    }
    onClose();
    navigate("/checkout");
  };

  const confirmClearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    toast({
      title: "Carrinho limpo com sucesso!",
      status: "success",
      duration: 2500,
      isClosable: true,
      position: "bottom",
    });
    onAlertClose();
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Meu Carrinho</DrawerHeader>
        <DrawerBody>
          {cartItems.length === 0 ? (
            <Text>Carrinho vazio</Text>
          ) : (
            <Stack spacing={3}>
              {cartItems.map((item) => (
                <ProductShoppingCart
                  key={item.id}
                  item={item}
                  product={productDetails[item.id]}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </Stack>
          )}
        </DrawerBody>
        {cartItems.length > 0 && (
          <DrawerFooter>
            <Stack spacing={3} width="full">
              <Box mt={4} p={3} borderWidth="1px" borderRadius="md">
                <Text fontWeight="bold" as="s">
                  Total sem desconto: R$ {totalSemDesconto.toFixed(2)}
                </Text>
                <Text fontWeight="bold" color="green.500">
                  Subtotal com desconto: R$ {subtotalComDesconto.toFixed(2)}
                </Text>
              </Box>
              <Button colorScheme="red" width="full" mt={1} onClick={onAlertOpen}>
                Limpar Carrinho
              </Button>

              <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={onAlertClose}>
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader textAlign="center">Limpar Carrinho?</AlertDialogHeader>
                    <AlertDialogBody textAlign="center">
                      Você tem certeza que quer limpar o carrinho? <br />
                      Essa ação irá remover todos os itens do carrinho.
                    </AlertDialogBody>
                    <AlertDialogFooter justifyContent="center">
                      <Button onClick={confirmClearCart}>Continuar</Button>
                      <Button colorScheme="red" ref={cancelRef} onClick={onAlertClose}>
                        Cancelar
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>

              <Button colorScheme="blue" width="full" mt={1} mb={2} onClick={handleFinalizePurchase}>
                Finalizar Compra
              </Button>
            </Stack>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}