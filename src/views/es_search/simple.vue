<route lang="yaml">
meta:
  title: 简单查询
</route>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import VueJsonPretty from 'vue-json-pretty'
import essearch from '@/api/modules/essearch'
import 'vue-json-pretty/lib/styles.css'

const indicesData = ref([])
const mappingsData = ref([])
const selectedIndex = ref('')
// const selectedMapping = ref('')
const tableData = ref({
  total: 0,
  data: [],
})
const queryData = ref({
  pageSize: 10,
  currentPage: 1,
  queryJson: {},
  index: '',
})
const searchJsonVisible = ref(false)
const exportLoading = ref(false)
const searchJsonVisibleBeauty = ref(false)
const searchJsonTemp = ref({
  query: {
    bool: {},
  },
})
const searchJson = ref('')
const searchParamList = ref([{
  key: Date.now(),
  field: '',
  content: '',
  linkParam: '',
  searchType: '',
}])
const linkParams = ref([
  {
    label: '必须',
    value: 'must',
  },
  {
    label: '必须不',
    value: 'must_not',
  },
  {
    label: '过滤',
    value: 'filter',
  },
  {
    label: '应该',
    value: 'should',
  },
])
const searchTypes = ref([
  {
    label: '精确匹配',
    value: 'term',
  },
  {
    label: '分词匹配',
    value: 'match',
  },
  {
    label: '大于',
    value: 'gt',
  },
  {
    label: '小于',
    value: 'lt',
  },
  {
    label: '大于等于',
    value: 'gte',
  },
  {
    label: '小于等于',
    value: 'lte',
  },
])
interface SearchParam {
  key: number
  field: string
  content: string
  linkParam: string
  searchType: string
}

// onMounted(() => {
// 在初始化的时候进行获取
// getIndices()
// })

// 解析查询条件
watch([
  () => searchParamList,
], () => {
  if (searchParamList.value.length > 0) {
    const boolJson = {}
    const mustJson = []
    const mustNotJson = []
    const filterJson = []
    const shouldJson = []
    for (const item of searchParamList.value) {
      let searchBody = {}

      // 不同条件
      switch (item.searchType) {
        case 'term':
          searchBody[item.searchType] = {}
          searchBody[item.searchType][item.field] = {}
          searchBody[item.searchType][item.field] = { value: item.content }
          break
        case 'match':
          searchBody[item.searchType] = {}
          searchBody[item.searchType][item.field] = item.content
          break
        default:
          searchBody.range = {}
          searchBody.range[item.field] = {}
          searchBody.range[item.field][item.searchType] = item.content
          break
      }
      // nested
      const dotIdx = item.field.indexOf('.')
      if (dotIdx > -1) {
        const tmp = {
          nested: {
            path: item.field.substring(0, dotIdx),
            query: searchBody,
          },
        }
        searchBody = tmp
      }
      // 不同查询类型
      switch (item.linkParam) {
        case 'must':
          mustJson.push(searchBody)
          break
        case 'must_not':
          mustNotJson.push(searchBody)
          break
        case 'filter':
          filterJson.push(searchBody)
          break
        default:
          shouldJson.push(searchBody)
          break
      }
    }
    if (mustJson.length > 0) {
      boolJson.must = mustJson
    }
    if (mustNotJson.length > 0) {
      boolJson.must_not = mustNotJson
    }
    if (filterJson.length > 0) {
      boolJson.filter = filterJson
    }
    if (shouldJson.length > 0) {
      boolJson.should = shouldJson
    }
    searchJsonTemp.value.query.bool = boolJson
    searchJson.value = JSON.stringify(searchJsonTemp.value)
  }
  else {
    searchJsonTemp.value.query.bool = {}
    searchJson.value = JSON.stringify(searchJsonTemp.value)
  }
}, {
  immediate: true,
  deep: true,
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

function getMappings() {
  if (selectedIndex.value !== '') {
    essearch.getMappings(selectedIndex.value).then((res) => {
      // console.log(res)
      if (res.code === 0) {
        // ElMessage({
        //   message: '获取ES索引mappings成功',
        //   type: 'success',
        // })
        mappingsData.value = res.data
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

function addSearchParam() {
  if (indicesData.value.length === 0) {
    ElMessage({
      message: '未加载索引',
      type: 'warning',
    })
  }
  else if (mappingsData.value.length === 0) {
    ElMessage({
      message: '未加载索引字段',
      type: 'warning',
    })
  }
  else {
    searchParamList.value.push({
      key: Date.now(),
      field: '',
      content: '',
      linkParam: '',
      searchType: '',
    })
  }
}

function removeSearchParam(item: SearchParam) {
  const index = searchParamList.value.indexOf(item)
  if (index !== -1) {
    searchParamList.value.splice(index, 1)
  }
}

function changePage(currentPage: number) {
  queryData.value.currentPage = currentPage
  searchData()
}

function searchData() {
  if (indicesData.value.length === 0) {
    ElMessage({
      message: '未加载索引',
      type: 'warning',
    })
  }
  else if (mappingsData.value.length === 0) {
    ElMessage({
      message: '未加载索引字段',
      type: 'warning',
    })
  }
  else {
    queryData.value.queryJson = searchJsonTemp.value
    queryData.value.index = selectedIndex.value
    essearch.queryES(queryData.value).then((res) => {
      // console.log(res)
      if (res.code === 0) {
        // ElMessage({
        //   message: 'ES查询成功',
        //   type: 'success',
        // })
        tableData.value.data = res.data.data
        tableData.value.total = res.data.total
      }
      else {
        ElMessage.error(res.data)
      }
    }).catch((error) => {
      console.error(error)
      ElMessage.error('ES查询失败')
    })
  }
}

function exportData() {
  if (indicesData.value.length === 0) {
    ElMessage({
      message: '未加载索引',
      type: 'warning',
    })
  }
  else if (mappingsData.value.length === 0) {
    ElMessage({
      message: '未加载索引字段',
      type: 'warning',
    })
  }
  else {
    exportLoading.value = true
    queryData.value.queryJson = searchJsonTemp.value
    queryData.value.index = selectedIndex.value
    essearch.exportES(queryData.value).then((res) => {
      // console.log(exportLoading.value)
      if (res.code === 0) {
        // ElMessage({
        //   message: 'ES查询成功',
        //   type: 'success',
        // })
        ElMessageBox.alert(res.msg, '导出通知', {
          // if you want to disable its autofocus
          // autofocus: false,
          confirmButtonText: '确定',
        })
      }
      else {
        ElMessage.error(res.data)
      }
      exportLoading.value = false
    }).catch((error) => {
      console.error(error)
      exportLoading.value = false
      ElMessage.error('ES导出失败')
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
          style="width: 240px;"
          @change="getMappings"
        >
          <el-option
            v-for="item in indicesData"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <!-- <el-tree-select
          v-model="selectedMapping"
          :data="mappingsData"
          :render-after-expand="false"
          filterable
          placeholder="选择索引字段"
          style="width: 240px"
        /> -->
        <el-button type="primary" size="default" @click="getIndices">
          加载索引
        </el-button>
      </el-space>
    </PageHeader>
    <PageMain>
      <el-divider content-position="left">
        查询条件 <el-switch v-model="searchJsonVisible" />  <el-switch v-model="searchJsonVisibleBeauty" />
      </el-divider>
      <el-row :gutter="20">
        <el-col :span="14">
          <div class="grid-content ep-bg-purple" />
          <el-form
            label-width="auto"
            class="demo-dynamic"
          >
            <el-form-item
              v-for="searchParamItem in searchParamList"
              :key="searchParamItem.key"
            >
              <el-space wrap>
                <el-tree-select
                  v-model="searchParamItem.field"
                  :data="mappingsData"
                  :render-after-expand="false"
                  filterable
                  placeholder="索引字段"
                  style="width: 200px;"
                />
                <el-select
                  v-model="searchParamItem.linkParam"
                  placeholder="查询类型"
                  style="width: 120px;"
                >
                  <el-option
                    v-for="item in linkParams"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-select
                  v-model="searchParamItem.searchType"
                  placeholder="查询条件"
                  :option="searchTypes"
                  style="width: 120px;"
                >
                  <el-option
                    v-for="item in searchTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-input v-model="searchParamItem.content" />
                <el-button type="danger" :icon="Delete" circle @click.prevent="removeSearchParam(searchParamItem)" />
              </el-space>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-show="searchJsonVisible" :span="10">
          <!-- <div class="grid-content ep-bg-purple" /> -->
          <VueJsonPretty v-show="searchJsonVisibleBeauty" :data="searchJsonTemp" />
          <el-input
            v-show="!searchJsonVisibleBeauty"
            v-model="searchJson"
            style="width: 90%;"
            type="textarea"
            show-word-limit
            autosize
            readonly
          />
        </el-col>
      </el-row>
      <el-divider content-position="left">
        操作 <el-text class="mx-1" type="warning">
          查询限制1000条，导出限制10000条。
        </el-text>
      </el-divider>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="grid-content ep-bg-purple" />
          <el-button type="primary" @click.prevent="addSearchParam">
            新增条件
          </el-button>
          <el-button type="primary" @click.prevent="searchData">
            查询
          </el-button>
          <el-button type="primary" :loading="exportLoading" @click.prevent="exportData">
            导出
          </el-button>
        </el-col>
      </el-row>
      <el-divider content-position="left">
        查询结果 <el-text class="mx-1" type="warning">
          共 {{ tableData.total }} 条
        </el-text>
      </el-divider>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-table :data="tableData.data" style="width: 100%;" height="400">
            <template v-for="(item, idx) in mappingsData" :key="idx">
              <el-table-column :prop="item.value" :label="item.label" show-overflow-tooltip />
            </template>
          </el-table>
          <el-pagination
            background
            layout="total, prev, pager, next"
            :page-size="queryData.pageSize"
            :current-page="queryData.currentPage"
            :page-count="100"
            :total="tableData.total"
            @current-change="changePage"
          />
        </el-col>
      </el-row>
    </PageMain>
  </div>
</template>
