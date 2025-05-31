<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <div class="max-w-xl mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg border border-gray-200 text-center">
    <h1 class="text-2xl font-bold text-blue-700 mb-4">Giới thiệu</h1>
    <div class="text-lg text-gray-800 leading-relaxed">
      <div class="mb-2"><span class="font-semibold">Đề tài:</span> Nghiên cứu công nghệ microservice và áp dụng phát triển website quản lý công việc dạng bảng kanban</div>
      <div class="mb-2"><span class="font-semibold">Học phần:</span> Project 2</div>
      <div class="mb-2"><span class="font-semibold">Họ và tên:</span> Lê Tiến Dũng</div>
      <div class="mb-2"><span class="font-semibold">MSSV:</span> 20224837</div>
      <div><span class="font-semibold">Giảng viên hướng dẫn:</span> TS. Lê Tấn Hùng</div>
    </div>
  </div>
</template>
