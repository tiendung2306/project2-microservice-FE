<script setup lang="ts">
import TaskItem from '@/components/task/TaskItem.vue'; // Đảm bảo đường dẫn đúng
import { createTask, deleteTask, getAllTasksByUserId, updateTask } from '@/services/task/task.service';
import { useUserStore } from '@/stores/userStore';
import type { CreateTask, Task, UpdateTask } from '@/types/task';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import { computed, onMounted, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';


const userStore = useUserStore()
const user = userStore.getUser
if (user === null) {
  const router = useRouter()
  router.push('/login')
}

const todoTasks = ref<Task[]>([])
const inProgressTasks = ref<Task[]>([])
const doneTasks = ref<Task[]>([])

const fetchTasks = async () => {
  if (user === null) {
    return;
  }
  try {
    const todoData = await getAllTasksByUserId(user.user_id, 'To Do')
    const inProgressData = await getAllTasksByUserId(user.user_id, 'In Progress')
    const doneData = await getAllTasksByUserId(user.user_id, 'Done')

    // Parse dates for each task
    todoTasks.value = todoData.map(task => ({
      ...task,
      start_date: new Date(task.start_date),
      due_date: new Date(task.due_date)
    }))

    inProgressTasks.value = inProgressData.map(task => ({
      ...task,
      start_date: new Date(task.start_date),
      due_date: new Date(task.due_date)
    }))

    doneTasks.value = doneData.map(task => ({
      ...task,
      start_date: new Date(task.start_date),
      due_date: new Date(task.due_date)
    }))

    console.log('Fetched tasks:', {
      todo: todoTasks.value,
      inProgress: inProgressTasks.value,
      done: doneTasks.value
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
  }
}

onMounted(async () => {
  await fetchTasks()
})

console.log(todoTasks.value)

const sortedTodoTasks = computed(() => [...todoTasks.value].sort((a, b) => b.id - a.id))
const sortedInProgressTasks = computed(() => [...inProgressTasks.value].sort((a, b) => b.id - a.id))
const sortedDoneTasks = computed(() => [...doneTasks.value].sort((a, b) => b.id - a.id))

// --- Hàm xử lý sự kiện cập nhật từ TaskItem ---

const findTaskAndList = (
  taskId: number,
): { task: Task | undefined; list: Ref<Task[]> | undefined } => {
  let task = todoTasks.value.find((t) => t.id === taskId)
  if (task) return { task, list: todoTasks }

  task = inProgressTasks.value.find((t) => t.id === taskId)
  if (task) return { task, list: inProgressTasks }

  task = doneTasks.value.find((t) => t.id === taskId)
  if (task) return { task, list: doneTasks }

  return { task: undefined, list: undefined }
}

const handleUpdateTitle = async (taskId: number, newTitle: string) => {
  const { task } = findTaskAndList(taskId)
  if (task) {
    task.title = newTitle
    console.log(`Updated title for task ${taskId}`)
    const updateTaskRequest: UpdateTask = {
      title: newTitle,
      content: task.content,
      status: task.status,
      start_date: task.start_date.toISOString(),
      due_date: task.due_date.toISOString()
    }
    await updateTask(taskId, updateTaskRequest)
  }
}

const handleUpdateContent = async (taskId: number, newContent: string) => {
  const { task } = findTaskAndList(taskId)
  if (task) {
    task.content = newContent
    console.log(`Updated content for task ${taskId}`)
    const updateTaskRequest: UpdateTask = {
      title: task.title,
      content: newContent,
      status: task.status,
      start_date: task.start_date.toISOString(),
      due_date: task.due_date.toISOString()
    }
    await updateTask(taskId, updateTaskRequest)
  }
}

const handleUpdateStatus = async (taskId: number, newStatus: 'To Do' | 'In Progress' | 'Done') => {
  const { task, list: currentList } = findTaskAndList(taskId)

  if (!task || !currentList || task.status === newStatus) {
    if (task && task.status === newStatus) {
      task.status = newStatus
    }
    return
  }

  // 1. Xóa task khỏi danh sách hiện tại
  currentList.value = currentList.value.filter((t) => t.id !== taskId)

  // 2. Cập nhật status của task
  task.status = newStatus

  // 3. Thêm task vào danh sách mới
  if (newStatus === 'To Do') {
    todoTasks.value.push(task)
  } else if (newStatus === 'In Progress') {
    inProgressTasks.value.push(task)
  } else {
    // Done
    doneTasks.value.push(task)
  }
  console.log(`Moved task ${taskId} to ${newStatus}`)

  // 4. Update backend
  const updateTaskRequest: UpdateTask = {
    title: task.title,
    content: task.content,
    status: newStatus,
    start_date: task.start_date.toISOString(),
    due_date: task.due_date.toISOString()
  }
  await updateTask(taskId, updateTaskRequest)
}

// 6. Cập nhật hàm onAddTask
async function onAddTask(statusIndex: 0 | 1 | 2) {
  let status: 'To Do' | 'In Progress' | 'Done'
  let targetList: Ref<Task[]>

  if (statusIndex === 0) {
    status = 'To Do'
    targetList = todoTasks
  } else if (statusIndex === 1) {
    status = 'In Progress'
    targetList = inProgressTasks
  } else {
    status = 'Done'
    targetList = doneTasks
  }

  const createTaskRequest: CreateTask = {
    user_id: user!.user_id,
    title: `New Task (${status})`,
    content: 'Click to edit',
    status: status,
    start_date: new Date().toISOString(),
    due_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // 7 ngày sau
  }

  const newTask = await createTask(createTaskRequest)

  // Parse dates for the new task
  const parsedTask = {
    ...newTask,
    start_date: new Date(newTask.start_date),
    due_date: new Date(newTask.due_date)
  }

  targetList.value.push(parsedTask)
  console.log(`Added new task to ${status}`)
}

const handleUpdateStartDate = async (taskId: number, newStartDate: Date) => {
  const { task } = findTaskAndList(taskId)
  if (task) {
    task.start_date = newStartDate
    console.log(`Updated startDate for task ${taskId}`)
    const updateTaskRequest: UpdateTask = {
      title: task.title,
      content: task.content,
      status: task.status,
      start_date: newStartDate.toISOString(),
      due_date: task.due_date.toISOString()
    }
    await updateTask(taskId, updateTaskRequest)
  }
}

const handleUpdateDueDate = async (taskId: number, newDueDate: Date) => {
  const { task } = findTaskAndList(taskId)
  if (task) {
    task.due_date = newDueDate
    console.log(`Updated dueDate for task ${taskId}`)
    const updateTaskRequest: UpdateTask = {
      title: task.title,
      content: task.content,
      status: task.status,
      start_date: task.start_date.toISOString(),
      due_date: newDueDate.toISOString()
    }
    await updateTask(taskId, updateTaskRequest)
  }
}

const handleDeleteTask = async (taskId: number) => {
  try {
    await deleteTask(taskId)

    // Remove task from the appropriate list
    todoTasks.value = todoTasks.value.filter(t => t.id !== taskId)
    inProgressTasks.value = inProgressTasks.value.filter(t => t.id !== taskId)
    doneTasks.value = doneTasks.value.filter(t => t.id !== taskId)

    console.log(`Deleted task ${taskId}`)
  } catch (error) {
    console.error('Error deleting task:', error)
  }
}
</script>

<template>
  <div class="card">
    <!-- :min-size và layout có thể cần điều chỉnh lại -->
    <Splitter class="h-[calc(100vh-10rem)] mb-8 border border-gray-200 rounded-md overflow-hidden">
      <!-- === TO DO Panel === -->
      <SplitterPanel class="flex flex-col" :min-size="20">
        <!-- Header -->
        <div class="flex justify-between items-center px-4 py-3 border-b bg-gray-50 flex-shrink-0">
          <span class="font-semibold text-gray-700">TO DO</span>
          <button @click="() => onAddTask(0)"
            class="p-button p-component p-button-icon-only p-button-rounded p-button-text p-button-sm text-green-600 hover:bg-green-50"
            aria-label="Add To Do Task" v-tooltip.bottom="'Add Task'">
            <i class="pi pi-plus"></i>
          </button>
        </div>
        <!-- Task List -->
        <div class="flex flex-col gap-3 p-3 overflow-y-auto flex-grow">
          <!-- 3. Sử dụng v-for -->
          <TaskItem v-for="task in sortedTodoTasks" :key="task.id" :title="task.title" :content="task.content"
            :status="task.status" :startDate="task.start_date" :dueDate="task.due_date"
            @update:title="handleUpdateTitle(task.id, $event)" @update:content="handleUpdateContent(task.id, $event)"
            @update:status="handleUpdateStatus(task.id, $event)"
            @update:startDate="handleUpdateStartDate(task.id, $event)"
            @update:dueDate="handleUpdateDueDate(task.id, $event)" @delete="handleDeleteTask(task.id)" />
          <div v-if="todoTasks.length === 0" class="text-center text-gray-400 text-sm mt-4">
            No tasks
          </div>
        </div>
      </SplitterPanel>

      <!-- === IN PROGRESS Panel === -->
      <SplitterPanel class="flex flex-col" :min-size="20">
        <!-- Header -->
        <div class="flex justify-between items-center px-4 py-3 border-b bg-gray-50 flex-shrink-0">
          <span class="font-semibold text-gray-700">IN PROGRESS</span>
          <button @click="() => onAddTask(1)"
            class="p-button p-component p-button-icon-only p-button-rounded p-button-text p-button-sm text-green-600 hover:bg-green-50"
            aria-label="Add In Progress Task" v-tooltip.bottom="'Add Task'">
            <i class="pi pi-plus"></i>
          </button>
        </div>
        <!-- Task List -->
        <div class="flex flex-col gap-3 p-3 overflow-y-auto flex-grow">
          <TaskItem v-for="task in sortedInProgressTasks" :key="task.id" :title="task.title" :content="task.content"
            :status="task.status" :startDate="task.start_date" :dueDate="task.due_date"
            @update:title="handleUpdateTitle(task.id, $event)" @update:content="handleUpdateContent(task.id, $event)"
            @update:status="handleUpdateStatus(task.id, $event)"
            @update:startDate="handleUpdateStartDate(task.id, $event)"
            @update:dueDate="handleUpdateDueDate(task.id, $event)" @delete="handleDeleteTask(task.id)" />
          <div v-if="inProgressTasks.length === 0" class="text-center text-gray-400 text-sm mt-4">
            No tasks
          </div>
        </div>
      </SplitterPanel>

      <!-- === DONE Panel === -->
      <SplitterPanel class="flex flex-col" :min-size="20">
        <!-- Header -->
        <div class="flex justify-between items-center px-4 py-3 border-b bg-gray-50 flex-shrink-0">
          <span class="font-semibold text-gray-700">DONE</span>
          <button @click="() => onAddTask(2)"
            class="p-button p-component p-button-icon-only p-button-rounded p-button-text p-button-sm text-green-600 hover:bg-green-50"
            aria-label="Add Done Task" v-tooltip.bottom="'Add Task'">
            <i class="pi pi-plus"></i>
          </button>
        </div>
        <!-- Task List -->
        <div class="flex flex-col gap-3 p-3 overflow-y-auto flex-grow">
          <TaskItem v-for="task in sortedDoneTasks" :key="task.id" :title="task.title" :content="task.content"
            :status="task.status" :startDate="task.start_date" :dueDate="task.due_date"
            @update:title="handleUpdateTitle(task.id, $event)" @update:content="handleUpdateContent(task.id, $event)"
            @update:status="handleUpdateStatus(task.id, $event)"
            @update:startDate="handleUpdateStartDate(task.id, $event)"
            @update:dueDate="handleUpdateDueDate(task.id, $event)" @delete="handleDeleteTask(task.id)" />
          <div v-if="doneTasks.length === 0" class="text-center text-gray-400 text-sm mt-4">
            No tasks
          </div>
        </div>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<style scoped>
/* Thêm style nếu cần, ví dụ đảm bảo chiều cao và scroll */
.card {
  padding: 1rem;
  /* Hoặc padding khác tùy layout tổng thể */
}

/* Style cho nút add task */
.p-button-sm i {
  font-size: 1rem;
  /* Điều chỉnh kích thước icon nếu cần */
}

/* Style cho tooltip (nếu bạn dùng directive v-tooltip của PrimeVue) */
/* Cần import và đăng ký Tooltip */
</style>
