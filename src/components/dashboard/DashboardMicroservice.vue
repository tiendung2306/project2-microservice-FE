<script setup lang="ts">
import { getServices, restartService, startService, stopService } from '@/services/dashboard/dashboard.service'
import { useUserStore } from '@/stores/userStore'
import type { Service, ServiceDetail } from '@/types/service'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const user = userStore.getUser
if (user === null) {
  const router = useRouter()
  router.push('/login')
}

const detailServices: ServiceDetail[] = [
  {
    id: 2,
    name: 'auth-service',
    description: 'Dịch vụ xác thực',
  },
  {
    id: 1,
    name: 'user-service',
    description: 'Dịch vụ quản lý người dùng',
  },
  {
    id: 4,
    name: 'notification-service',
    description: 'Dịch vụ gửi thông báo',
  },
  {
    id: 3,
    name: 'task-service',
    description: 'Dịch vụ quản lý công việc dạng bảng kanban',
  },
]
const services = ref<Service[]>([]);

const toast = useToast()
const isLoading = ref(false)
const loadingService = ref<string | null>(null)

async function fetchServices() {
  try {
    const data = await getServices()
    services.value = data.filter((service: Service) => detailServices.some(detail => detail.name === service.name))
      .map((service: Service) => ({
        ...service,
        ...detailServices.find(detail => detail.name === service.name),
        status: !service.is_running ? 'off' :
          service.health_status === 'healthy' ? 'good' : 'error'
      } as Service))
      .sort((a: Service, b: Service) => a.id - b.id)
    console.log(services.value)

    // Update selectedService if it exists
    if (selectedService.value) {
      const updatedService = services.value.find(s => s.name === selectedService.value?.name)
      if (updatedService) {
        selectedService.value = updatedService
      }
    } else if (services.value.length > 0) {
      selectedService.value = services.value[0]
    }
  } catch (error) {
    console.error('Error fetching services:', error)
  }
}

// Initialize selectedService with a default value
const selectedService = ref<Service | null>(null)

// Call getServices in onMounted
onMounted(async () => {
  await fetchServices()
})

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

async function waitForServiceStatus(serviceName: string, expectedStatus: boolean, maxAttempts = 10) {
  let attempts = 0
  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second between checks
    await fetchServices()
    const service = services.value.find(s => s.name === serviceName)
    if (service && service.is_running === expectedStatus) {
      return true
    }
    attempts++
  }
  return false
}

async function toggleServiceStatus(service: Service, event: Event) {
  event.stopPropagation();
  try {
    isLoading.value = true
    loadingService.value = service.name
    const isStarting = !service.is_running

    if (isStarting) {
      await startService(service.name)
    } else {
      await stopService(service.name)
    }

    const success = await waitForServiceStatus(service.name, isStarting)

    if (success) {
      // Force update selectedService
      const updatedService = services.value.find(s => s.name === service.name)
      if (updatedService) {
        selectedService.value = updatedService
      }

      toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail: isStarting ? 'Đã bật dịch vụ thành công' : 'Đã tắt dịch vụ thành công',
        life: 3000
      })
    } else {
      toast.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: isStarting ? 'Không thể bật dịch vụ' : 'Không thể tắt dịch vụ',
        life: 3000
      })
    }
  } catch (error) {
    console.error('Error toggling service status:', error)
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Có lỗi xảy ra khi thực hiện thao tác',
      life: 3000
    })
  } finally {
    isLoading.value = false
    loadingService.value = null
  }
}

async function handleRestart(service: Service, event: Event) {
  event.stopPropagation();
  try {
    isLoading.value = true
    loadingService.value = service.name

    await restartService(service.name)
    const success = await waitForServiceStatus(service.name, true)

    if (success) {
      // Force update selectedService
      const updatedService = services.value.find(s => s.name === service.name)
      if (updatedService) {
        selectedService.value = updatedService
      }

      toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Đã khởi động lại dịch vụ thành công',
        life: 3000
      })
    } else {
      toast.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể khởi động lại dịch vụ',
        life: 3000
      })
    }
  } catch (error) {
    console.error('Error restarting service:', error)
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Có lỗi xảy ra khi khởi động lại dịch vụ',
      life: 3000
    })
  } finally {
    isLoading.value = false
    loadingService.value = null
  }
}

// Add computed property for status color
const getStatusColor = (status: string | undefined) => {
  if (!status) return 'bg-gray-400';
  return statusColor[status as keyof typeof statusColor] || 'bg-gray-400';
}

// Add computed property for status label
const getStatusLabel = (status: string | undefined) => {
  if (!status) return 'Không xác định';
  return statusLabel[status as keyof typeof statusLabel] || 'Không xác định';
}
</script>

<template>
  <div class="max-w-6xl mx-auto py-8">
    <!-- Loading overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
        <i class="pi pi-spin pi-spinner text-xl"></i>
        <span>Đang {{ loadingService ? 'xử lý ' + loadingService : 'tải' }}...</span>
      </div>
    </div>

    <!-- Toast component -->
    <Toast />

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
            :class="['border rounded-lg p-4 cursor-pointer', selectedService?.id === service.id ? 'border-black shadow-lg' : 'border-gray-200']">
            <div class="flex items-center justify-between">
              <div class="font-semibold">{{ service.name }}</div>
              <div class="flex items-center gap-2">
                <span :class="[getStatusColor(service.status), 'w-3 h-3 rounded-full inline-block']"></span>
                <span class="text-xs" :class="{
                  'text-green-600': service.status === 'good',
                  'text-yellow-600': service.status === 'warning',
                  'text-red-600': service.status === 'error',
                  'text-gray-600': service.status === 'off',
                }">{{ getStatusLabel(service.status) }}</span>
              </div>
            </div>
            <div class="text-gray-500 text-sm mt-1">{{ service.description }}</div>
            <button
              class="mt-2 w-full py-1 border rounded text-sm flex items-center justify-center bg-white text-gray-800 border-gray-300 hover:border-gray-500 transition"
              :disabled="isLoading" @click.stop="toggleServiceStatus(service, $event)">
              <span class="inline-flex items-center">
                <span :class="service.status === 'off' ? 'pi pi-power-on mr-2' : 'pi pi-power-off mr-2'"></span>
                {{ service.status === 'off' ? 'Bật' : 'Tắt' }}
              </span>
            </button>
          </div>
        </div>
      </div>
      <!-- Chi tiết dịch vụ -->
      <div v-if="selectedService" class="bg-white rounded-xl shadow p-4">
        <div class="font-bold text-lg mb-4">Chi tiết dịch vụ</div>
        <div class="mb-2">
          <div class="font-semibold text-xl">{{ selectedService.name }}</div>
          <div class="text-gray-500 text-sm">{{ selectedService.description }}</div>
        </div>
        <div class="flex items-center gap-2 mb-2">
          <span :class="[getStatusColor(selectedService.status), 'w-3 h-3 rounded-full inline-block']"></span>
          <span class="text-xs font-medium" :class="{
            'text-green-600': selectedService.status === 'good',
            'text-yellow-600': selectedService.status === 'warning',
            'text-red-600': selectedService.status === 'error',
            'text-gray-600': selectedService.status === 'off',
          }">{{ getStatusLabel(selectedService.status) }}</span>
        </div>
        <div class="mb-2">
          <span class="font-medium">Endpoint:</span>
          <span class="text-blue-700 ml-1">{{ selectedService.endpoint }}</span>
        </div>
        <div class="mb-2 text-sm text-gray-500">Cập nhật lần cuối: {{ selectedService.last_checked }}</div>
        <div class="flex gap-2 mb-4">
          <button :class="!selectedService.is_running
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white'" :disabled="isLoading"
            class="transition px-4 py-2 rounded flex-1 flex items-center justify-center text-sm font-semibold shadow"
            @click.stop="toggleServiceStatus(selectedService, $event)">
            <span class="inline-flex items-center">
              <span :class="!selectedService.is_running ? 'pi pi-power-on mr-2' : 'pi pi-power-off mr-2'"
                style="color:white"></span>
              {{ !selectedService.is_running ? 'Bật dịch vụ' : 'Tắt dịch vụ' }}
            </span>
          </button>
          <button class="border border-gray-400 hover:bg-gray-100 px-4 py-2 rounded flex-1" :disabled="isLoading"
            @click.stop="handleRestart(selectedService, $event)">Khởi động lại</button>
        </div>
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="font-bold mb-2">Thông tin kết nối</div>
          <div class="mb-1">
            <span class="font-medium">Endpoint URL:</span>
            <span class="ml-1">{{ selectedService.endpoint }}</span>
          </div>
          <div class="mb-1">
            <span class="font-medium">Trạng thái hiện tại:</span>
            <span class="ml-1">{{ selectedService.is_running ? 'Đang hoạt động' : 'Đang tắt' }}</span>
          </div>
          <div>
            <span class="font-medium">Thời gian hoạt động:</span>
            <span class="ml-1">{{ selectedService.docker_status }}</span>
          </div>
        </div>
      </div>
      <div v-else class="bg-white rounded-xl shadow p-4 flex items-center justify-center">
        <div class="text-gray-500">Vui lòng chọn một dịch vụ để xem chi tiết</div>
      </div>
    </div>
  </div>
</template>