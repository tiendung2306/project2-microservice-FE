<script setup lang="ts">
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import TaskItem from '@/components/task/TaskItem.vue'
</script>

<template>
  <div class="card">
    <Splitter class="h-full mb-8">
      <SplitterPanel class="flex justify-center" :min-size="20">
        <div class="flex flex-col gap-2 p-2 w-full">
          <div class="flex justify-center">TO DO</div>
          <TaskItem
            :title="'API Auth'"
            :content="'- API đăng nhập đăng ký, quên mật khẩu\n- Dùng jwttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt\n- Có refresh token\n- Có xác thực email\n- Có xác thực số điện thoại\nasd\ngewywywy\nwey4uyehe\nerheherhrh\nhwrheut\n\nddd'"
            :status="'To Do'"
          />

          <TaskItem
            :title="'API Auth'"
            :content="'- API đăng nhập đăng ký, quên mật khẩu\n- Dùng jwt\n- Có refresh token\n- Có xác thực email\n- Có xác thực số điện thoại\nasd\ngewywywy\nwey4uyehe\nerheherhrh\nhwrheut\n\nddd'"
            :status="'To Do'"
          />
        </div>
      </SplitterPanel>

      <SplitterPanel class="flex justify-center" :min-size="20">
        <div class="flex flex-col gap-2 p-2 w-full">
          <div class="flex justify-center">IN PROGRESS</div>

          <TaskItem
            :title="'API Auth'"
            :content="'- API đăng nhập đăng ký, quên mật khẩu\n- Dùng jwt\n- Có refresh token\n- Có xác thực email\n- Có xác thực số điện thoại\nasd\ngewywywy\nwey4uyehe\nerheherhrh\nhwrheut\n\nddd\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nfff'"
            :status="'In Progress'"
          />
        </div>
      </SplitterPanel>

      <SplitterPanel class="flex justify-center" :min-size="20">
        <div class="flex flex-col gap-2 p-2 w-full">
          <div class="flex justify-center">DONE</div>
        </div>
      </SplitterPanel>
    </Splitter>
  </div>
</template>
