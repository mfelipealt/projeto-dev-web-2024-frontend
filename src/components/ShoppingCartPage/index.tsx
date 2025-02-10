import {
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  Button, Image, Stack, Text, Box, Flex, IconButton, useToast,
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  DrawerFooter,
} from "@chakra-ui/react";
import logo from "@/assets/utfpr-logo.png";
import { useState, useEffect, useRef } from "react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from "react-router-dom";
import AuthService from "@/service/AuthService";
import { ICartItem, IProduct } from "@/commons/interface";
import ProductService from "@/service/ProductService";

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {

  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [productDetails, setProductDetails] = useState<Record<number, IProduct>>({}); // Use IProduct aqui
  const { findOne } = ProductService; // Supondo que você tenha um método findOne no seu serviço

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  }, [isOpen]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const details: Record<number, IProduct> = {}; // Tipo definido aqui
      for (const item of cartItems) {
        try {
          const product = await findOne(item.id);
          if (product && product.data) {
            details[item.id] = product.data;
          } else {
            console.error("Produto não encontrado:", item.id);
          }
        } catch (error) {
          console.error("Erro ao buscar produto:", error);
        }
      }
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
    if (newQuantity < 1) return; // Impede que a quantidade seja menor que 1
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalSemDesconto = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const subtotalComDesconto = cartItems.reduce((acc, item) => acc + (item.price - (item.price * item.discount)) * item.quantity, 0);

  const handleFinalizePurchase = async () => {
    if (!AuthService.isAuthenticated()) {
      toast({
        title: "Você precisa estar logado para finalizar a compra.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom"
      });
      onClose();
      localStorage.setItem('redirectAfterLogin', '/checkout');
      navigate("/login");
      return;
    }
    onClose();
    navigate("/checkout");
  };

  const clearCart = () => {
    onAlertOpen();
  };

  const confirmClearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    toast({
      title: "Carrinho limpo com sucesso!",
      status: "success",
      duration: 2500,
      isClosable: true,
      position: "bottom"
    });
    onAlertClose(); // Fecha o AlertDialog após a confirmação
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
              {cartItems.map((item) => {
                const product = productDetails[item.id]; // Agora é do tipo IProduct

                return (
                  <Box key={item.id} p={3} borderWidth="1px" borderRadius="md">
                    <Flex align="center">
                      <Image
                        src={product?.imageName ? product.imageName : logo} // Use product.imageName
                        boxSize="50px"
                        mr={3}
                        alt={item.name}
                      />
                      <Box flex="1">
                        <Stack spacing={1}>
                          <Text fontWeight="bold">{item.name}</Text>
                          <Text as="s" color="gray.500">
                            Valor: R$ {item.price.toFixed(2)}
                          </Text>
                          <Text>
                            Valor c/ desconto: R$ {(item.price - item.price * item.discount).toFixed(2)}
                          </Text>
                          <Text fontWeight="bold">
                            Total: R$ {((item.price - item.price * item.discount) * item.quantity).toFixed(2)}
                          </Text>
                        </Stack>
                      </Box>
                      <Flex align="center" mr={3}>
                      <IconButton
                        icon={<RemoveIcon />}
                        aria-label="Decrementar"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        isDisabled={item.quantity <= 1}
                      />
                      <Text mx={2} mt={3}>{item.quantity}</Text>
                      <IconButton
                        icon={<AddIcon />}
                        aria-label="Incrementar"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      />
                    </Flex>
                    <IconButton
                      icon={<DeleteForeverIcon />}
                      aria-label="Remover item"
                      style={{ color: "red" }}
                      onClick={() => removeFromCart(item.id)}
                    />
                  </Flex>
                  </Box>
                );
              })}
            </Stack>
          )}

        </DrawerBody>
        {cartItems.length > 0 ? (
          <DrawerFooter>
            <Stack spacing={3} width="full">

              <Box mt={4} p={3} borderWidth="1px" borderRadius="md">
                <Text fontWeight="bold" width="full" as="s">Total sem desconto: R$ {totalSemDesconto.toFixed(2)}</Text>
                <Text fontWeight="bold" width="full" color="green.500" >Subtotal com desconto: R$ {subtotalComDesconto.toFixed(2)}</Text>
              </Box>
              <Button
                colorScheme="red"
                width="full"
                mt={1}
                onClick={clearCart}
              >
                Limpar Carrinho
              </Button>

              <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={onAlertClose}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader textAlign="center">Limpar Carrinho?</AlertDialogHeader>
                    <AlertDialogBody textAlign="center">
                      Você tem certeza que quer Limpar o Carrinho? <br />
                      Essa ação irá remover todos os itens do carrinho.
                    </AlertDialogBody>
                    <AlertDialogFooter justifyContent="center">
                      <Button mr={3} onClick={confirmClearCart}>
                        Continuar
                      </Button>
                      <Button colorScheme="red" ref={cancelRef} onClick={onAlertClose}>
                        Cancelar
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>


              <Button
                colorScheme="blue"
                width="full"
                mt={1}
                mb={2}
                onClick={handleFinalizePurchase}
              >
                Finalizar Compra
              </Button>
            </Stack>
          </DrawerFooter>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}
