<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const user = userStore.getUser
if (user === null) {
  const router = useRouter()
  router.push('/login')
}

interface Service {
  id: number
  name: string
  description: string
  endpoint: string
  status: 'good' | 'warning' | 'error' | 'off';
  lastUpdate: string;
  connectionUrl: string;
  connectionStatus: string;
}

const services = ref<Service[]>([
  {
    id: 1,
    name: 'Auth Service',
    description: 'Dịch vụ xác thực người dùng',
    endpoint: 'http://auth-service.example.com/api',
    status: 'good',
    lastUpdate: '17:17:34 08/05/2025',
    connectionUrl: 'http://auth-service.example.com/api',
    connectionStatus: 'Đang hoạt động',
  },
  {
    id: 2,
    name: 'User Service',
    description: 'Quản lý thông tin người dùng',
    endpoint: 'http://user-service.example.com/api',
    status: 'good',
    lastUpdate: '17:17:34 08/05/2025',
    connectionUrl: 'http://user-service.example.com/api',
    connectionStatus: 'Đang hoạt động',
  },
  {
    id: 3,
    name: 'Notification Service',
    description: 'Gửi thông báo qua email',
    endpoint: 'http://notification-service.example.com/api',
    status: 'warning',
    lastUpdate: '17:17:34 08/05/2025',
    connectionUrl: 'http://notification-service.example.com/api',
    connectionStatus: 'Có vấn đề',
  },
  {
    id: 4,
    name: 'Task Service',
    description: 'Quản lý task dạng kanban',
    endpoint: 'http://task-service.example.com/api',
    status: 'good',
    lastUpdate: '17:17:34 08/05/2025',
    connectionUrl: 'http://task-service.example.com/api',
    connectionStatus: 'Đang hoạt động',
  },
])

const selectedService = ref<Service>(services.value[0])

const statusLabel = {
  good: 'Hoạt động tốt',
  warning: 'Có vấn đề',
  error: 'Lỗi',
  off: 'Tắt',
}

const statusColor = {
  good: 'bg-green-500',
  warning: 'bg-yellow-400',
  error: 'bg-red-500',
  off: 'bg-gray-400',
}

const summary = computed(() => [
  { label: 'Dịch vụ hoạt động tốt', value: services.value.filter(s => s.status === 'good').length, color: 'bg-green-100', text: 'text-green-700' },
  { label: 'Dịch vụ có cảnh báo', value: services.value.filter(s => s.status === 'warning').length, color: 'bg-yellow-100', text: 'text-yellow-700' },
  { label: 'Dịch vụ có lỗi', value: services.value.filter(s => s.status === 'error').length, color: 'bg-red-100', text: 'text-red-700' },
  { label: 'Dịch vụ đang tắt', value: services.value.filter(s => s.status === 'off').length, color: 'bg-gray-100', text: 'text-gray-700' },
])

function selectService(service: Service) {
  selectedService.value = service
}

function toggleServiceStatus(service: Service, event: Event) {
  event.stopPropagation();
  if (service.status === 'off') {
    service.status = 'good';
    service.connectionStatus = 'Đang hoạt động';
  } else {
    service.status = 'off';
    service.connectionStatus = 'Đang tắt';
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto py-8">
    <!-- Tổng quan trạng thái -->
    <div class="grid grid-cols-4 gap-4 mb-8">
      <div v-for="item in summary" :key="item.label"
        :class="[item.color, 'rounded-lg p-4 flex flex-col items-center justify-center']">
        <div class="text-3xl font-bold" :class="item.text">{{ item.value }}</div>
        <div class="mt-1 text-sm font-medium" :class="item.text">{{ item.label }}</div>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Danh sách dịch vụ -->
      <div class="bg-white rounded-xl shadow p-4">
        <div class="font-bold text-lg mb-4">Danh sách dịch vụ</div>
        <div class="flex flex-col gap-4">
          <div v-for="service in services" :key="service.id" @click="selectService(service)"
            :class="['border rounded-lg p-4 cursor-pointer', selectedService.id === service.id ? 'border-black shadow-lg' : 'border-gray-200']">
            <div class="flex items-center justify-between">
              <div class="font-semibold">{{ service.name }}</div>
              <div class="flex items-center gap-2">
                <span :class="[statusColor[service.status], 'w-3 h-3 rounded-full inline-block']"></span>
                <span class="text-xs" :class="{
                  'text-green-600': service.status === 'good',
                  'text-yellow-600': service.status === 'warning',
                  'text-red-600': service.status === 'error',
                  'text-gray-600': service.status === 'off',
                }">{{ statusLabel[service.status] }}</span>
              </div>
            </div>
            <div class="text-gray-500 text-sm mt-1">{{ service.description }}</div>
            <button
              class="mt-2 w-full py-1 border rounded text-sm flex items-center justify-center bg-white text-gray-800 border-gray-300 hover:border-gray-500 transition"
              @click.stop="toggleServiceStatus(service, $event)">
              <span class="inline-flex items-center">
                <span :class="service.status === 'off' ? 'pi pi-power-on mr-2' : 'pi pi-power-off mr-2'"></span>
                {{ service.status === 'off' ? 'Bật' : 'Tắt' }}
              </span>
            </button>
          </div>
        </div>
      </div>
      <!-- Chi tiết dịch vụ -->
      <div class="bg-white rounded-xl shadow p-4">
        <div class="font-bold text-lg mb-4">Chi tiết dịch vụ</div>
        <div class="mb-2">
          <div class="font-semibold text-xl">{{ selectedService.name }}</div>
          <div class="text-gray-500 text-sm">{{ selectedService.description }}</div>
        </div>
        <div class="flex items-center gap-2 mb-2">
          <span :class="[statusColor[selectedService.status], 'w-3 h-3 rounded-full inline-block']"></span>
          <span class="text-xs font-medium" :class="{
            'text-green-600': selectedService.status === 'good',
            'text-yellow-600': selectedService.status === 'warning',
            'text-red-600': selectedService.status === 'error',
            'text-gray-600': selectedService.status === 'off',
          }">{{ statusLabel[selectedService.status] }}</span>
        </div>
        <div class="mb-2">
          <span class="font-medium">Endpoint:</span>
          <span class="text-blue-700 ml-1">{{ selectedService.endpoint }}</span>
        </div>
        <div class="mb-2 text-sm text-gray-500">Cập nhật lần cuối: {{ selectedService.lastUpdate }}</div>
        <div class="flex gap-2 mb-4">
          <button :class="selectedService.status === 'off'
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white'"
            class="transition px-4 py-2 rounded flex-1 flex items-center justify-center text-sm font-semibold shadow"
            @click.stop="toggleServiceStatus(selectedService, $event)">
            <span class="inline-flex items-center">
              <span :class="selectedService.status === 'off' ? 'pi pi-power-on mr-2' : 'pi pi-power-off mr-2'"
                style="color:white"></span>
              {{ selectedService.status === 'off' ? 'Bật dịch vụ' : 'Tắt dịch vụ' }}
            </span>
          </button>
          <button class="border border-gray-400 hover:bg-gray-100 px-4 py-2 rounded flex-1">Khởi động lại</button>
        </div>
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="font-bold mb-2">Thông tin kết nối</div>
          <div class="mb-1">
            <span class="font-medium">Endpoint URL:</span>
            <span class="ml-1">{{ selectedService.connectionUrl }}</span>
          </div>
          <div>
            <span class="font-medium">Trạng thái hiện tại:</span>
            <span class="ml-1">{{ selectedService.connectionStatus }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>