import { useEffect, useState } from "react";
import { Heading } from "@chakra-ui/react";
import Slider from "react-slick";
import ReactPaginate from "react-paginate";
import ProductService from "@/service/ProductService";
import { IProduct } from "@/commons/interface";
import { SampleNextArrow, SamplePrevArrow } from "@/components/CarouselArrows";
import ProductCard from "@/components/ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";

export function ProductListPage() {
  const [data, setData] = useState<IProduct[]>([]);
  const [apiError, setApiError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const categoriesPerPage = 2;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await ProductService.findAll();
      if (response.status === 200) {
        setData(response.data);
      } else {
        setApiError("Falha ao carregar a lista de produtos");
      }
    } catch (error) {
      setApiError("Erro ao buscar produtos");
    }
  };

  const groupedProducts = data.reduce((acc: Record<number, IProduct[]>, product) => {
    const categoryId = product.category?.id;
    if (categoryId !== undefined) {
      acc[categoryId] = acc[categoryId] || [];
      acc[categoryId].push(product);
    }
    return acc;
  }, {});

  const categoryKeys = Object.keys(groupedProducts);
  const pageCount = Math.ceil(categoryKeys.length / categoriesPerPage);
  const offset = currentPage * categoriesPerPage;
  const currentPageCategories = categoryKeys.slice(offset, offset + categoriesPerPage);

  return (
    <main className="container">
      {apiError && <p className="error-message">{apiError}</p>}
      {currentPageCategories.map((categoryId) => (
        <section key={categoryId}>
          <Heading size='lg' mb={5}>
            {groupedProducts[Number(categoryId)][0].category.name}
          </Heading>
          <Slider slidesToShow={4} nextArrow={<SampleNextArrow />} prevArrow={<SamplePrevArrow />}>
            {groupedProducts[Number(categoryId)].map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Slider>
        </section>
      ))}
      <ReactPaginate
        previousLabel="Anterior"
        nextLabel="Próximo"
        pageCount={pageCount}
        onPageChange={(event) => setCurrentPage(event.selected)}
        containerClassName="pagination"
        activeClassName="active"
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
      />
    </main>
  );
}
