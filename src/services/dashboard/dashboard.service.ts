import { dashboardServiceAxiosInstance } from "@/services";
import type { Service } from "@/types/service";

export const getServices = async (): Promise<Service[]> => {
    const response = await dashboardServiceAxiosInstance.get('/api/services/status')
    return response.data
}

export const startService = async (serviceName: string): Promise<void> => {
    const response = await dashboardServiceAxiosInstance.post(`/api/services/${serviceName}/start`)
    return response.data
}

export const stopService = async (serviceName: string): Promise<void> => {
    const response = await dashboardServiceAxiosInstance.post(`/api/services/${serviceName}/stop`)
    return response.data
}

export const restartService = async (serviceName: string): Promise<void> => {
    const response = await dashboardServiceAxiosInstance.post(`/api/services/${serviceName}/restart`)
    return response.data
}