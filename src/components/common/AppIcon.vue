<template>
  <component :is="icon" :size="size" :stroke-width="strokeWidth" aria-hidden="true" />
</template>

<script setup>
import {
  BadgeCheck,
  BarChart3,
  BookOpen,
  Clapperboard,
  Film,
  Globe2,
  Grid2X2,
  Monitor,
  Play,
  Search,
  Settings,
  Sparkles,
  Theater,
  Users,
  Zap
} from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 16 },
  strokeWidth: { type: Number, default: 2.4 }
})

const icons = {
  all: Grid2X2,
  video: Film,
  drama: Clapperboard,
  comic: Theater,
  novel: BookOpen,
  h5: Globe2,
  h5_novel: BookOpen,
  h5_yingshi: Play,
  h5_fenxiao: Users,
  h5_laxin: Zap,
  monitor: Monitor,
  search: Search,
  settings: Settings,
  stats: BarChart3,
  sync: Sparkles,
  ok: BadgeCheck
}

const icon = computed(() => icons[props.name] || Monitor)
</script>
