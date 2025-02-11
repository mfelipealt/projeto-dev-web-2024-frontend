import {
    Image, Stack, Text, Box, Flex, IconButton,
} from "@chakra-ui/react";
import logo from "@/assets/utfpr-logo.png";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ICartItem, IProduct } from "@/commons/interface";

// Componente para exibir um item do carrinho
const ProductShoppingCart = ({ item, product, updateQuantity, removeFromCart }: {
    item: ICartItem;
    product: IProduct | undefined;
    updateQuantity: (id: number, newQuantity: number) => void;
    removeFromCart: (id: number) => void;
}) => (
    <Box key={item.id} p={3} borderWidth="1px" borderRadius="md">
        <Flex align="center">
            <Image
                src={product?.imageName ? product.imageName : logo}
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
                        Valor c/ desc: R$ {(item.price - item.price * item.discount).toFixed(2)}
                    </Text>
                    <Text fontWeight="bold">
                        Total: R$ {((item.price - item.price * item.discount) * item.quantity).toFixed(2)}
                    </Text>
                </Stack>
            </Box>
            <Flex align="center" mr={3} ml={3}>
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

export default ProductShoppingCart;