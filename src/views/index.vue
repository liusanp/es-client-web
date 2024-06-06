<route lang="yaml">
name: home
meta:
  title: 主页
  icon: ant-design:home-twotone
</route>

<script setup lang="ts">

</script>

<template>
  <div>
    <PageHeader>
      <template #title>
        <div class="flex items-center gap-4">
          欢迎使用 es-client-web
        </div>
      </template>
      <template #content>
        <div class="text-sm/6">
          <div>
            这是一款ES查询的网页
          </div>
        </div>
      </template>
    </PageHeader>
    <div class="w-full flex flex-col gap-4 px-4 xl:flex-row">
      <PageMain class="ecology" />
      <PageMain class="ecology" />
      <PageMain class="ecology" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.text-emphasis {
  text-emphasis-style: "❤";
}

.ecology {
  --at-apply: flex-1 m-0;

  :deep(.title-container) {
    --at-apply: flex items-center justify-between flex-wrap gap-4;

    .title-info {
      --at-apply: flex items-center gap-4;

      img {
        --at-apply: block w-12 h-12;
      }

      h1 {
        --at-apply: m-0 text-2xl;
      }

      h2 {
        --at-apply: m-0 text-base text-stone-5 font-normal;
      }
    }
  }
}
</style>
