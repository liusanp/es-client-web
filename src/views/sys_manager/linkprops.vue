<route lang="yaml">
meta:
  title: 连接配置
</route>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import esprops from '@/api/modules/esprops'

const tableData = ref([])
const dialogFormVisible = ref(false)
const addConfForm = ref({
  name: '',
  version: '',
  address: '',
  username: '',
  password: '',
  selected: false,
})
const addConfLoading = ref(false)

onMounted(() => {
  // 在初始化的时候进行获取
  fetchData()
})

function fetchData() {
  esprops.getConf().then((res) => {
    // console.log(res)
    if (res.code === 0) {
      tableData.value = res.data
    }
    else {
      ElMessage.error(res.data)
    }
  }).catch((error) => {
    console.error(error)
    ElMessage.error('ES配置加载失败')
  })
}

function addConf() {
  // console.log(this.addConfForm)
  addConfLoading.value = true
  esprops.addConf(addConfForm.value).then((res) => {
    // console.log(res)
    if (res.code === 0) {
      ElMessage({
        message: '添加ES配置成功',
        type: 'success',
      })
      fetchData()
    }
    else {
      ElMessage.error(res.data)
    }
  }).catch((error) => {
    console.error(error)
    ElMessage.error('添加ES配置失败')
  })
  addConfLoading.value = false
  dialogFormVisible.value = false
}

function delConf(name: string) {
  esprops.delConf(name).then((res) => {
    if (res.code === 0) {
      ElMessage({
        message: '删除ES配置成功',
        type: 'success',
      })
      fetchData()
    }
    else {
      ElMessage.error(res.data)
    }
  }).catch((error) => {
    console.error(error)
    ElMessage.error('删除ES配置失败')
  })
}

function useConf(data) {
  // console.log(data)
  esprops.useConf(data).then((res) => {
    // console.log(res)
    if (res.code === 0) {
      ElMessage({
        message: '启用ES配置成功',
        type: 'success',
      })
      fetchData()
    }
    else {
      ElMessage.error(res.data)
    }
  }).catch((error) => {
    console.error(error)
    ElMessage.error('启用ES配置失败')
  })
}
</script>

<template>
  <div>
    <PageHeader>
      <el-button type="primary" size="default" @click="dialogFormVisible = true">
        新增
      </el-button>
      <el-dialog v-model="dialogFormVisible" title="新增配置" width="40%">
        <el-form label-position="right" label-width="auto" :model="addConfForm">
          <el-form-item label="配置名称">
            <el-input v-model="addConfForm.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="ES版本">
            <el-input v-model="addConfForm.version" autocomplete="off" />
          </el-form-item>
          <el-form-item label="连接地址">
            <el-input v-model="addConfForm.address" autocomplete="off" />
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="addConfForm.username" autocomplete="off" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="addConfForm.password" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">
              取消
            </el-button>
            <el-button type="primary" :loading="addConfLoading" @click="addConf()">
              提交
            </el-button>
          </div>
        </template>
      </el-dialog>
    </PageHeader>
    <PageMain>
      <el-table :data="tableData" style="width: 100%;" height="250">
        <el-table-column prop="name" label="配置名称" width="150" />
        <el-table-column prop="version" label="ES版本" width="150" />
        <el-table-column prop="address" label="连接地址" width="200" />
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="password" label="密码" width="150" />
        <el-table-column prop="selected" label="是否启用" width="150">
          <template #default="scope">
            <el-tag v-if="scope.row.selected" type="success">
              已启用
            </el-tag>
            <el-tag v-else type="danger">
              未启用
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button :disabled="scope.row.selected" type="primary" size="small" @click="useConf(scope.row)">
              启用
            </el-button>
            <el-button :disabled="scope.row.selected" type="danger" size="small" @click="delConf(scope.row.name)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </PageMain>
  </div>
</template>
