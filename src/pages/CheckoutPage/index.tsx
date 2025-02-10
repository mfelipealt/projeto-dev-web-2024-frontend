import { Box, Flex, Image, Stack, Text, Button, Spinner, IconButton, useToast, FormControl, FormLabel, Input, InputGroup, InputRightElement, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Icon } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import AuthService from "@/service/AuthService";
import logo from "@/assets/utfpr-logo.png";
import { useNavigate } from "react-router-dom";
import ShoppingCartService from "@/service/ShoppingCartService";
import { ICartItem, IAddress, IProduct } from "@/commons/interface";
import "./index.css";
import AddressService from "@/service/AddressService";
import AddBoxIcon from '@mui/icons-material/AddBox';
import ProductService from "@/service/ProductService";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export function CheckoutPage() {
  const [user, setUser] = useState<any>(null);
  const [address, setAddress] = useState<IAddress | null>(null);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const { finalizePurchase } = ShoppingCartService;
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const { create } = AddressService;
  const [isFetchingCEP, setIsFetchingCEP] = useState(false);
  const [productDetails, setProductDetails] = useState<Record<number, IProduct>>({});
  const { findOne } = ProductService;

  const [newAddress, setNewAddress] = useState<IAddress>({
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: "",
    cep: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // 1. Carregar dados do carrinho
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(cart);

      // 2. Carregar dados do usuário (e endereço)
      if (AuthService.isAuthenticated()) {
        const userData = await AuthService.getCurrentUser();
        if (userData) {
          setUser(userData);
          if (userData.addresses && userData.addresses.length > 0) {
            setAddress(userData.addresses[0]);
          }
        }
      } else {
        navigate("/login", { state: { from: "/checkout" } });
        setIsLoading(false); // Importante: setIsLoading deve ser chamado aqui também
        return; // Sai do useEffect para evitar erros
      }

      // 3. Carregar detalhes dos produtos (NOVO!)
      const fetchProductDetails = async () => {
        const details: Record<number, IProduct> = {};
        for (const item of cart) { // Use a variável 'cart' aqui
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

      if (cart.length > 0) { // Garante que fetchProductDetails só seja chamada se cart não estiver vazio
        fetchProductDetails();
      }

      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleFinalize = async () => {
    if (!address) { // Verifica se o endereço está definido
      toast({
        title: "Cadastre ao menos um endereço para continuar.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom"
      });
      return; // Impede a finalização da compra
    }

    try {
      const response = await finalizePurchase(cartItems);
      if (response.status === 201) {
        localStorage.removeItem("cart");
        alert("Compra finalizada com sucesso!");
        navigate("/home");
      } else {
        console.error("Erro na requisição:", response);
        const errorMessage = response?.data?.message || "Erro ao finalizar a compra. Tente novamente.";
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Ocorreu um erro ao finalizar a compra. Tente novamente mais tarde.");
    }
  };

  const handleAddressClick = (addressItem: IAddress) => { // Tipagem do parâmetro addressItem
    setAddress(addressItem);
  };

  const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");
    setNewAddress((prev) => ({ ...prev, cep }));

    if (cep.length === 8) {
      setIsFetchingCEP(true);
      try {
        const response = await AddressService.getByCEP(cep);
        const addressData = response.data;

        if (addressData && !addressData.erro) {
          setNewAddress((prev) => ({
            ...prev,
            street: addressData.logradouro || "",
            district: addressData.bairro || "",
            city: addressData.localidade || "",
            state: addressData.estado || "",
          }));
          toast({
            description: "CEP encontrado com sucesso.",
            status: "success",
            duration: 2500,
            isClosable: true,
            position: "bottom",
          });
        } else {
          console.error("CEP não encontrado ou erro na API:", addressData);
          toast({
            title: "CEP não encontrado",
            description: "Nenhum endereço encontrado para este CEP.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setNewAddress((prev) => ({ ...prev, street: "", district: "", city: "", state: "" }));
        }
      } catch (error) {
        console.error("Erro ao buscar endereço:", error);
        toast({
          title: "Erro ao buscar CEP",
          description: "Tente novamente mais tarde.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      } finally {
        setIsFetchingCEP(false);
      }
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.cep || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.number) {
      toast({
        title: "Preencha todos os campos obrigatórios.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const response = await create(newAddress);
      if (response.status === 201) {
        setAddresses([...addresses, response.data]);
        setNewAddress({ cep: "", street: "", number: "", complement: "", district: "", city: "", state: "" });
        onClose();
        toast({
          title: "Endereço adicionado com sucesso!",
          status: "success",
          duration: 2500,
          isClosable: true
        });
        window.location.reload();
      } else {
        throw new Error(response?.data?.message || "Erro desconhecido");
      }
    } catch (error) {
      console.error("Erro ao adicionar endereço:", error);
      toast({ title: "Erro ao adicionar endereço", description: "Tente novamente.", status: "error", duration: 5000, isClosable: true });
    }
  };

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

  if (isLoading) {
    return (
      <Flex justify="center" alignItems="center" h="100vh">
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Finalizar Compra
      </Text>

      {/* Confirmação de Endereço (exibe mesmo se address for null) */}
      <Box borderWidth="1px" borderRadius="md" p={4} mb={4}>
        <Text fontWeight="bold">Endereço de Entrega:</Text>
        <Flex direction="row" gap={4} wrap="wrap">
          {user && user.addresses && user.addresses.length > 0 ? (
            user.addresses.map((addressItem: IAddress, index: number) => (
              <Box
                key={index}
                borderWidth="1px"
                borderRadius="md"
                width="fit-content"
                minWidth="400px"
                maxWidth="400px"
                cursor="pointer"
                onClick={() => handleAddressClick(addressItem)}
                className={address === addressItem ? "selected-address" : ""}
              >
                <Flex justify="space-between" align="flex-start" borderRadius="md" p={3} mb={2} wrap="wrap">
                  <Box flex="1" minWidth="150px" mt={3} mr={2}>
                    <Text className="truncate"><strong>Rua:</strong> {addressItem.street}</Text>
                    <Text className="truncate"><strong>Bairro:</strong> {addressItem.district}</Text>
                    <Text className="truncate"><strong>Estado:</strong> {addressItem.state}</Text>
                  </Box>
                  <Box flex="1" minWidth="150px" mt={3}>
                    <Text className="truncate"><strong> N°:</strong> {addressItem.number}</Text>
                    <Text className="truncate"><strong>Cidade:</strong> {addressItem.city}</Text>
                    <Text className="truncate"><strong>CEP:</strong> {addressItem.cep}</Text>
                  </Box>
                </Flex>
              </Box>
            ))
          ) : (
            <Text></Text>
          )}
          <Box
            borderWidth="1px"
            borderRadius="md"
            width="fit-content"
            minWidth="400px"
            maxWidth="400px"
            fontSize="20px"
            cursor="pointer"
            display="flex"
            justifyContent="center"
            alignItems="center"
            onClick={onOpen} // Abre o modal ao clicar
          >
            <Icon as={AddBoxIcon} w={6} h={6} mr={2} />
            <Text mt={3}>Adicionar Endereço</Text>
          </Box>
          {/* Modal para adicionar endereço */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Adicionar Endereço</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Flex wrap="wrap" justify="space-between">
                  <Box flex="1" minWidth="150px" mt={3}>
                    <FormControl px="2">
                      <FormLabel>CEP</FormLabel>
                      <InputGroup>
                        <Input
                          type="text"
                          value={newAddress.cep}
                          onChange={(e) => setNewAddress({ ...newAddress, cep: e.target.value })}
                        />
                        <InputRightElement width="5rem">
                          <Button size="sm" onClick={() => handleCEPChange({ target: { value: newAddress.cep } } as React.ChangeEvent<HTMLInputElement>)}>
                            Buscar
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                    {/* ... other form controls (Rua, Número, Complemento, Bairro, Cidade, Estado) */}
                    <FormControl px="2" mt={3}>
                      <FormLabel>Rua</FormLabel>
                      <Input
                        type="text"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      />
                    </FormControl>
                    <FormControl px="2" mt={3}>
                      <FormLabel>Número</FormLabel>
                      <Input
                        type="text"
                        value={newAddress.number}
                        onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })}
                      />
                    </FormControl>
                    <FormControl px="2" mt={3}>
                      <FormLabel>Complemento</FormLabel>
                      <Input
                        type="text"
                        value={newAddress.complement || ""}
                        onChange={(e) => setNewAddress({ ...newAddress, complement: e.target.value })}
                      />
                    </FormControl>
                    <FormControl px="2" mt={3}>
                      <FormLabel>Bairro</FormLabel>
                      <Input
                        type="text"
                        value={newAddress.district}
                        onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                      />
                    </FormControl>
                    <FormControl px="2" mt={3}>
                      <FormLabel>Cidade</FormLabel>
                      <Input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      />
                    </FormControl>
                    <FormControl px="2" mt={3}>
                      <FormLabel>Estado</FormLabel>
                      <Input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      />
                    </FormControl>
                  </Box>
                </Flex>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleAddAddress}>
                  Salvar
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      </Box>

      {/* Itens Comprados (exibe mesmo se address for null) */}
      <Box borderWidth="1px" borderRadius="md" p={4} mb={4}>
        <Text fontWeight="bold">Itens Comprados:</Text>
        <Flex direction="row" gap={4} wrap="wrap">
          {cartItems.map((item) => {
            const product = productDetails[item.id];

            return (
              <Flex key={item.id} borderWidth="1px"
                borderRadius="md"
                width="fit-content"
                minWidth="435px"
                maxWidth="435px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                cursor="pointer">
                <Box flex="1" display="flex" justifyContent="center" alignItems="center"> {/* Centraliza a imagem */}
                  <Image
                    src={product?.imageName ? product.imageName : logo}
                    boxSize="50px"
                    alt={item.name}
                  />
                </Box>
                <Box flex="2" mt={3}>
                  <Text fontWeight="bold">{item.name}</Text>
                  <Text color="gray.500" textDecoration="line-through">
                    Valor: R$ {item.price.toFixed(2)}
                  </Text>
                  <Text>
                    Valor c/ desc: R${(item.price - item.price * item.discount).toFixed(2)}
                  </Text>
                  <Text fontWeight="bold">
                    Total: R${((item.price - item.price * item.discount) * item.quantity).toFixed(2)}
                  </Text>
                </Box>

                <Flex flex="1" align="center" mr={3}>
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
                  <IconButton
                    icon={<DeleteForeverIcon />}
                    aria-label="Remover item"
                    style={{ color: "red" }}
                    ml={3}
                    onClick={() => removeFromCart(item.id)}
                  />
                </Flex>

              </Flex>
            );
          })}
        </Flex>
      </Box>

      <Button colorScheme="blue" width="full" onClick={handleFinalize} disabled={cartItems.length === 0}>
        Finalizar Compra
      </Button>
    </Box>
  );
}