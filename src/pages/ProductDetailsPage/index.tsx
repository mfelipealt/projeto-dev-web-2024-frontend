import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductService from "@/service/ProductService";
import { IProduct } from "@/commons/interface";
import { Box, Text } from "@chakra-ui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/pages/ProductDetailsPage/index.css";
import ProductCardBuy from "@/components/ProductCardBuy";

export function ProductDetails() {
  const [data, setData] = useState<IProduct | null>(null);
  const [apiError, setApiError] = useState("");
  const { findOne } = ProductService;
  const { id } = useParams<{ id: string }>(); 

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const response = await findOne(Number(id));
    if (response.status === 200) {
      setData(response.data);
      setApiError("");
    } else {
      setApiError("Falha ao carregar a lista de produtos");
    }
  };

  return (
    <>
      <main className="container-fluid vh-100">
        {data ? (
          <Box className="product-card-container" p={5}>
            <ProductCardBuy
              image={data.imageName} // URL dinâmica
              title={data.name}
              description={data.description}
              price={data.price}
              discount={data.discount}
            />
          </Box>
        ) : (
          <Text>{apiError || "Carregando..."}</Text>
        )}
      </main>
    </>
  );
}
