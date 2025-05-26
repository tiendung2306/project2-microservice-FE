import type { Service } from "@/types/service";

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

export const getServices = async (): Promise<Service[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}:${import.meta.env.VITE_API_DASHBOARD_SERVICE_PORT}/api/services/status`, {
        headers
    })
    const data = await response.json()
    return data
}

export const startService = async (serviceName: string): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}:${import.meta.env.VITE_API_DASHBOARD_SERVICE_PORT}/api/services/${serviceName}/start`, {
        method: 'POST',
        headers,
        credentials: 'include'
    })
    const data = await response.json()
    return data
}

export const stopService = async (serviceName: string): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}:${import.meta.env.VITE_API_DASHBOARD_SERVICE_PORT}/api/services/${serviceName}/stop`, {
        method: 'POST',
        headers,
        credentials: 'include'
    })
    const data = await response.json()
    return data
}

export const restartService = async (serviceName: string): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}:${import.meta.env.VITE_API_DASHBOARD_SERVICE_PORT}/api/services/${serviceName}/restart`, {
        method: 'POST',
        headers,
        credentials: 'include'
    })
    const data = await response.json()
    return data
}