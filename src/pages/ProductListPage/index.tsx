import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ProductService from "@/service/ProductService";
import { IProduct } from "@/commons/interface";
import { Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Image, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import logo from "@/assets/utfpr-logo.png";

export function ProductListPage() {
  const [data, setData] = useState<IProduct[]>([]);
  const [apiError, setApiError] = useState("");
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const { findAll, remove } = ProductService;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const response = await findAll();
    if (response.status === 200) {
      setData(response.data);
      setApiError("");
    } else {
      setApiError("Falha ao carregar a lista de produtos");
    }
  };

  const onRemove = async (id: number) => {
    const response = await remove(id);
    if (response.status === 204) {
      setShowDeleteMessage(true);

      data.filter((product) => {
        return product.id !== id;
      });

      setTimeout(() => {
        setShowDeleteMessage(false);
      }, 1500);
      setApiError("");
    } else {
      setApiError("Falha ao remover o produto");
    }
  };

  return (
    <>



      <main className="container">

        <SimpleGrid p={10} spacing={10} minChildWidth="250px">
          {data.map((product: IProduct) => (
            <div className="" key={product.id}>
              <NavLink
                to={`/${product.name}`}
                className={(navData) =>
                  navData.isActive ? "nav-link text-white" : "nav-link text-white"
                }
              >
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
              </NavLink>
            </div>
          ))}
        </SimpleGrid>
      </main>
      <footer className="justify-content-center align-items-center">
        <nav className="justify-content-center align-items-center">
          <ul className="pagination">
            <li className="page-item"><a className="page-link" href="#">Anterior</a></li>
            <li className="page-item"><a className="page-link" href="#">1</a></li>
            <li className="page-item"><a className="page-link" href="#">2</a></li>
            <li className="page-item"><a className="page-link" href="#">3</a></li>
            <li className="page-item"><a className="page-link" href="#">Próximo</a></li>
          </ul>
        </nav>
      </footer>

    </>

  );
}