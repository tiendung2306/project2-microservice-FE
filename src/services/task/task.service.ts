import { taskServiceAxiosInstance } from "@/services"
import type { CreateTask, Task, UpdateTask } from "@/types/task"

export const getAllTasksByUserId = async (id: number, status: string) => {
	const response = await taskServiceAxiosInstance.get(`/api/task/user/${id}?status=${status}`)
	return response.data as Task[]
}

export const getTaskById = async (id: string) => {
	const response = await taskServiceAxiosInstance.get(`/api/task/${id}`)
	return response.data
}

export const updateTask = async (id: number, task: UpdateTask) => {
	const response = await taskServiceAxiosInstance.put(`/api/task/${id}`, task)
	return response.data
}

export const createTask = async (task: CreateTask) => {
	const response = await taskServiceAxiosInstance.post('/api/task', task)
	return response.data
}

export const deleteTask = async (id: number) => {
	const response = await taskServiceAxiosInstance.delete(`/api/task/${id}`)
	return response.data
}