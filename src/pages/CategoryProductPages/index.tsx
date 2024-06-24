import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductService from "@/service/ProductService";
import { IProduct } from "@/commons/interface";
import { Card, CardBody, CardFooter, Heading, Image, Stack, Text, Button, ButtonGroup, Divider, SimpleGrid } from "@chakra-ui/react";
import logo from "@/assets/utfpr-logo.png";

export function CategoryProductsPage() {
    console.log("CategoryProductsPage");
  const { categoryName } = useParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (categoryName) {
      loadCategoryProducts(categoryName);
    }
  }, [categoryName]);

  const loadCategoryProducts = async (categoryName: string) => {
    const response = await ProductService.findByCategory(categoryName);
    if (response.status === 200) {
      setProducts(response.data);
      setApiError("");
    } else {
      setApiError("Falha ao carregar os produtos da categoria");
    }
  };

  return (
    <>
      <main className="container">
        <Heading size='lg' mb={5}>
          Produtos da Categoria: {categoryName}
        </Heading>
        <SimpleGrid p={10} spacing={10} minChildWidth="250px">
          {products.map((product: IProduct) => (
            <div key={product.id}>
              <Card borderRadius='lg'>
                <CardBody>
                  <Image
                    src={logo}
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
            </div>
          ))}
        </SimpleGrid>
      </main>
    </>
  );
}
