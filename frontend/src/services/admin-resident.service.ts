import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export const AdminResidentService = {
    getResidents: async (params?: { block?: string; search?: string; type?: string }) => {
        const response = await api.get(API_CONFIG.RESIDENT.LIST, { params });
        return response.data;
    },

    getStats: async () => {
        const response = await api.get(API_CONFIG.SOCIETY.ADMIN_STATS);
        return response.data;
    },

    getUnits: async () => {
        const response = await api.get(API_CONFIG.UNIT.LIST);
        return response.data;
    },

    addResident: async (data: {
        name: string;
        email: string;
        phone: string;
        role: string;
        unitId?: string | number;
        status?: string;
    }) => {
        const response = await api.post(API_CONFIG.RESIDENT.LIST, data);
        return response.data;
    },

    deleteResident: async (id: number | string) => {
        const response = await api.delete(API_CONFIG.AUTH.DELETE_USER(id));
        return response.data;
    }
};
