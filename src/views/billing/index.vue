<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="openCreateModal">
        Add
      </el-button>
    </div>

    <el-table
      v-loading="isLoading"
      :data="displayList"
      element-loading-text="Loading"
      :border="true"
      fit
      highlight-current-row
    >
      <el-table-column :align="'center'" label="" width="60">
        <template #default="/** @type {ElTableScope<PageModel>} */scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="BW Prefix ID" width="120">
        <template #default="/** @type {ElTableScope<PageModel>} */scope">
          {{ scope.row.bw_prefix_id }}
        </template>
      </el-table-column>
      <el-table-column label="Service" width="120" :align="'center'">
        <template #default="/** @type {ElTableScope<PageModel>} */scope">
          {{ scope.row.service_id }}
        </template>
      </el-table-column>
      <el-table-column label="Customer" width="120" :align="'center'">
        <template #default="/** @type {ElTableScope<PageModel>} */scope">
          {{ scope.row.customer_id }}
        </template>
      </el-table-column>
      <el-table-column label="CIR">
        <template #default="/** @type {ElTableScope<PageModel>} */scope">
          <span>{{ scope.row.cir }}</span>
        </template>
      </el-table-column>
      <el-table-column label="PIR">
        <template #default="/** @type {ElTableScope<PageModel>} */scope">
          <span>{{ scope.row.pir }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Sensors">
        <template #default="/** @type {ElTableScope<PageModel>} */scope">
          <span>{{ scope.row.sensors.length }}</span>
        </template>
      </el-table-column>
      <el-table-column :align="'center'" prop="created_at" label="Created At" width="200">
        <template #default="/** @type {ElTableScope<PageModel>} */scope">
          <i class="el-icon-time" />
          <span>{{ parseTime(scope.row.provision_at, 'YYYY/MM/DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column :align="'center'" prop="updated_at" label="Updated At" width="200">
        <template #default="/** @type {ElTableScope<PageModel>} */scope">
          <i class="el-icon-time" />
          <span>{{ parseTime(scope.row.terminated_at, 'YYYY/MM/DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" :align="'center'" width="180" class-name="small-padding fixed-width">
        <template #default="/** @type {ElTableScope<PageModel>} */scope">
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

    <el-dialog title="Billing" :visible="dialog === 'create' || dialog === 'update'" @close="handleCancel">
      <el-form ref="form" :rules="rules" :model="model" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;" @submit="onSubmit">
        <el-form-item label="BW Prefix ID" prop="bw_prefix_id">
          <el-input v-model="model.bw_prefix_id" />
        </el-form-item>
        <el-form-item label="Service ID" prop="service_id">
          <el-select v-model="model.service_id" filterable placeholder="Please select">
            <el-option key="0" value="" label="Please select" disabled />
            <el-option
              v-for="item in subscriptionOptions"
              :key="item.service_id"
              :label="item.service_id"
              :value="item.service_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Customer" prop="customer_id">
          <el-select v-model="model.customer_id" filterable placeholder="Please select">
            <el-option key="0" :value="0" label="Please select" disabled />
            <el-option
              v-for="item in customerOptions"
              :key="item.id"
              :label="item.customer_name"
              :value="item.id"
            />
          </el-select>
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

    <el-dialog v-if="dialog === 'update'" :key="model.id">
      <div>update</div>
    </el-dialog>
  </div>
</template>

<script>
/** @typedef {import('@/models').BillingModel} PageModel */
/** @typedef {import('@/models').CustomerModel} CustomerModel */
/** @typedef {import('@/models').SubscriptionModel} SubscriptionModel */
/** @typedef {import('@/models').SensorChannels} SensorChannels */
/** @template T @typedef {import('@/types/element-ui').ElTableScope<T>} ElTableScope<T> */
import { getBilling, getCustomers, getSubscriptions, postBilling, putBilling, deleteBilling } from '@/api/table'
import { isUndefined } from '@/utils/is'
import { createNow, parseTime } from '@/utils/datetime'
import { chunk } from '@/utils/helper'
import Pagination from '@/components/Pagination/index.vue'

const apiGetModel = getBilling
const apiPostModel = postBilling
const apiPutModel = putBilling
const apiDeleteModel = deleteBilling

/**
  * @return {PageModel}
  */
function createDefaultModel() {
  return {
    id: 0,
    customer_id: 0,
    service_id: '',
    bw_prefix_id: '',
    cir: 0,
    pir: 0,
    provision_at: createNow(),
    terminated_at: createNow(),
    sensors: []
  }
}

/**
  * @param {Partial<PageModel>} model
  * @return {PageModel}
  */
function createModel(model) {
  const defaultModel = createDefaultModel()
  if (model) {
    if (isUndefined(model.id)) model.id = defaultModel.id
    if (isUndefined(model.bw_prefix_id)) model.bw_prefix_id = defaultModel.bw_prefix_id
    if (isUndefined(model.cir)) model.cir = defaultModel.cir
    if (isUndefined(model.pir)) model.pir = defaultModel.pir
    if (isUndefined(model.service_id)) model.service_id = defaultModel.service_id
    if (isUndefined(model.customer_id)) model.customer_id = defaultModel.customer_id
    if (isUndefined(model.provision_at)) model.provision_at = defaultModel.provision_at
    if (isUndefined(model.terminated_at)) model.terminated_at = defaultModel.terminated_at
    if (isUndefined(model.sensors)) model.sensors = defaultModel.sensors
    return model
  }
  return defaultModel
}

/**
 * @typedef {Object} ComponentData
 * @property {PageModel[]} list
 * @property {Promise<any>[]} queue
 * @property {number} total
 * @property {number} page
 * @property {number} perPage
 * @property {'' | 'create' | 'update'} dialog
 * @property {PageModel} model
 * @property {{ [ K in keyof PageModel]: Rule[] }} rules
 * @property {{ [k: string]: CustomerModel }} customers
 * @property {{ [k: string]: PageModel }} subscriptions
 */

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
      model: createDefaultModel(),
      rules: {
        bw_prefix_id: [{ required: false }],
        service_id: [{ required: true }],
        customer_id: [{ required: true }]
      },
      customers: {},
      subscriptions: {}
    }
  },
  computed: {
    /** @return {boolean} */
    isLoading() {
      return this.queue.length
    },
    /** @return {PageModel[]} */
    displayList() {
      return chunk(this.list, this.perPage)[this.page - 1]
    },
    /** @return {number} */
    total() {
      return this.list.length
    },
    /** @return {CustomerModel[]} */
    customerOptions() {
      return Object.values(this.customers)
    },
    /** @return {SubscriptionModel[]} */
    subscriptionOptions() {
      return Object.values(this.subscriptions)
    }
  },
  watch: {
    $route() {
      this.init()
    }
  },
  async created() {
    this.fetchCustomers()
    this.fetchSubscriptions()
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
      const req = apiGetModel()
      this.addQueue(req)
      return req.then(response => {
        this.list = response.data
        this.removeQueue(req)
      }).then(() => {
        const { query } = this.$route
        if (query.id) {
          const id = Number(query.id)
          const model = this.list.find((p) => id === p.id)
          if (model) {
            this.model = createModel(model)
          } else {
            this.cancelModal()
          }
        }
      })
    },
    /**
     * @return {Promise<void>}
     */
    fetchCustomers() {
      return getCustomers().then(response => {
        response.data.forEach(item => {
          this.customers[item.id] = item
        })
        this.customers = { ...this.customers }
      })
    },
    /**
     * @return {Promise<void>}
     */
    fetchSubscriptions() {
      return getSubscriptions().then(response => {
        response.data.forEach(item => {
          this.subscriptions[item.id] = item
        })
        this.subscriptions = { ...this.subscriptions }
      })
    },
    openCreateModal() {
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        dialog: 'create'
      }})
    },
    /**
     * @param {PageModel} row
     */
    openUpdateModal(row) {
      this.model = createModel(row)
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        dialog: 'update',
        id: row.id
      }})
    },
    cancelModal() {
      this.model = createModel()
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        id: undefined,
        dialog: undefined
      }})
    },
    handleCancel() {
      this.model = createModel()
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        id: undefined,
        dialog: undefined
      }})
    },
    async handleSubmit() {
      const form = {
        customer_id: this.model.customer_id,
        description: this.model.description,
        product: this.model.product,
        service_id: this.model.service_id,
        status: this.model.status
      }
      try {
        const notifyOptions = {
          title: 'Success',
          message: '',
          type: 'success',
          duration: 2000
        }
        if (this.model.id === 0) {
          await apiPostModel(form)
          notifyOptions.message = 'Create Successfully'
          this.fetchData()
        } else {
          await apiPutModel(this.model.id, form)
          notifyOptions.message = 'Update Successfully'
          this.fetchData()
        }
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
     * @param {PageModel} row
     */
    handleDelete(row) {
      this.$confirm('Are you sure you want to delete this?', 'confirm', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        return apiDeleteModel(row.id)
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
    },
    /**
     * @param {SensorChannels[]} sensors
     * @return {string}
     */
    getSensorDisplay(sensors) {
      return sensors.map(p => p.prefix).join('')
    }
  }
}
</script>
