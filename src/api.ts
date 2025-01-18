import axios from 'axios';
import { TransactionFormData } from './types';

const API_BASE_URL = 'http://localhost:4000/api/v1/transactions';

//axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const api = {
    async getTransactions(page: number = 1, limit: number = 10){
        try{
            const response = await axiosInstance.get('/get',{
                params:{page,limit}
            });
            return response.data;
        } catch(error){
            throw error;
        }
    },

    async uploadCSV(file: File){
        try{
            const formData = new FormData();
            formData.append('file',file);
            const response = await axiosInstance.post('/upload',formData, {
                headers:{
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch(error){
            throw error;
        }
    },

    async addTransaction(data: TransactionFormData){
        try{
            const response = await axiosInstance.post('/add',data);
            return response.data;
        } catch(error){
            throw error;
        }
    },

    async editTransaction(id:number, data: TransactionFormData){
        try{
            const response = await axiosInstance.put(`/edit/${id}`,data);
            return response.data;
        } catch(error){
            throw error;
        }
    },

    async deleteTransaction(id: number){
        try{
            const response = await axiosInstance.delete(`/delete/${id}`);
            return response.data;
        } catch(error){
            throw error;
        }
    }
};