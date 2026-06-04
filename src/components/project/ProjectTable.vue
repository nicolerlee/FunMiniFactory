<template>
  <div class="table-shell">
    <table class="project-table">
      <thead>
        <tr>
          <th>类别</th>
          <th>小程序名称</th>
          <th>APPID</th>
          <th>版本号</th>
          <th>平台</th>
          <th>更新时间</th>
          <th class="action-col">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="7" class="empty-cell">加载中...</td>
        </tr>
        <tr v-else-if="!projects.length">
          <td colspan="7" class="empty-cell">暂无项目</td>
        </tr>
        <tr v-for="project in projects" v-else :key="`${project.source}-${project.appId}`">
          <td><CategoryTag :category="project.category" /></td>
          <td class="project-name" :title="project.appName">{{ compactText(project.appName, 32) }}</td>
          <td class="mono app-id" :title="project.appId">{{ compactText(project.appId, 34) }}</td>
          <td class="mono">{{ displayVersion(project.version) }}</td>
          <td><PlatformBadge :platform="project.platform" /></td>
          <td class="update-time" :title="project.updateTime">{{ formatDate(project.updateTime) }}</td>
          <td class="action-col">
            <a class="enter-link" :href="project.entryUrl" target="_blank" rel="noreferrer">
              进入子系统
              <ArrowRight :size="13" :stroke-width="2.6" />
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ArrowRight } from 'lucide-vue-next'
import CategoryTag from '@/components/common/CategoryTag.vue'
import PlatformBadge from '@/components/common/PlatformBadge.vue'
import { compactText, displayVersion, formatDate } from '@/utils/format'

defineProps({
  projects: { type: Array, required: true },
  loading: { type: Boolean, default: false }
})
</script>
