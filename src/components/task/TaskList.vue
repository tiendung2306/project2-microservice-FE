<script setup lang="ts">
import { ref, type Ref, computed } from 'vue'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import TaskItem from '@/components/task/TaskItem.vue' // Đảm bảo đường dẫn đúng
import type { Task } from '@/types/task'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const user = userStore.getUser
if (user === null) {
  const router = useRouter()
  router.push('/login')
}

const todoTasks = ref<Task[]>([
  {
    id: 1,
    title: 'API Auth',
    content:
      '- API đăng nhập đăng ký, quên mật khẩu\n- Dùng jwt\n- Có refresh token\n- Có xác thực email\n- Có xác thực số điện thoại\nasd\ngewywywy\nwey4uyehe\nerheherhrh\nhwrheut\n\nddd',
    status: 'To Do',
    startDate: new Date('2023-10-01'),
    dueDate: new Date('2023-10-05'),
  },
  {
    id: 2,
    title: 'Setup Project',
    content: '- Cài đặt Vue + Vite\n- Thêm PrimeVue\n- Cấu hình ESLint, Prettier',
    status: 'To Do',
    startDate: new Date('2023-10-02'),
    dueDate: new Date('2023-10-06'),
  },
  {
    id: 3,
    title: 'API Auth',
    content:
      '- API đăng nhập đăng ký, quên mật khẩu\n- Dùng jwt\n- Có refresh token\n- Có xác thực email\n- Có xác thực số điện thoại\nasd\ngewywywy\nwey4uyehe\nerheherhrh\nhwrheut\n\nddd',
    status: 'To Do',
    startDate: new Date('2023-10-03'),
    dueDate: new Date('2023-10-07'),
  },
  {
    id: 4,
    title: 'Setup Project',
    content: '- Cài đặt Vue + Vite\n- Thêm PrimeVue\n- Cấu hình ESLint, Prettier',
    status: 'To Do',
    startDate: new Date('2023-10-04'),
    dueDate: new Date('2023-10-08'),
  },
  {
    id: 5,
    title: 'API Auth',
    content:
      '- API đăng nhập đăng ký, quên mật khẩu\n- Dùng jwt\n- Có refresh token\n- Có xác thực email\n- Có xác thực số điện thoại\nasd\ngewywywy\nwey4uyehe\nerheherhrh\nhwrheut\n\nddd',
    status: 'To Do',
    startDate: new Date('2023-10-05'),
    dueDate: new Date('2023-10-09'),
  },
  {
    id: 6,
    title: 'Setup Project',
    content: '- Cài đặt Vue + Vite\n- Thêm PrimeVue\n- Cấu hình ESLint, Prettier',
    status: 'To Do',
    startDate: new Date('2023-10-06'),
    dueDate: new Date('2023-10-10'),
  },
])

const inProgressTasks = ref<Task[]>([
  {
    id: 7,
    title: 'Thiết kế UI Kanban',
    content: '- Sử dụng Splitter\n- Thiết kế TaskItem Card\n- Thiết kế Dialog chi tiết',
    status: 'In Progress',
    startDate: new Date('2023-10-07'),
    dueDate: new Date('2023-10-11'),
  },
])

const doneTasks = ref<Task[]>([])

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

const handleUpdateTitle = (taskId: number, newTitle: string) => {
  const { task } = findTaskAndList(taskId)
  if (task) {
    task.title = newTitle
    console.log(`Updated title for task ${taskId}`)
  }
}

const handleUpdateContent = (taskId: number, newContent: string) => {
  const { task } = findTaskAndList(taskId)
  if (task) {
    task.content = newContent
    console.log(`Updated content for task ${taskId}`)
  }
}

const handleUpdateStatus = (taskId: number, newStatus: 'To Do' | 'In Progress' | 'Done') => {
  const { task, list: currentList } = findTaskAndList(taskId)

  if (!task || !currentList || task.status === newStatus) {
    // Task không tồn tại, không tìm thấy list hoặc status không đổi
    if (task && task.status === newStatus) {
      // Nếu status không đổi nhưng vẫn emit (ví dụ chọn lại status cũ trong dropdown)
      // Có thể cần cập nhật lại status của task nếu logic component con bị sai
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
}

// 6. Cập nhật hàm onAddTask
function onAddTask(statusIndex: 0 | 1 | 2) {
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

  const newTask: Task = {
    id: Math.floor(Math.random() * 1000),
    title: `New Task (${status})`,
    content: '',
    status: status,
    startDate: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 ngày sau
  }

  targetList.value.push(newTask)
  console.log(`Added new task to ${status}`)
}

const handleUpdateStartDate = (taskId: number, newStartDate: Date) => {
  const { task } = findTaskAndList(taskId)
  if (task) {
    task.startDate = newStartDate
    console.log(`Updated startDate for task ${taskId}`)
  }
}

const handleUpdateDueDate = (taskId: number, newDueDate: Date) => {
  const { task } = findTaskAndList(taskId)
  if (task) {
    task.dueDate = newDueDate
    console.log(`Updated dueDate for task ${taskId}`)
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
          <button
            @click="() => onAddTask(0)"
            class="p-button p-component p-button-icon-only p-button-rounded p-button-text p-button-sm text-green-600 hover:bg-green-50"
            aria-label="Add To Do Task"
            v-tooltip.bottom="'Add Task'"
          >
            <i class="pi pi-plus"></i>
          </button>
        </div>
        <!-- Task List -->
        <div class="flex flex-col gap-3 p-3 overflow-y-auto flex-grow">
          <!-- 3. Sử dụng v-for -->
          <TaskItem
            v-for="task in sortedTodoTasks"
            :key="task.id"
            :title="task.title"
            :content="task.content"
            :status="task.status"
            :startDate="task.startDate"
            :dueDate="task.dueDate"
            @update:title="handleUpdateTitle(task.id, $event)"
            @update:content="handleUpdateContent(task.id, $event)"
            @update:status="handleUpdateStatus(task.id, $event)"
            @update:startDate="handleUpdateStartDate(task.id, $event)"
            @update:dueDate="handleUpdateDueDate(task.id, $event)"
          />
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
          <button
            @click="() => onAddTask(1)"
            class="p-button p-component p-button-icon-only p-button-rounded p-button-text p-button-sm text-green-600 hover:bg-green-50"
            aria-label="Add In Progress Task"
            v-tooltip.bottom="'Add Task'"
          >
            <i class="pi pi-plus"></i>
          </button>
        </div>
        <!-- Task List -->
        <div class="flex flex-col gap-3 p-3 overflow-y-auto flex-grow">
          <TaskItem
            v-for="task in sortedInProgressTasks"
            :key="task.id"
            :title="task.title"
            :content="task.content"
            :status="task.status"
            :startDate="task.startDate"
            :dueDate="task.dueDate"
            @update:title="handleUpdateTitle(task.id, $event)"
            @update:content="handleUpdateContent(task.id, $event)"
            @update:status="handleUpdateStatus(task.id, $event)"
            @update:startDate="handleUpdateStartDate(task.id, $event)"
            @update:dueDate="handleUpdateDueDate(task.id, $event)"
          />
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
          <button
            @click="() => onAddTask(2)"
            class="p-button p-component p-button-icon-only p-button-rounded p-button-text p-button-sm text-green-600 hover:bg-green-50"
            aria-label="Add Done Task"
            v-tooltip.bottom="'Add Task'"
          >
            <i class="pi pi-plus"></i>
          </button>
        </div>
        <!-- Task List -->
        <div class="flex flex-col gap-3 p-3 overflow-y-auto flex-grow">
          <TaskItem
            v-for="task in sortedDoneTasks"
            :key="task.id"
            :title="task.title"
            :content="task.content"
            :status="task.status"
            :startDate="task.startDate"
            :dueDate="task.dueDate"
            @update:title="handleUpdateTitle(task.id, $event)"
            @update:content="handleUpdateContent(task.id, $event)"
            @update:status="handleUpdateStatus(task.id, $event)"
            @update:startDate="handleUpdateStartDate(task.id, $event)"
            @update:dueDate="handleUpdateDueDate(task.id, $event)"
          />
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
  padding: 1rem; /* Hoặc padding khác tùy layout tổng thể */
}

/* Style cho nút add task */
.p-button-sm i {
  font-size: 1rem; /* Điều chỉnh kích thước icon nếu cần */
}

/* Style cho tooltip (nếu bạn dùng directive v-tooltip của PrimeVue) */
/* Cần import và đăng ký Tooltip */
</style>
