<template>
  <div class="app-container">
    <el-table
      v-loading="isLoading"
      :data="displayList"
      element-loading-text="Loading"
      :border="true"
      fit
      highlight-current-row
    >
      <el-table-column :align="'center'" label="" width="60">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Billing Cycle" width="120" :align="'center'">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          {{ scope.row.billing_cycle }}
        </template>
      </el-table-column>
      <el-table-column label="Group Name" width="130">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          {{ scope.row.group_name }}
        </template>
      </el-table-column>
      <el-table-column label="Sequence" width="130">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          {{ scope.row.sequence }}
        </template>
      </el-table-column>
      <el-table-column label="Billing List" width="170" :align="'center'">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          {{ scope.row.prefixes_list_show }}
        </template>
      </el-table-column>
      <el-table-column label="98H%(bps)" width="120" :align="'center'">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          <span>{{ scope.row.percentile_98_h }}</span>
        </template>
      </el-table-column>
      <el-table-column label="98HM%(bps)" width="120" :align="'center'">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          <span>{{ scope.row.percentile_98_hm }}</span>
        </template>
      </el-table-column>
      <el-table-column label="98%(bps)" width="120" :align="'center'">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          <span>{{ scope.row.percentile_98 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="98M%(bps)" width="120" :align="'center'">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          <span>{{ scope.row.percentile_98_m }}</span>
        </template>
      </el-table-column>
      <el-table-column label="98%" width="80" :align="'center'">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          <span>{{ scope.row.percentile_mbps_98 }}</span>
        </template>
      </el-table-column>
      <el-table-column :align="'center'" prop="updated_at" label="Updated At" width="200">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          <i class="el-icon-time" />
          <span>{{ parseTime(scope.row.updated_at, 'YYYY/MM/DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" :align="'center'" class-name="small-padding fixed-width">
<!--        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">-->
<!--          <el-button type="primary" size="mini" @click="openUpdateModal(scope.row)">-->
<!--            Edit-->
<!--          </el-button>-->
<!--          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleDelete(scope.row)">-->
<!--            Delete-->
<!--          </el-button>-->
<!--        </template>-->
      </el-table-column>
    </el-table>

    <pagination v-if="total > 0" :total="total" :page.sync="page" :limit.sync="perPage" @pagination="handleCurrentChange" />

    <el-dialog title="Edit Billing Summary" :visible="dialog === 'create' || dialog === 'update'" @close="handleCancel">
      <el-form ref="form" :rules="rules" :model="model" label-position="left" label-width="160px" style="width: 400px; margin-left:50px;" @submit="onSubmit">
        <el-form-item label="98%" prop="percentile_mbps_98">
          <el-input v-model="model.percentile_mbps_98" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelModal">
          Cancel
        </el-button>
        <el-button type="primary" native-type="submit" @click="onSubmit">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog v-if="dialog === 'update'" key="update">
      <div>update</div>
    </el-dialog>
  </div>
</template>

<script>
/** @typedef {import('@/models').BillingSummaryModel} BillingSummaryModel */
/** @template T @typedef {import('@/models').ElTableScope<T>} ElTableScope<T> */
/** @template T @typedef {T extends Record<string, infer R> ? R : unknown} EnumValue */
/** @typedef {import('@/types/validator').Rule} Rule */
import { isUndefined } from '@/utils/is'
import { chunk } from '@/utils/helper'
import { createNow, parseTime } from '@/utils/datetime'
import {
  getBillingSummaryAggregates
} from '@/api/table'
import Pagination from '@/components/Pagination/index.vue'

/**
 * @typedef {Object} ComponentData
 * @property {BillingSummaryModel[]} list
 * @property {Promise<any>[]} queue
 * @property {number} total
 * @property {number} page
 * @property {number} perPage
 * @property {'' | 'create' | 'update'} dialog
 * @property {BillingSummaryModel} model
 * @property {{ [ K in keyof BillingSummaryModel]: Rule[] }} rules
 * @property {EnumValue<typeof PropertyOptions>[]} propertyOptions
 */

/**
 * @return {BillingSummaryModel}
 */
function createDefaultBillingSummaryModel() {
  return {
    id: 0,
    percentile_mbps_98: '',
    created_at: createNow(),
    updated_at: createNow()
  }
}

/**
 * @param {Partial<BillingSummaryModel>} model
 * @return {BillingSummaryModel}
 */
function createBillingSummaryModel(model) {
  const defaultModel = createDefaultBillingSummaryModel()
  if (model) {
    if (isUndefined(model.percentile_mbps_98)) model.percentile_mbps_98 = defaultModel.percentile_mbps_98
    return model
  }
  return defaultModel
}

const defaultSettings = {
  page: 1,
  perPage: 10
}

export default {
  components: {
    Pagination
  },
  /** @type {() => ComponentData} */
  data() {
    return {
      list: [],
      queue: [],
      page: defaultSettings.page,
      perPage: defaultSettings.perPage,
      dialog: '',
      model: createDefaultBillingSummaryModel(),
      rules: {
        percentile_mbps_98: [{ required: false }]
      }
    }
  },
  computed: {
    /** @return {boolean} */
    isLoading() {
      return this.queue.length
    },
    /** @return {BillingSummaryModel[]} */
    displayList() {
      return chunk(this.list, this.perPage)[this.page - 1]
    },
    /** @return {number} */
    total() {
      return this.list.length
    }
  },
  watch: {
    $route() {
      this.init()
    }
  },
  async created() {
    this.fetchData()
    this.init()
  },
  methods: {
    parseTime,
    init() {
      const { query } = this.$route
      if (query.dialog) {
        if (Array.isArray(query.dialog)) {
          const [dialog] = query.dialog
          this.dialog = dialog
        } else {
          this.dialog = query.dialog
        }
      } else {
        this.dialog = ''
      }
      if (query.page) {
        this.page = Number(query.page) || defaultSettings.page
      }
      if (query.per_page) {
        this.perPage = Number(query.per_page) || defaultSettings.perPage
      }
    },
    /**
     * @param {Promise<any>} req
     */
    addQueue(req) {
      this.queue = [...this.queue, req]
    },
    /**
     * @param {Promise<any>} req
     */
    removeQueue(req) {
      this.queue = this.queue.filter(p => p !== req)
    },
    /**
     * @param {{ page: number; limit: number; }} info
     */
    handleCurrentChange(info) {
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        page: info.page === defaultSettings.page ? undefined : info.page,
        per_page: info.limit === defaultSettings.perPage ? undefined : info.limit
      }})
    },
    /**
     * @return {Promise<void>}
     */
    fetchData() {
      const req = getBillingSummaryAggregates()
      this.addQueue(req)
      return req.then(response => {
        this.list = response.data
        this.list.forEach((item) => {
          item['billing_cycle'] = `${item['year']}-${this.right('0' + item['month'], 2)}`
          item['prefixes_list_show'] = item['billing_list'] == null ? '' : String(item['billing_list']).replace('[', '').replace(']', '').replaceAll(',', '\n')
        })
        this.removeQueue(req)
      }).then(() => {
        const { query } = this.$route
        if (query.id) {
          const id = Number(query.id)
          const model = this.list.find((p) => id === p.id)
          if (model) {
            this.model = createBillingSummaryModel(model)
          } else {
            this.cancelModal()
          }
        }
      })
    },
    dealNumber(money) {
      if (money && money !== 'null') {
        money = String(money)
        const left = money.split('.')[0]; let right = money.split('.')[1]
        right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : ''
        const temp = left.split('').reverse().join('').match(/(\d{1,3})/g)
        return (Number(money) < 0 ? '-' : '') + temp.join(',').split('').reverse().join('') + right
      } else if (money === 0) {
        return '0'
      } else {
        return ''
      }
    },
    right(str, num) {
      return str.substring(str.length-num,str.length)
    },
    openCreateModal() {
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        dialog: 'create'
      }})
    },
    /**
     * @param {BillingSummaryModel} row
     */
    openUpdateModal(row) {
      this.model = createBillingSummaryModel(row)
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        dialog: 'update',
        id: row.id
      }})
    },
    cancelModal() {
      this.model = createBillingSummaryModel()
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        id: undefined,
        dialog: undefined
      }})
    },
    handleCancel() {
      this.model = createBillingSummaryModel()
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        id: undefined,
        dialog: undefined
      }})
    },
    async handleSubmit() {
      const form = {
        percentile_mbps_98: this.model.percentile_mbps_98
      }
      try {
        const notifyOptions = {
          title: 'Success',
          message: '',
          type: 'success',
          duration: 2000
        }
        await putBillingSummary(this.model.id, form)
        this.fetchData()
        notifyOptions.message = 'Update Successfully'
        this.cancelModal()
        this.$notify(notifyOptions)
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
          duration: 2000
        })
      }
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.handleSubmit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * @param {BillingSummaryModel} row
     */
    handleDelete(row) {
      this.$confirm('Are you sure you want to delete this?', 'confirm', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        return deleteBillingSummary(row.id)
          .then(() => {
            this.cancelModal()
            this.fetchData()
            this.$notify({
              title: 'Success',
              message: 'Delete Successfully',
              type: 'success',
              duration: 2000
            })
          }).catch((error) => {
            this.$notify({
              title: 'Error',
              message: error.message,
              type: 'error',
              duration: 2000
            })
          })
      })
        .catch(() => Promise.resolve())
    }
  }
}
</script>
<style lang="scss">
.filter-container {
  margin-bottom: 16px;
}

.app-container{
  .el-table{
    .cell {
      white-space: pre-line;
    }
  }
}
</style>
