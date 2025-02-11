import { NavLink } from "react-router-dom";
import { IProduct } from "@/commons/interface";
import { ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Image, Stack, Text } from "@chakra-ui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AddToCartButton } from "@/components/AddToCartButton";
import { BuyButton } from "@/components/BuyButton";

// Componente para exibir um produto
const ProductCard = ({ product }: { product: IProduct }) => (
    <Card borderRadius='lg' mx={4} mb={4}>
        <CardBody>
            <NavLink
                to={`/product/${product.id}`}
                className={(navData) =>
                    navData.isActive ? "nav-link text-white" : "nav-link text-white"
                }
            >
                <Image src={product.imageName} alt='Product Image' />
                <Stack mt='2' className="justify-content-center" color='blue.900'>
                    <Heading size='md'>{product.name}</Heading>
                </Stack>
                <Text className="risk" color='grey' textDecorationLine="line-through">
                    De: R${product.price.toFixed(2)}
                </Text>
                <Text color='blue.600' fontSize='2xl'>
                    Por: R${(product.price - (product.price * product.discount)).toFixed(2)}
                </Text>
            </NavLink>
        </CardBody>
        <Divider color='blue.600' />
        <CardFooter>
            <ButtonGroup spacing='2'>
                <BuyButton product={product} />
                <AddToCartButton product={product} />
            </ButtonGroup>
        </CardFooter>
    </Card>
);

export default ProductCard;