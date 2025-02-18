import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { SimpleGrid, } from "@chakra-ui/react";
import ProductService from "@/service/ProductService";
import { IProduct } from "@/commons/interface";
import ReactPaginate from "react-paginate";
import ProductCard from "@/components/ProductCard";

export function CategoryProductsPage() {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentItems, setCurrentItems] = useState<IProduct[]>([]);
    const itemsPerPage = 5;

    useEffect(() => {
        loadData();
    }, [categoryId]);

    const loadData = async () => {
        const response = await ProductService.findByCategory(Number(categoryId));
        if (response.status === 200) {
            setProducts(response.data);
        }
    };

    useEffect(() => {
        const offset = currentPage * itemsPerPage;
        const endOffset = offset + itemsPerPage;
        setCurrentItems(products.slice(offset, endOffset));
    }, [products, currentPage]);

    const handlePageClick = (event: { selected: number }) => {
        setCurrentPage(event.selected);
    };

    const pageCount = Math.ceil(products.length / itemsPerPage);

    return (
        <main className="container-fluid vh-100">
            <SimpleGrid p={10} spacing={10} minChildWidth="250px">
                {currentItems.map((product: IProduct) => ( 
                    <div key={product.id}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </SimpleGrid>
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
    );
}