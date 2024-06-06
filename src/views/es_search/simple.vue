<route lang="yaml">
meta:
  title: 简单查询
</route>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import essearch from '@/api/modules/essearch'

const indicesData = ref([])
const mappingsData = ref([])
const selectedIndex = ref('')
const selectedMapping = ref('')

onMounted(() => {
  // 在初始化的时候进行获取
  getIndices()
})

function getIndices() {
  essearch.getIndices().then((res) => {
    // console.log(res)
    if (res.code === 0) {
      // ElMessage({
      //   message: '获取ES索引成功',
      //   type: 'success',
      // })
      indicesData.value = res.data
    }
    else {
      ElMessage.error(res.data)
    }
  }).catch((error) => {
    console.error(error)
    ElMessage.error('获取ES索引失败')
  })
}

function getMappings(name: string) {
  if (name !== '') {
    essearch.getMappings(name).then((res) => {
      // console.log(res)
      if (res.code === 0) {
        // ElMessage({
        //   message: '获取ES索引mappings成功',
        //   type: 'success',
        // })
        mappingsData.value = res.data[name].mappings.index.properties
      }
      else {
        ElMessage.error(res.data)
      }
    }).catch((error) => {
      console.error(error)
      ElMessage.error('获取ES索引mappings失败')
    })
  }
}
</script>

<template>
  <div>
    <PageHeader>
      <el-space wrap>
        <el-select
          v-model="selectedIndex"
          filterable
          placeholder="选择索引"
          style="width: 240px"
          :change="getMappings(selectedIndex)"
        >
          <el-option
            v-for="item in indicesData"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-select
          v-model="selectedMapping"
          filterable
          placeholder="选择索引Mappings"
          style="width: 240px"
        >
          <el-option
            v-for="(item, k) in mappingsData"
            :key="k"
            :label="k"
            :value="k"
          />
        </el-select>
        <el-button type="primary" size="default">
          查询
        </el-button>
      </el-space>
    </PageHeader>
    <PageMain>
      简单查询
    </PageMain>
  </div>
</template>
