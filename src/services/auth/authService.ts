import type { User } from '@/types/user'
// import axiosInstance from '..'
import { useUserStore } from '@/stores/userStore'

export const login = async (email: string, password: string) => {
  try {
    //mock login
    console.log('Mock login called with:', email, password)
    const user: User = {
      id: 1,
      username: 'John Doe',
      email: 'johndoe123@gmail.com',
      password: 'hashedpassword',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const userStore = useUserStore()
    userStore.setUser(user)
    userStore.setToken('mocked_token')
    return user

    // Use the following lines to make an actual API call
    // const response = await axiosInstance.post('/api/auth/login', {
    //   email,
    //   password,
    // })
    // TODO: Handle the response and store the token in cookies
    // return response.data
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}
