import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ProductService from "@/service/ProductService";
import { IProduct } from "@/commons/interface";
import { Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Image, Stack, Text } from "@chakra-ui/react";
import logo from "@/assets/utfpr-logo.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export function ProductDetails() {
  const [data, setData] = useState<IProduct[]>([]);
  const [apiError, setApiError] = useState("");
  const { findAll } = ProductService;

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

  const settings = {
    slidesToShow: 4,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };
  
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={{ ...style, display: "block", background: "transparent" }} onClick={onClick}>
        <ArrowForwardIcon style={{ color: "black", fontSize: "30px" }} />
      </div>
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={{ ...style, display: "block", background: "transparent" }} onClick={onClick}>
        <ArrowBackIcon style={{ color: "black", fontSize: "30px" }} />
      </div>
    );
  }

  const groupedProducts = data.reduce((acc, product) => {
    const categoryId = product.category.id;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(product);
    return acc;
  }, {});

  return (
    <>
      <main className="container">
        {Object.keys(groupedProducts).map((categoryId) => (
          <div key={categoryId}>
            <Heading size='lg' mb={5}>
              {groupedProducts[categoryId][0].category.name}
            </Heading>
            <Slider {...settings}>
              {groupedProducts[categoryId].map((product: IProduct) => (
                <div key={product.id}>
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
            </Slider>
          </div>
        ))}
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
