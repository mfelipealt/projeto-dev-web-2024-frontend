import { ICategory } from "@/commons/interface";
import CategoryService from "@/service/CategoryService";
import { useForm } from "react-hook-form";

export function CategoryFormPage() {

    const {handleSubmit, register, formState: { errors, isSubmitting }, reset, } = useForm<ICategory>();

    const onSubmit = async (data: ICategory) => {
        const response = await CategoryService.save(data);
    }

    return (
        <>
            <main className="container row justify-content-center">
                <form className="form-floating col-md-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="text-center mb-3">
                        <span className="h3 mb-3 fw-normal">Cadastro de Categoria</span>
                        <input type="hidden" {...register("id")} />

                        <div className="form-floating mb-3">
                            <input type="text" className={"form-control" + errors.name ? " is-invalid" : ""} id="name" placeholder="Nome" 
                                {...register("name", { required: "O campo nome é obrigatório",
                                    minLength: { value: 3, message: "O campo nome deve ter no mínimo 3 caracteres" },
                                    maxLength: { value: 50, message: "O campo nome deve ter no máximo 50 caracteres" }
                                 })}/>
                            <label htmlFor="name">Nome</label>
                            {errors.name && (
                                <div className="invalid-feedback">{errors.name.message}</div>
                            )}
                        </div>

                        <button className="w-100 btn btn-lg btn-primary mb-3" type="submit" disabled={isSubmitting ? true : false}>
                            Salvar
                        </button>
                    </div>
                </form>
            </main>
        </>
    )
}