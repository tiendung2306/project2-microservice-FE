<script setup lang="ts">
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import TaskItem from '@/components/task/TaskItem.vue'
</script>

<template>
  <div class="card">
    <Splitter class="h-full mb-8">
      <SplitterPanel class="flex justify-center" :min-size="20">
        <div class="flex flex-col gap-2">
          <div class="flex justify-center">TO DO</div>
          <TaskItem />
          <TaskItem />
        </div>
      </SplitterPanel>

      <SplitterPanel class="flex justify-center" :min-size="20">
        <div class="flex flex-col gap-2">
          <div class="flex justify-center">IN PROGRESS</div>
          <TaskItem />
          <TaskItem />
          <TaskItem />
        </div>
      </SplitterPanel>

      <SplitterPanel class="flex justify-center" :min-size="20">
        <div class="flex flex-col gap-2">
          <div class="flex justify-center">DONE</div>
          <TaskItem />
          <TaskItem />
          <TaskItem />
        </div>
      </SplitterPanel>
    </Splitter>
  </div>
</template>
