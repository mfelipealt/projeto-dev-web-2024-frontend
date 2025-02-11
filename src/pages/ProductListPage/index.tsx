import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ProductService from "@/service/ProductService";
import { IProduct } from "@/commons/interface";
import { ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Image, Stack, Text } from "@chakra-ui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReactPaginate from 'react-paginate';
import './index.css';
import { AddToCartButton } from "@/components/AddToCartButton";
import { BuyButton } from "@/components/BuyButton";
import ProductCard from "@/components/ProductCard";

export function ProductListPage() {
  const [data, setData] = useState<IProduct[]>([]);
  const [apiError, setApiError] = useState("");
  const { findAll, addToCart } = ProductService;
  const [currentPage, setCurrentPage] = useState(0);
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

  const groupedProducts = data.reduce((acc: Record<number, IProduct[]>, product) => {
    const categoryId = product.category?.id;

    if (categoryId !== undefined) {
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(product);
    }
    return acc;
  }, {});

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
        {currentPageCategories.map((categoryId) => (
          <div key={categoryId}>
            <Heading size='lg' mb={5}>
              {groupedProducts[Number(categoryId)][0].category.name}
            </Heading>
            <Slider {...settings}>
            {groupedProducts[Number(categoryId)].map((product: IProduct) => (
                                <div key={product.id}>
                                    <ProductCard product={product} /> {/* Usa o componente aqui */}
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
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
        />
      </main>

    </>
  );
}
