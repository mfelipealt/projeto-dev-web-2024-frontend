import { IAddress } from "@/commons/interface"; 
import { api } from "@/lib/axios";

const addressURL = "/address"; 
const create = async (address: IAddress): Promise<any> => {
  let response;
  try {
    response = await api.post(`${addressURL}/auth`, address); 
  } catch (error: any) {
    response = error.response;
  }
  return response;
};

const update = async (address: IAddress): Promise<any> => {
  let response;
  try {
    response = await api.put(`${addressURL}/${address.id}`, address); 
  } catch (error: any) {
    response = error.response;
  }
  return response;
};

const deleteAddress = async (id: number): Promise<any> => {
    let response;
    try {
        response = await api.delete(`${addressURL}/${id}`); 
    } catch (error: any) {
        response = error.response;
    }
    return response;
};

const getByCEP = async (cep: string): Promise<any> => {
    let response;
    try {
        response = await api.get(`${addressURL}/cep/${cep}`); 
    } catch (error: any) {
        response = error.response;
    }
    return response;
};

const AddressService = {
  create,
  update,
  deleteAddress,
  getByCEP,
};

export default AddressService;
