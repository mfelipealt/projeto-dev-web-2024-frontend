import { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import ProductService from "@/service/ProductService";
import { IProduct } from "@/commons/interface";
import { Box, Text } from "@chakra-ui/react";
import logo from "@/assets/utfpr-logo.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
          <Box p={5}>
            <ProductCardBuy
              image={logo}
              title={data.name}
              description={data.description}
              price={data.price.toString()}
            />
          </Box>
        ) : (
          <Text>{apiError  || "Carregando..."}</Text>
        )}
      
      </main>
    </>
  );
}
