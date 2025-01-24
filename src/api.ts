import axios from 'axios';
import { TransactionFormData } from './types';

const API_BASE_URL = "https://tabgiqz57a.execute-api.ap-south-1.amazonaws.com/csvsync/api/v1/transactions";

//axios instance with default config
export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const api = {
    async getTransactions(page: number = 1, limit: number = 10){
        const response = await axiosInstance.get('/get',{
            params:{page,limit}
        });
        return response.data;
    },

    async uploadCSV(file: File){
        const formData = new FormData();
        formData.append('file',file);
        const response = await axiosInstance.post('/upload',formData, {
            headers:{
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    },

    async addTransaction(data: TransactionFormData){
        const response = await axiosInstance.post('/add',data);
        return response.data;
    },

    async editTransaction(id:number, data: TransactionFormData){
        const response = await axiosInstance.put(`/edit/${id}`,data);
        return response.data;
    },

    async deleteTransaction(id: number){
        const response = await axiosInstance.delete(`/delete/${id}`);
        return response.data;
    },

    async deleteMultipleTransactions(ids: number[]) {
        const response = await axiosInstance.delete('/delete-multiple', {data: { ids }});
      return response.data;
    }
};