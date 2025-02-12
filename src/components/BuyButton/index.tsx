import { Button, useToast } from "@chakra-ui/react";
import { IProduct } from "@/commons/interface"; 
import ProductService from "@/service/ProductService";
import { useNavigate } from "react-router-dom";
import AuthService from "@/service/AuthService";

interface BuyButtonProps {
    product: IProduct;
}

export const BuyButton: React.FC<BuyButtonProps> = ({ product }) => {
    const { addToCart } = ProductService;
    const toast = useToast();
    const navigate = useNavigate();

    const handleBuy = () => {
        addToCart(product);
        toast({
            title: "Produto adicionado com sucesso ao carrinho",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "bottom"
        });
        handleFinalizePurchase();
    };

    const handleFinalizePurchase = async () => {
        if (!AuthService.isAuthenticated()) {
            toast({
                title: "Você precisa estar logado para finalizar a compra.",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "bottom"
            });
            localStorage.setItem('redirectAfterLogin', '/checkout');
            navigate("/login");
            return;
        }
        navigate("/checkout");
    };

    return (
        <Button variant='solid' colorScheme='blue' onClick={handleBuy}>
            Comprar
        </Button>
    );
};