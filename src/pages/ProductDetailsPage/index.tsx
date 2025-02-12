import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductService from "@/service/ProductService";
import { IProduct } from "@/commons/interface";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/pages/ProductDetailsPage/index.css";
import ProductCardBuy from "@/components/ProductCardBuy";
import { BuyButton } from "@/components/BuyButton";
import { AddToCartButton } from "@/components/AddToCartButton";
import { SampleNextArrow, SamplePrevArrow } from "@/components/CarouselArrows";

export function ProductDetails() {
  const [data, setData] = useState<IProduct | null>(null);
  const [apiError, setApiError] = useState("");
  const { findOne } = ProductService;
  const { id } = useParams<{ id: string }>();
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const response = await findOne(Number(id));
    if (response.status === 200) {
      setData(response.data);
      setApiError("");
      if (response.data?.category?.id) {
        loadRelatedProducts(response.data.category.id);
      }
    } else {
      setApiError("Falha ao carregar os detalhes do produto");
    }
  };

  const loadRelatedProducts = async (categoryId: number) => {
    try {
        const response = await ProductService.findByCategory(categoryId);
        if (response.status === 200) {
            const filteredProducts = response.data.filter((product) => product.id !== Number(id));
            setRelatedProducts(filteredProducts);
        } else {
            console.error("Falha ao carregar produtos relacionados");
        }
    } catch (error) {
        console.error("Erro ao carregar produtos relacionados:", error);
    }
};


  const relatedProductsSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow /> 
  };

  return (
    <main className="container-fluid vh-100">
      {data ? (
        <Flex className="product-details-container" p={5} direction="row">
          <Box w="50%" mr={5}> 
            <Image src={data.imageName} alt={data.name} w="100%" /> 
          </Box>
          <Box w="100%"  justifyContent={"center"} textAlign={"left"} display={"flex"} flexDirection={"column"}>  
            <Text fontSize="2xl" fontWeight="bold">{data.name}</Text>
            <Text fontSize="md" color="gray.500">{data.description}</Text>

              <Text fontSize="xl" color="gray.500" mr={2} textDecoration="line-through">
                De: {formatPrice(data.price)}
              </Text>
              <Text fontSize="4xl" color="blue.500" fontWeight="bold">
                Por: {formatPrice(data.price * (1 - data.discount))}
              </Text>
            <Text fontSize="md" color="gray.500" mt={2}>
              Em até 10x de {formatPrice((data.price * (1 - data.discount)) / 10)} sem juros no cartão
            </Text>

            <Flex mt={4}>
              <BuyButton product={data} />
              <AddToCartButton product={data} />
            </Flex>
          </Box> 
        </Flex>
      ) : (
        <Text>{apiError || "Carregando..."}</Text>
      )}

      <Box mt={8} mr={9} ml={9}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>Produtos Relacionados</Text>
        <Slider {...relatedProductsSliderSettings} >
          {relatedProducts.map((product) => (
            <div key={product.id}>
              <ProductCardBuy
                image={product.imageName}
                title={product.name}
                price={product.price}
                discount={product.discount}
                product={product}
                isSmall={true}
              />
            </div>
          ))}
        </Slider>
      </Box>
    </main>
  );
}