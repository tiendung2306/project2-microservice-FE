export type Task = {
  id: number
  // userId: number
  title: string
  content: string
  status: string
  start_date: Date
  due_date: Date
  // createdAt: string
  // updatedAt: string
}

export type UpdateTask = {
  title: string
  content: string
  status: string
  start_date: string
  due_date: string
}

export type CreateTask = {
  user_id: number
  title: string
  content: string
  status: string
  start_date: string
  due_date: string
}