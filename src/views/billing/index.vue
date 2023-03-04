<template>
  <div class="app-container">

    <div class="filter-container">
      <div class="el-input" style="width: 200px;margin-right: 10px;">
        <el-input
          v-model="search"
          placeholder="search"
        >
          <i slot="prefix" class="el-input__icon el-icon-search" />
        </el-input>
      </div>
      <el-button class="filter-item" type="primary" icon="el-icon-download">
        Download
      </el-button>
    </div>

    <el-table
      v-loading="isLoading"
      :data="tables"
      element-loading-text="Loading"
      :border="true"
      fit
      highlight-current-row
      :default-sort="{prop: 'billing_cycle', order: 'descending'}"
    >
      <el-table-column label="Actions" :align="'center'" width="180" class-name="small-padding fixed-width">
        <template #default="/** @type {ElTableScope<CustomerModel>} */scope">
          <el-button type="primary" icon="el-icon-picture" />
        </template>
      </el-table-column>
      <el-table-column :align="'center'" label="" width="60">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Billing ID" width="140" sortable prop="billing_id">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          {{ scope.row.billing_id }}
        </template>
      </el-table-column>
      <el-table-column label="Charging Order" width="150" sortable prop="order">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          {{ scope.row.order }}
        </template>
      </el-table-column>
      <el-table-column label="Customer ID" width="150" :align="'center'" sortable prop="customer_id">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          {{ scope.row.customer_id }}
        </template>
      </el-table-column>
      <el-table-column label="Service ID" width="120" :align="'center'" sortable prop="service_id">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          {{ scope.row.service_id }}
        </template>
      </el-table-column>
      <el-table-column label="Billing Cycle" width="150" :align="'center'" sortable prop="billing_cycle">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          {{ scope.row.billing_cycle }}
        </template>
      </el-table-column>
      <el-table-column label="Prefix for Charging" width="180" :align="'center'" sortable prop="prefixes_show">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          {{ scope.row.prefixes_show }}
        </template>
      </el-table-column>
      <el-table-column label="98H%(bps)" width="140" :align="'center'" sortable prop="percentile_98_h_show">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          <span>{{ scope.row.percentile_98_h_show }}</span>
        </template>
      </el-table-column>
      <el-table-column label="98HM%(bps)" width="140" :align="'center'" sortable prop="percentile_98_hm_show">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          <span>{{ scope.row.percentile_98_hm_show }}</span>
        </template>
      </el-table-column>
      <el-table-column label="98%(bps)" width="140" :align="'center'" sortable prop="percentile_98_show">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          <span>{{ scope.row.percentile_98_show }}</span>
        </template>
      </el-table-column>
      <el-table-column label="98M%(bps)" width="140" :align="'center'" sortable prop="percentile_98_m_show">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          <span>{{ scope.row.percentile_98_m_show }}</span>
        </template>
      </el-table-column>
      <el-table-column label="98%" width="140" :align="'center'" sortable prop="percentile_mbps_98">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          <span>{{ scope.row.percentile_mbps_98 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="CIR" width="80" :align="'center'" sortable prop="cir">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          <span>{{ scope.row.cir }}</span>
        </template>
      </el-table-column>
      <el-table-column label="PIR" width="80" :align="'center'" sortable prop="pir">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          <span>{{ scope.row.pir }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Excess Burst" width="140" :align="'center'" sortable prop="burst">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          <span>{{ scope.row.burst }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Sales Tag" width="120" :align="'center'" sortable prop="sales_tag">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          <span>{{ scope.row.sales_tag }}</span>
        </template>
      </el-table-column>
      <el-table-column :align="'center'" prop="updated_at" label="Updated At" width="200" sortable>
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          <i class="el-icon-time" />
          <span>{{ parseTime(scope.row.updated_at, 'YYYY/MM/DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" :align="'center'" width="180" class-name="small-padding fixed-width">
        <template #default="/** @type {ElTableScope<BillingSummaryModel>} */scope">
          <el-button type="primary" size="mini" @click="openUpdateModal(scope.row)">
            Edit
          </el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleDelete(scope.row)">
            Delete
          </el-button>
        </template>
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
  getBillingSummary,
  putBillingSummary,
  deleteBillingSummary
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
      search: '',
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
    },
    tables() {
      const search = this.search
      if (search) {
        return this.displayList.filter(function(dataNews) {
          return Object.keys(dataNews).some(function(key) {
            return String(dataNews[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
          })
        })
      }
      return this.displayList
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
      const req = getBillingSummary()
      this.addQueue(req)
      return req.then(response => {
        this.list = response.data
        this.list.forEach((item) => {
          item['percentile_98_h_show'] = this.dealNumber(`${item['percentile_98_h'] == null ? 0 : item['percentile_98_h']}`)
          item['percentile_98_hm_show'] = this.dealNumber(`${item['percentile_98_hm'] == null ? 0 : item['percentile_98_hm']}`)
          item['percentile_98_show'] = this.dealNumber(`${item['percentile_98'] == null ? 0 : item['percentile_98']}`)
          item['percentile_98_m_show'] = this.dealNumber(`${item['percentile_98_m'] == null ? 0 : item['percentile_98_m']}`)
          item['burst'] = this.dealNumber(`${item['percentile_mbps_98'] > item['cir'] ? item['percentile_mbps_98'] - item['cir'] : 0}`)
          item['billing_cycle'] = `${item['year']}-${this.right('0' + item['month'], 2)}`
          item['prefixes_show'] = item['prefixes'] == null ? '' : String(item['prefixes']).replace('[', '').replace(']', '').replaceAll(',', '\n')
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
      return str.substring(str.length - num, str.length)
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
