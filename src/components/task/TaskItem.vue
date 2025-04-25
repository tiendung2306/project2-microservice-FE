<script setup lang="ts">
import { ref, defineProps, computed, watch } from 'vue'
// 1. Thêm InputText, Textarea, Button
import { Card, Dialog, Dropdown, InputText, Textarea, Button } from 'primevue'

// Props (giữ nguyên)
const props = defineProps({
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: {
    type: String,
    required: true,
    validator: (value: string) => ['To Do', 'In Progress', 'Done'].includes(value),
  },
})

// 2. Thêm emits cho title và content
const emit = defineEmits(['update:status', 'update:title', 'update:content'])

// --- State ---
const dialogVisible = ref(false)
// Status state
const selectedStatus = ref(props.status)
const statusOptions = ref([
  { label: 'To Do', value: 'To Do' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Done', value: 'Done' },
])
// Inline editing state
const isEditingTitle = ref(false)
const editingTitle = ref('')
const isEditingDescription = ref(false)
const editingDescription = ref('')

// --- Computed ---
const currentStatusLabel = computed(() => {
  const option = statusOptions.value.find((opt) => opt.value === props.status)
  return option ? option.label : props.status
})
// formattedContent không cần nữa vì dùng white-space

// --- Methods ---
const openDialog = () => {
  // Reset status và các state chỉnh sửa khi mở dialog
  selectedStatus.value = props.status
  isEditingTitle.value = false
  isEditingDescription.value = false
  // Luôn lấy giá trị mới nhất từ props khi mở
  editingTitle.value = props.title
  editingDescription.value = props.content
  dialogVisible.value = true
}

// Watchers
watch(selectedStatus, (newStatus, oldStatus) => {
  // Chỉ emit khi dialog đang mở và giá trị thực sự thay đổi (tránh emit khi reset lúc mở dialog)
  if (dialogVisible.value && newStatus !== oldStatus) {
    console.log('Status changed via Dropdown to:', newStatus)
    emit('update:status', newStatus)
  }
})

// Title Editing Functions
const startEditingTitle = () => {
  editingTitle.value = props.title // Đảm bảo lấy giá trị mới nhất
  isEditingTitle.value = true
  // Tùy chọn: focus vào input sau khi hiển thị (cần nextTick)
  // nextTick(() => { titleInputRef.value?.focus() });
}
const saveTitle = () => {
  if (editingTitle.value.trim() && editingTitle.value !== props.title) {
    emit('update:title', editingTitle.value)
  }
  isEditingTitle.value = false
}
const cancelTitle = () => {
  isEditingTitle.value = false
  // Không cần reset editingTitle vì sẽ được lấy lại từ props khi mở hoặc start edit
}

// Description Editing Functions
const startEditingDescription = () => {
  editingDescription.value = props.content // Đảm bảo lấy giá trị mới nhất
  isEditingDescription.value = true
  // Tùy chọn: focus vào textarea
}
const saveDescription = () => {
  // Cho phép lưu nội dung rỗng nếu cần
  if (editingDescription.value !== props.content) {
    emit('update:content', editingDescription.value)
  }
  isEditingDescription.value = false
}
const cancelDescription = () => {
  isEditingDescription.value = false
}
</script>

<template>
  <!-- Card hiển thị Task -->
  <Card class="task-card cursor-pointer w-full" @click="openDialog">
    <template #title>
      <div class="task-card-title">{{ props.title }}</div>
    </template>
    <template #content>
      <!-- 1. Dùng CSS white-space để xuống dòng, bỏ line-clamp -->
      <p class="m-0 text-sm text-gray-600 whitespace-pre-line">
        {{ props.content }}
      </p>
    </template>
    <template #footer>
      <div
        class="status-indicator"
        :class="`status-${props.status.toLowerCase().replace(' ', '-')}`"
      >
        {{ currentStatusLabel }}
      </div>
    </template>
  </Card>

  <!-- Dialog chi tiết Task -->
  <Dialog
    v-model:visible="dialogVisible"
    modal
    :closable="false"
    :dismissableMask="true"
    :showHeader="false"
    class="task-dialog"
    :style="{ width: '650px', maxWidth: '90vw' }"
    :contentStyle="{ padding: '0', maxHeight: '80vh' }"
  >
    <div class="dialog-content flex flex-col h-full">
      <!-- Header tùy chỉnh -->
      <div
        class="custom-header flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0 gap-4"
      >
        <!-- 2. Title Editing -->
        <div v-if="!isEditingTitle" class="flex items-center gap-2 flex-grow min-w-0">
          <h2 class="text-xl font-semibold text-gray-800 truncate" :title="props.title">
            {{ props.title }}
          </h2>
          <Button
            icon="pi pi-pencil"
            @click="startEditingTitle"
            text
            rounded
            severity="secondary"
            aria-label="Edit title"
            class="flex-shrink-0"
          />
        </div>
        <div v-else class="flex items-center gap-2 flex-grow min-w-0">
          <InputText
            v-model="editingTitle"
            class="flex-grow text-xl font-semibold p-inputtext-lg"
            aria-label="Edit title input"
            @keyup.enter="saveTitle"
            @keyup.esc="cancelTitle"
          />
          <Button
            icon="pi pi-check"
            @click="saveTitle"
            rounded
            text
            severity="success"
            aria-label="Save title"
            class="flex-shrink-0"
          />
          <Button
            icon="pi pi-times"
            @click="cancelTitle"
            rounded
            text
            severity="danger"
            aria-label="Cancel title edit"
            class="flex-shrink-0"
          />
        </div>

        <!-- Nút đóng Dialog -->
        <Button
          icon="pi pi-times"
          @click="dialogVisible = false"
          text
          rounded
          severity="secondary"
          aria-label="Close dialog"
          class="flex-shrink-0"
        />
      </div>

      <!-- Body của Dialog -->
      <div class="dialog-body flex-grow p-6 overflow-y-auto flex flex-col gap-6">
        <!-- Phần chọn Status (giữ nguyên Dropdown) -->
        <div class="status-section">
          <label for="taskStatusDropdown" class="block text-sm font-medium text-gray-600 mb-2"
            >Status</label
          >
          <Dropdown
            id="taskStatusDropdown"
            v-model="selectedStatus"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Status"
            class="w-full md:w-60 status-dropdown-component"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex items-center">
                <span
                  :class="`status-dot status-${slotProps.value.toLowerCase().replace(' ', '-')}`"
                ></span>
                <div>{{ slotProps.value }}</div>
              </div>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>
            <template #option="slotProps">
              <div class="flex items-center">
                <span
                  :class="`status-dot status-${slotProps.option.value.toLowerCase().replace(' ', '-')}`"
                ></span>
                <div>{{ slotProps.option.label }}</div>
              </div>
            </template>
          </Dropdown>
        </div>

        <!-- 2. Description Editing -->
        <div class="content-section flex-grow">
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-600">Description</label>
            <!-- Nút Edit chỉ hiện khi không ở chế độ chỉnh sửa -->
            <Button
              v-if="!isEditingDescription"
              icon="pi pi-pencil"
              @click="startEditingDescription"
              text
              rounded
              severity="secondary"
              size="small"
              aria-label="Edit description"
            />
          </div>

          <!-- Hiển thị Description (dùng white-space) -->
          <div v-if="!isEditingDescription">
            <p class="m-0 text-base leading-relaxed text-gray-700 whitespace-pre-line">
              {{ props.content }}
            </p>
          </div>
          <!-- Chế độ chỉnh sửa Description -->
          <div v-else class="flex flex-col gap-2">
            <Textarea
              v-model="editingDescription"
              autoResize
              rows="5"
              class="w-full text-base p-inputtextarea"
              aria-label="Edit description input"
            />
            <div class="flex justify-end gap-2">
              <Button
                label="Cancel"
                @click="cancelDescription"
                severity="secondary"
                outlined
                size="small"
              />
              <Button label="Save" @click="saveDescription" size="small" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
/* --- Task Card Styles --- */
.task-card {
  transition: all 0.2s ease-in-out;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  max-height: 20vh;
}
.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  border-color: #d1d5db;
}
.task-card :deep(.p-card-title) {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  padding: 0;
}
.task-card :deep(.p-card-content) {
  padding: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: #4b5563;
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
}
.task-card :deep(.p-card-body) {
  height: 100%;
  overflow-y: hidden;
  padding: 1rem;
}
.task-card :deep(.p-card-footer) {
  padding: 0.5rem 1rem;
  border-top: 1px solid #f3f4f6;
}
.task-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
}

/* --- CSS cho xuống dòng --- */
.whitespace-pre-line {
  white-space: pre-line; /* hoặc pre-wrap nếu muốn giữ nhiều khoảng trắng */
}

/* --- Status Indicator on Card --- */
.status-indicator {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
}

/* --- Dialog Styles --- */
.task-dialog :deep(.p-dialog) {
  border-radius: 8px;
  overflow: hidden;
}
.dialog-content {
  max-height: inherit;
}
.custom-header {
  background-color: #f9fafb;
}
.custom-header .p-button {
  width: 2.25rem;
  height: 2.25rem;
} /* Kích thước nút icon */
.custom-header .p-inputtext {
  padding: 0.5rem 0.75rem;
}
.custom-header h2 {
  color: #111827;
  max-width: calc(100% - 3rem); /* Giới hạn chiều rộng title */
}
.dialog-body {
  /* styles giữ nguyên */
}
.status-section {
  /* styles giữ nguyên */
}
.content-section {
  line-height: 1.7;
  color: #374151;
}
.content-section label {
  color: #4b5563;
}
.content-section .p-button[size='small'] {
  /* PrimeVue small button style */
}
.content-section .p-inputtextarea {
  line-height: 1.7;
} /* Đồng bộ line-height */

/* --- Status Colors & Dot (giữ nguyên) --- */
.status-to-do {
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}
.status-in-progress {
  background-color: #dbeafe;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}
.status-done {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  display: inline-block;
}
.status-dot.status-to-do {
  background-color: #9ca3af;
}
.status-dot.status-in-progress {
  background-color: #60a5fa;
}
.status-dot.status-done {
  background-color: #34d399;
}

/* --- Dropdown Styles (giữ nguyên) --- */
.status-dropdown-component {
  /* styles */
}
.status-dropdown-component :deep(.p-dropdown-label .flex),
:global(.p-dropdown-panel .p-dropdown-item .flex) {
  align-items: center;
}
</style>
