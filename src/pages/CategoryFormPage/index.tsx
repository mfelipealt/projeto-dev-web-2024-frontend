import { ICategory } from "@/commons/interface";
import CategoryService from "@/service/CategoryService";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

export function CategoryFormPage() {

    const {handleSubmit, register, formState: { errors, isSubmitting }, reset, } = useForm<ICategory>();

    const navigate = useNavigate();
    const { id } = useParams(); 
    // const { apiError, setApiError } = useState("");

    useEffect(() => {
        if (id) {
           loadData(Number(id));
        }
    }, []);

    const loadData = async (id: number) => {
        const response = await CategoryService.findById(id);
        if (response.status === 200 || response.status === 201) {
            reset(response.data);
        } else {
            // setApiError("Falha ao carregar a categoria.");
        }
    }

    const onSubmit = async (data: ICategory) => {
        const response = await CategoryService.save(data);
        if (response.status === 200 || response.status === 201) {
            navigate("/categories");
        } else {
            // setApiError("Falha ao salvar a categoria.");
        }
    }

    return (
        <>
            <main className="container-fluid vh-100 bg-primary-subtle d-flex justify-content-center align-items-center">
                <form className="card bg-warning col-md-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="text-center mb-3">
                        <span className="h3 mb-3 fw-normal">Cadastro de Categoria</span>
                        <input type="hidden" {...register("id")} />

                        <div className="container mb-3">
                            <label htmlFor="name">Nome</label>
                            <input type="text" className={"form-control" + errors.name ? " is-invalid" : ""} id="name" placeholder="Nome" 
                                {...register("name", { required: "O campo nome é obrigatório",
                                    minLength: { value: 3, message: "O campo nome deve ter no mínimo 3 caracteres" },
                                    maxLength: { value: 50, message: "O campo nome deve ter no máximo 50 caracteres" }
                                 })}/>
                            {errors.name && (
                                <div className="invalid-feedback">{errors.name.message}</div>
                            )}
                        </div>
                        {/* {apiError && (
                            <div className="alert alert-danger text-center" role="alert">{apiError}</div>
                        )} */}
                        <div className="container col-md-4"> 
                                <label htmlFor="type">Tipo:</label>
                                <select className="" {...register("type")}>
                                    <option value="">Selecione</option>
                                    <option value="OUTSIDE_VEHICLE">Partes Externas</option>
                                    <option value="INSIDE_VEHICLE">Partes Internas</option>
                                    <option value="MISCELLANEOUS">Diversas</option>
                                    <option value="MECHANICAL_PARTS">Partes Mecânicas</option>
                                    <option value="TUNING_PARTS">Tunagem</option>
                                </select>
                        </div>

                        <button className="btn btn-lg btn-primary mb-3 col-md-3" type="submit" disabled={isSubmitting ? true : false}>
                            Salvar
                        </button>
                    </div>
                </form>
            </main>
        </>
    )
}