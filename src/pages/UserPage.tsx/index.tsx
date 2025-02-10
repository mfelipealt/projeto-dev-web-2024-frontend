import {
    Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
    Box, Flex, Image, Text, Button, Tabs, TabList, TabPanels, Tab, TabPanel, useDisclosure,
    Input, FormControl, FormLabel, useToast, Spinner,
    InputGroup, InputRightElement,
    AlertDialog, AlertDialogContent, AlertDialogOverlay, AlertDialogHeader, AlertDialogBody, AlertDialogFooter,

} from "@chakra-ui/react";
import PersonIcon from "@mui/icons-material/Person";
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useState, useEffect, useRef } from "react";
import AuthService from "@/service/AuthService";
import { useNavigate } from "react-router-dom";
import AddressService from "@/service/AddressService";
import { IAddress, IShoppingCart } from "@/commons/interface";
import "../UserPage.tsx/index.css";
import ShoppingCartService from "@/service/ShoppingCartService";
import "../UserPage.tsx/index.css";
import ProductService from "@/service/ProductService";

export function UserPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [addresses, setAddresses] = useState<IAddress[]>([]);
    const [newAddress, setNewAddress] = useState<IAddress>({
        cep: "",
        street: "",
        number: "",
        complement: "",
        district: "",
        city: "",
        state: "",
    });
    const toast = useToast();
    const { create } = AddressService;
    const formatPhone = (phone: string) => { return phone.replace(/^(\d{2})(\d)(\d{4})(\d{4})$/, "($1) $2 $3-$4"); };
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", });
    };
    const [isFetchingCEP, setIsFetchingCEP] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<IAddress | null>(null);
    const { isOpen: isDeleteAlertOpen, onOpen: onDeleteAlertOpen, onClose: onDeleteAlertClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);
    const [orders, setOrders] = useState<IShoppingCart[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [productDetails, setProductDetails] = useState<{ [productId: number]: any }>({});

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        setIsLoading(true);
        if (AuthService.isAuthenticated()) {
            const userData = await AuthService.getCurrentUser();
            if (userData) {
                setUser(userData);
                setAddresses(userData.addresses || []);
            }
        } else {
            navigate("/login", { state: { from: "/user" } });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        setIsLoadingOrders(true);
        try {
            const fetchedOrders = await ShoppingCartService.getOrders();
            setOrders(fetchedOrders);

            const productDetailPromises = fetchedOrders.flatMap(order =>
                order.shoppingCartProducts.map(async (shoppingCartProduct) => {
                    const details = await ProductService.findOne(shoppingCartProduct.productId);
                    return { [shoppingCartProduct.productId]: details.data };
                })
            );

            const resolvedProductDetails = await Promise.all(productDetailPromises);
            const detailsMap = resolvedProductDetails.reduce((acc, curr) => ({ ...acc, ...curr }), {});
            setProductDetails(detailsMap);

        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
            toast({
                title: "Erro ao buscar pedidos",
                description: "Tente novamente mais tarde.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } finally {
            setIsLoadingOrders(false);
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
                toast({
                    title: "Endereço adicionado com sucesso!",
                    status: "success",
                    duration: 2500,
                    isClosable: true
                });
            } else {
                throw new Error(response?.data?.message || "Erro desconhecido");
            }
        } catch (error) {
            console.error("Erro ao adicionar endereço:", error);
            toast({ title: "Erro ao adicionar endereço", description: "Tente novamente.", status: "error", duration: 5000, isClosable: true });
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    if (!user) {
        return <div>Usuário não encontrado.</div>;
    }

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

    const handleDeleteAddress = (address: IAddress) => {
        setAddressToDelete(address);
        onDeleteAlertOpen();
    };

    const confirmDeleteAddress = async () => {
        if (addressToDelete && addressToDelete.id) {
            try {
                const response = await AddressService.deleteAddress(addressToDelete.id);
                if (response.status === 200 || response.status === 204) {
                    setAddresses(addresses.filter(addr => addr.id !== addressToDelete.id));
                    toast({
                        title: "Endereço removido com sucesso!",
                        status: "success",
                        duration: 2500,
                        isClosable: true,
                        position: "bottom"
                    });
                    onDeleteAlertClose();
                    setAddressToDelete(null);
                } else {
                    throw new Error("Erro ao remover endereço.");
                }
            } catch (error) {
                console.error("Erro ao remover endereço:", error);
                toast({
                    title: "Erro ao remover endereço",
                    description: "Tente novamente mais tarde.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                });
            }
        }
    };

    return (
        <Box p={4}>
            <Flex align="center" mb={4}>
                <PersonIcon sx={{ fontSize: 40 }} />
                <Text mt={4} ml={2} fontSize="2xl" fontWeight="bold">
                    Meu Perfil
                </Text>
            </Flex>

            <Box borderWidth="1px" borderRadius="md" p={4} mb={4}>
                <Flex justify="space-between" align="center">
                    <Box>
                        <Text><strong>Nome:</strong> {user.name}</Text>
                        <Text><strong>E-mail:</strong> {user.email}</Text>
                        <Text><strong>Telefone:</strong> {formatPhone(user.phone)}</Text>
                    </Box>
                    <Box>
                        <Text><strong>CPF:</strong> {user.cpf}</Text>
                        <Text><strong>Data de Nascimento:</strong>  {formatDate(user.birthDate)}</Text>
                        <Text><strong>Gênero:</strong> {user.gender}</Text>
                    </Box>
                    <Button leftIcon={<EditNoteIcon />} size="sm">
                        Editar
                    </Button>
                </Flex>
            </Box>

            <Tabs isFitted defaultIndex={0}>
                <TabList>
                    <Tab>Endereços</Tab>
                    <Tab>Histórico de Pedidos</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Box borderWidth="1px" borderRadius="md" p={4} mb={4}>
                            <Text fontWeight="bold">Endereços Cadastrados:</Text>
                            {addresses.map((address) => (
                                <Flex key={address.id} justify="space-between" align="flex-start"
                                    borderWidth="1px" borderRadius="md" p={3} mb={2} wrap="wrap">
                                    <Box flex="1" minWidth="150px" mt={3} mr={2}>
                                        <Text className="truncate"><strong>Rua:</strong> {address.street} N° {address.number}</Text>
                                        <Text className="truncate"><strong>Complemento:</strong> {address.complement}</Text>
                                    </Box>
                                    <Box flex="1" minWidth="150px" mt={3}>
                                        <Text className="truncate"><strong>Bairro:</strong> {address.district}</Text>
                                        <Text className="truncate"><strong>Cidade:</strong> {address.city}</Text>
                                    </Box>
                                    <Box flex="1" minWidth="150px" mt={3}>
                                        <Text className="truncate"><strong>Estado:</strong> {address.state}</Text>
                                        <Text className="truncate"><strong>CEP:</strong> {address.cep}</Text>
                                    </Box>
                                    <Box mt={3}>
                                        <Button leftIcon={<DeleteForeverIcon />} size="sm" mr={2} aria-label="Remover endereço" colorScheme="red" onClick={() => handleDeleteAddress(address)}>
                                            Remover
                                        </Button>
                                        <Button leftIcon={<EditNoteIcon />} size="sm" mr={2}>
                                            Editar
                                        </Button>
                                        <AlertDialog
                                            isOpen={isDeleteAlertOpen}
                                            leastDestructiveRef={cancelRef}
                                            onClose={onDeleteAlertClose}
                                        >
                                            <AlertDialogOverlay>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader textAlign="center">Remover endereço?</AlertDialogHeader>
                                                    <AlertDialogBody textAlign="center">
                                                        Tem certeza que deseja remover o endereço de {addressToDelete?.street}?
                                                    </AlertDialogBody>
                                                    <AlertDialogFooter justifyContent="center">
                                                        <Button colorScheme="red" onClick={confirmDeleteAddress}>
                                                            Remover
                                                        </Button>
                                                        <Button ml={3} onClick={onDeleteAlertClose}>
                                                            Cancelar
                                                        </Button>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialogOverlay>
                                        </AlertDialog>
                                    </Box>
                                </Flex>
                            ))}
                        </Box>

                        <Accordion allowToggle>
                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box flex="1" textAlign="left">
                                            <Text fontWeight="bold">Adicionar Novo Endereço</Text>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
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
                                            <FormControl px="2">
                                                <FormLabel>Rua</FormLabel>
                                                <Input
                                                    type="text"
                                                    value={newAddress.street}
                                                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                                />
                                            </FormControl>
                                            <FormControl px="2">
                                                <FormLabel>Número</FormLabel>
                                                <Input
                                                    type="text"
                                                    value={newAddress.number}
                                                    onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })}
                                                />
                                            </FormControl>
                                        </Box>

                                        <Box flex="1" minWidth="150px" mt={3}>
                                            <FormControl px="2">
                                                <FormLabel>Complemento</FormLabel>
                                                <Input
                                                    type="text"
                                                    value={newAddress.complement || ""}
                                                    onChange={(e) => setNewAddress({ ...newAddress, complement: e.target.value })}
                                                />
                                            </FormControl>
                                            <FormControl px="2">
                                                <FormLabel>Bairro</FormLabel>
                                                <Input
                                                    type="text"
                                                    value={newAddress.district}
                                                    onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                                                />
                                            </FormControl>
                                        </Box>

                                        <Box flex="1" minWidth="150px" mt={3}>
                                            <FormControl px="2">
                                                <FormLabel>Cidade</FormLabel>
                                                <Input
                                                    type="text"
                                                    value={newAddress.city}
                                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                />
                                            </FormControl>
                                            <FormControl px="2">
                                                <FormLabel>Estado</FormLabel>
                                                <Input
                                                    type="text"
                                                    value={newAddress.state}
                                                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                />
                                            </FormControl>
                                        </Box>
                                    </Flex>
                                    <Button mt={4} colorScheme="blue" onClick={handleAddAddress}>
                                        Adicionar Endereço
                                    </Button>
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    </TabPanel>
                    <TabPanel>
                        {isLoadingOrders ? (
                            <Spinner />
                        ) : orders.length > 0 ? (
                            <Accordion allowToggle>
                                {orders.map((order) => (
                                    <AccordionItem key={order.id}>
                                        <h2>
                                            <AccordionButton>
                                                <Box flex="1" textAlign="left">
                                                    Pedido N° {order.id} - Pedido Realizado: {order.dateTime} - {order.totalPurchase}
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            <Flex direction="row" gap={4} wrap="wrap">
                                                {order.shoppingCartProducts.map((shoppingCartProduct) => {
                                                    const details = productDetails[shoppingCartProduct.productId];
                                                    if (!details) return null;

                                                    return (
                                                        <Flex key={shoppingCartProduct.productId} borderWidth="1px"
                                                            borderRadius="md"
                                                            p={3}
                                                            mb={2}
                                                            width="fit-content"
                                                            minWidth="435px"
                                                            maxWidth="435px"
                                                            display="flex"
                                                            justifyContent="center"
                                                            alignItems="center"
                                                            cursor="pointer">
                                                            <Box flex="1" display="flex" justifyContent="center" alignItems="center">
                                                                <Image src={details.imageName} alt="Imagem do produto" boxSize="150px" />
                                                            </Box>
                                                            <Box flex="2" mt={3}>
                                                                <Text><strong>Produto ID:</strong> {shoppingCartProduct.productId}</Text>
                                                                <Text><strong>Nome:</strong> {details.name}</Text>
                                                                <Text><strong>Descrição:</strong> {details.description}</Text>
                                                                <Text><strong>Categoria:</strong> {details.category?.name}</Text>
                                                                <Text><strong>Quantidade:</strong> {shoppingCartProduct.quantity}</Text>
                                                                <Text><strong>Preço Final:</strong> {shoppingCartProduct.finalPrice}</Text>
                                                            </Box>


                                                        </Flex>
                                                    );


                                                })}
                                            </Flex>
                                        </AccordionPanel>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <Text>Nenhum pedido encontrado.</Text>
                        )}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
}