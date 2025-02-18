import { Button, useToast } from "@chakra-ui/react";
import { IProduct } from "@/commons/interface"; 
import ProductService from "@/service/ProductService";

interface AddToCartButtonProps {
    product: IProduct;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
    const { addToCart } = ProductService;
    const toast = useToast();

    const handleAddToCart = () => {
        addToCart(product);
        toast({
            title: "Produto adicionado com sucesso ao carrinho",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "bottom"
        });
    };

    return (
        <Button variant='ghost' colorScheme='blue' onClick={handleAddToCart}>
            + Carrinho
        </Button>
    );
};