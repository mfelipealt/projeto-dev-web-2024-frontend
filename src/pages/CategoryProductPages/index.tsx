import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Image, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import logo from "@/assets/utfpr-logo.png";
import backgroundImage from "@/assets/categories-background.jpg";
import ProductService from "@/service/ProductService";
import { IProduct } from "@/commons/interface";
import { AddToCartButton } from "@/components/AddToCartButton";
import { BuyButton } from "@/components/BuyButton";
import ReactPaginate from "react-paginate";

export function CategoryProductsPage() {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentItems, setCurrentItems] = useState<IProduct[]>([]);
    const itemsPerPage = 6;

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

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const pageCount = Math.ceil(products.length / itemsPerPage);


    return (
        <main className="container-fluid vh-100">
            <SimpleGrid p={10} spacing={10} minChildWidth="250px">
                {currentItems.map((product: IProduct) => ( // Use currentItems aqui
                    <div key={product.id}>
                        <Card borderRadius='lg'>
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
                                    <Stack mt='2' className="justify-content-center align-items-center">
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
                                    <BuyButton product={product} />
                                    <AddToCartButton product={product} />
                                </ButtonGroup>
                            </CardFooter>
                        </Card>
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