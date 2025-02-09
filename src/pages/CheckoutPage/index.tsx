import { Box, Flex, Image, Stack, Text, Button, Divider, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import AuthService from "@/service/AuthService";
import ProductService from "@/service/ProductService";
import logo from "@/assets/utfpr-logo.png"; // Importe a logo
import { useNavigate } from "react-router-dom";
import ShoppingCartService from "@/service/ShoppingCartService";
import { ICartItem } from "@/commons/interface";

export function CheckoutPage() {
    const [user, setUser] = useState<any>(null);
    const [address, setAddress] = useState<any>(null);
    const [cartItems, setCartItems] = useState<ICartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento
    const navigate = useNavigate();
    const { finalizePurchase } = ShoppingCartService;
  
    useEffect(() => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(cart);
  
      const loadUserData = async () => {
        setIsLoading(true); // Define o carregamento como true antes de buscar os dados
        if (AuthService.isAuthenticated()) {
          const userData = await AuthService.getCurrentUser();
          if (userData) {
            setUser(userData);
            if (userData.addresses && userData.addresses.length > 0) {
              setAddress(userData.addresses[0]);
            }
          }
        } else {
          navigate("/login", { state: { from: "/checkout" } }); // Passa a rota atual para redirecionar após o login
        }
        setIsLoading(false); // Define o carregamento como false após buscar os dados
      };
  
      loadUserData();
    }, []);
  
    const handleFinalize = async () => {
        try {
          const response = await finalizePurchase(cartItems);
          if (response.status === 201) {
          localStorage.removeItem("cart");
          alert("Compra finalizada com sucesso!");
          navigate("/home");
        } else {
          console.error("Erro na requisição:", response);
          const errorMessage = response?.data?.message || "Erro ao finalizar a compra. Tente novamente.";
          alert(errorMessage); // Exibe mensagem de erro do backend
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Ocorreu um erro ao finalizar a compra. Tente novamente mais tarde.");
      }
    };
  
    if (isLoading) {
      return (
        <Flex justify="center" alignItems="center" h="100vh"> {/* Centraliza o Spinner */}
          <Spinner size="lg" /> {/* Exibe um Spinner enquanto carrega */}
        </Flex>
      );
    }
  
    if (!user || !address) {
      return <div>Nenhum endereço cadastrado. Cadastre um endereço para continuar.</div>;
    }

    return (
        <Box p={4}>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
                Finalizar Compra
            </Text>

            {/* Confirmação de Endereço */}
            <Box borderWidth="1px" borderRadius="md" p={4} mb={4}>
                <Text fontWeight="bold">Endereço de Entrega:</Text>
                <Text>{address.street}, {address.number} {address.complement ? ` - ${address.complement}` : ""}</Text>
                <Text>{address.district}, {address.city} - {address.state}</Text>
                <Text>CEP: {address.cep}</Text>
            </Box>

            {/* Itens Comprados */}
            <Box borderWidth="1px" borderRadius="md" p={4} mb={4}>
                <Text fontWeight="bold">Itens Comprados:</Text>
                <Stack spacing={3}>
                    {cartItems.map((item) => (
                        <Flex key={item.id} align="center">
                            <Image src={logo} boxSize="50px" mr={3} />
                            <Box flex="1">
                                <Text fontWeight="bold">{item.name}</Text>
                                <Text color="gray.500" textDecoration="line-through">
                                    Valor: R$ {item.price.toFixed(2)}
                                </Text>
                                <Text>
                                    Valor c/ desconto: R$ {(item.price - item.price * item.discount).toFixed(2)}
                                </Text>
                                <Text fontWeight="bold">
                                    Total: R$ {((item.price - item.price * item.discount) * item.quantity).toFixed(2)}
                                </Text>
                            </Box>
                        </Flex>
                    ))}
                </Stack>
            </Box>

            {/* Botão Finalizar Compra */}
            <Button colorScheme="blue" width="full" onClick={handleFinalize} disabled={cartItems.length === 0}>
                Finalizar Compra
            </Button>
        </Box>
    );
}