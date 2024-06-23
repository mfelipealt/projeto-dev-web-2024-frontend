import { ICategory } from "@/commons/interface";
import CategoryService from "@/service/CategoryService";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Stack, Heading, Image, Text, Divider, ButtonGroup, Button } from '@chakra-ui/react'
import logo from "@/assets/utfpr-logo.png";
import backgroundImage from "@/assets/categories-background.jpg";
import { NavLink } from "react-router-dom";

export function CategoryListPage() {

    const [data, setData] = useState<ICategory[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const response = await CategoryService.findAll();
        if (response.status === 200) {
            setData(response.data);
        }
    }

    return (
        <>
            <main className="container-fluid vh-100 " style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        overflow: "hidden"
                    }}>
                    <div className="row mt-5">
                        {data.map((category: ICategory) => (
                            <div className="col-md-4 mb-4 d-flex justify-content-center" key={category.id}>
                                <NavLink
                                    to={`/${category.name}`}
                                    className={(navData) =>
                                        navData.isActive ? "nav-link text-white" : "nav-link text-white"
                                    }
                                    >
                                    <Card maxW='sm' borderRadius='lg' className="w-100">
                                        <Image
                                            src={logo}
                                            alt='Category Image'
                                            borderTopRadius='lg'
                                        />
                                        <Stack mt='2' spacing='3' className="justify-content-center align-items-center" borderRadius='lg'>
                                            <Heading size='md'>{category.name}</Heading>
                                        </Stack>
                                    </Card>
                                </NavLink>
                            </div>
                        ))}
                    </div>
            </main>
        </>
    );
}