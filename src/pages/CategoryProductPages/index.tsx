import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Image, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import logo from "@/assets/utfpr-logo.png";
import backgroundImage from "@/assets/categories-background.jpg";
import ProductService from "@/service/ProductService";
import { IProduct } from "@/commons/interface"; 

export function CategoryProductsPage() {
    const { categoryId } = useParams<{ categoryId: string }>(); 
    const [products, setProducts] = useState<IProduct[]>([]); 

    useEffect(() => {
        loadData();
    }, [categoryId]);

    const loadData = async () => {
        console.log(categoryId);
        const response = await ProductService.findByCategory(Number(categoryId)); 
        if (response.status === 200) {
            setProducts(response.data); 
        }
    };

    return (
        <main className="container-fluid vh-100">
            <SimpleGrid p={10} spacing={10} minChildWidth="250px">
                {products.map((product: IProduct) => ( 
                   <div key={product.id}>
                   <NavLink
                     to={`/product/${product.id}`}
                     className={(navData) =>
                       navData.isActive ? "nav-link text-white" : "nav-link text-white"
                     }
                   >
                     <Card borderRadius='lg'>
                       <CardBody>
                         <Image
                           src={product.imageName}
                           alt='Product Image'
                         />
                         <Stack mt='2' className="justify-content-center align-items-center">
                           <Heading size='md'>{product.name}</Heading>
                         </Stack>
                         <Text className="risk" color='grey' textDecorationLine="line-through">
                           De: R${product.price.toFixed(2)}
                         </Text>
                         <Text color='blue.600' fontSize='2xl'>
                           Por: R${(product.price - (product.price * product.discount)).toFixed(2)}
                         </Text>
                       </CardBody>
                       <Divider color='blue.600' />
                       <CardFooter>
                         <ButtonGroup spacing='2'>
                           <Button variant='solid' colorScheme='blue'>
                             Comprar
                           </Button>
                           <Button variant='ghost' colorScheme='blue'>
                             + Carrinho
                           </Button>
                         </ButtonGroup>
                       </CardFooter>
                     </Card>
                   </NavLink>
                 </div>
                ))}
            </SimpleGrid>
        </main>
    );
}
