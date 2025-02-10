import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ProductService from "@/service/ProductService";
import { IProduct } from "@/commons/interface";
import { Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Image, Stack, Text, useToast } from "@chakra-ui/react"; // Import useToast
import logo from "@/assets/utfpr-logo.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReactPaginate from 'react-paginate';
import './index.css'; 

export function ProductListPage() {
  const [data, setData] = useState<IProduct[]>([]);
  const [apiError, setApiError] = useState("");
  const { findAll, addToCart } = ProductService;
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(0); // Começa em 0 para react-paginate
  const categoriesPerPage = 2;

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

  function SampleNextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={{ ...style, display: "block", background: "transparent" }} onClick={onClick}>
        <ArrowForwardIcon style={{ color: "black", fontSize: "30px" }} />
      </div>
    );
  }

  function SamplePrevArrow(props: any) {
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

  const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: "Produto adicionado com sucesso ao carrinho",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom-center"
    });
  };

  const categoryKeys = Object.keys(groupedProducts);
  const pageCount = Math.ceil(categoryKeys.length / categoriesPerPage);

  const handlePageClick = (event) => {
      setCurrentPage(event.selected);
  };

  const offset = currentPage * categoriesPerPage;
  const currentPageCategories = categoryKeys.slice(offset, offset + categoriesPerPage);

  
  return (
    <>
        <main className="container">
            {currentPageCategories.map((categoryId) => ( // Mapeia currentPageCategories
                <div key={categoryId}>
                    <Heading size='lg' mb={5}>
                        {groupedProducts[categoryId][0].category.name}
                    </Heading>
                    <Slider {...settings}>
                        {groupedProducts[categoryId].map((product: IProduct) => (
                            <div key={product.id}>
                                <Card borderRadius='lg' mx={4} mb={4} borderWidth={0.5}>
                    <CardBody>
                      <NavLink
                        to={`/product/${product.id}`}
                        className={(navData) =>
                          navData.isActive ? "nav-link text-white" : "nav-link text-white"
                        }
                      >
                        <Image
                          src={product.imageName}
                          alt='Product Image'
                        />
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
                        <Button variant='solid' colorScheme='blue'>
                          Comprar
                        </Button>
                        <Button variant='ghost' colorScheme='blue' onClick={() => handleAddToCart(product)}> {/* Chame a nova função */}
                          + Carrinho
                        </Button>
                      </ButtonGroup>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </Slider>
          </div>
        ))}
        <ReactPaginate
                    previousLabel="Anterior"
                    nextLabel="Próximo"
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    containerClassName="pagination"
                    activeClassName="active"
                    marginPagesDisplayed={2} // Número de páginas exibidas nas bordas
                    pageRangeDisplayed={5}    // Número de páginas exibidas no centro
                />
      </main>

    </>
  );
}
