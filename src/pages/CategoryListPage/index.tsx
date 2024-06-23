import { ICategory } from "@/commons/interface";
import CategoryService from "@/service/CategoryService";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

    const onCLickRemove = async (id?: number) => {
        if (id) {
            const response = await CategoryService.remove(id);
            if (response.status === 200 || response.status === 204 || response.status === 201) {
                loadData();
            }
        }
    }

    return (
      <>
        <main className="container">
          <div className="text-center">
            <h1 className="h3 mb-3 fw-normal">Lista de Categorias</h1>
            <Link to="/categories/new" className="btn btn-primary">Nova Categoria</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Editar</th>
                        <th scope="col">Excluir</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((category: ICategory) => (
                        <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td>{category.type}</td>
                            <td>
                                <Link to={`/categories/${category.id}`} className="btn btn-primary">
                                    Editar
                                </Link>
                            </td>
                            <td>
                            <button
                                className="btn btn-danger"
                                onClick={() => onCLickRemove(category.id)}
                            >
                                Remover
                            </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        </main>
      </>
    );
}