<script setup lang="ts">
import useSettingsStore from '@/store/modules/settings'
import imgLogo from '@/assets/images/logo.png'

defineOptions({
  name: 'Logo',
})

withDefaults(
  defineProps<{
    showLogo?: boolean
    showTitle?: boolean
  }>(),
  {
    showLogo: true,
    showTitle: true,
  },
)

const settingsStore = useSettingsStore()

const title = ref(import.meta.env.VITE_APP_TITLE)
const logo = ref(imgLogo)

const to = computed(() => settingsStore.settings.home.enable ? settingsStore.settings.home.fullPath : '')
</script>

<template>
  <RouterLink :to="to" class="h-[var(--g-sidebar-logo-height)] w-inherit flex-center gap-2 px-3 text-inherit no-underline" :class="{ 'cursor-pointer': settingsStore.settings.home.enable }" :title="title">
    <!-- <img v-if="showLogo" :src="logo" class="logo h-[30px] w-[30px] object-contain"> -->
    <svg v-if="showLogo" x="0" y="0" width="29.82192761071261" height="29.822524061193835" filtersec="colorsb5858830120" class="image-svg-svg primary" style="overflow: visible;"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53.483001708984375 53.48400115966797"> <g> <g> <path fill="#9fdde0" d="M40.112 17.828h13.371V0H26.741v17.828h13.371z"></path> <path fill="#7fd2d5" d="M26.741 53.484h26.742V35.656H26.741v17.828z"></path> <path fill="#6eb7b9" d="M26.741 17.828h13.371v17.828H26.741z"></path> <path fill="#4fb6bb" d="M0 0h26.741v17.828H0z"></path> <path fill="#3fadb2" d="M0 35.656h26.741v17.828H0z"></path> <path fill="#37979b" d="M0 17.828h26.741v17.828H0z"></path> </g> </g> </svg> </svg>
  </img>
    <span v-if="showTitle" class="block truncate font-bold">{{ title }}</span>
  </RouterLink>
</template>
