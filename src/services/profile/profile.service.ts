import userServiceAxiosInstance, { authServiceAxiosInstance } from '@/services'
import type { User } from '@/types/user'

export const updateUser = async (id: number, updateUser: Partial<Omit<User, 'user_id'>>) => {
    const response = await userServiceAxiosInstance.patch(`/api/user/${id}`, updateUser)
    return { ...response.data, user_id: response.data.id, id: undefined }
}

export const getUser = async (id: string) => {
    const response = await userServiceAxiosInstance.get(`/api/user/${id}`)
    return { ...response.data, user_id: response.data.id, id: undefined }
}

export const changePassword = async (password: string) => {
    const response = await authServiceAxiosInstance.post(`/api/auth/change-password`, { newPassword: password })
    return response.data
}

export const checkUserServiceHealth = async () => {
    try {
        await userServiceAxiosInstance.get('/api/health')
        return true
    } catch {
        return false
    }
}
