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
        <template #default="/** @type {ElTableScope<SubscriptionModel>} */scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Poc">
        <template #default="/** @type {ElTableScope<SubscriptionModel>} */scope">
          {{ scope.row.poc }}
        </template>
      </el-table-column>
      <el-table-column label="Description">
        <template #default="/** @type {ElTableScope<SubscriptionModel>} */scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Product" width="100">
        <template #default="/** @type {ElTableScope<SubscriptionModel>} */scope">
          {{ scope.row.product }}
        </template>
      </el-table-column>
      <el-table-column label="Service" width="110" :align="'center'">
        <template #default="/** @type {ElTableScope<SubscriptionModel>} */scope">
          {{ scope.row.service_id }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" :align="'center'">
        <template #default="/** @type {ElTableScope<SubscriptionModel>} */scope">
          <el-tag :type="statusType(scope.row.status)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :align="'center'" prop="created_at" label="Created At" width="200">
        <template #default="/** @type {ElTableScope<SubscriptionModel>} */scope">
          <i class="el-icon-time" />
          <span>{{ parseTime(scope.row.created_at, 'YYYY/MM/DD hh:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column :align="'center'" prop="updated_at" label="Updated At" width="200">
        <template #default="/** @type {ElTableScope<SubscriptionModel>} */scope">
          <i class="el-icon-time" />
          <span>{{ parseTime(scope.row.updated_at, 'YYYY/MM/DD hh:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" :align="'center'" width="180" class-name="small-padding fixed-width">
        <template #default="/** @type {ElTableScope<SubscriptionModel>} */scope">
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

    <el-dialog title="Create Subscription" :visible="dialog === 'create' || dialog === 'update'" @close="handleCancel">
      <el-form ref="form" :rules="rules" :model="model" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;" @submit="onSubmit">
        <el-form-item label="Customer" prop="customer_id">
          <el-input v-model="model.customer_id" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="model.description" />
        </el-form-item>
        <el-form-item label="Product" prop="product">
          <el-select v-model="model.product" class="filter-item" placeholder="Please select">
            <el-option v-for="item in productOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Service ID" prop="service_id">
          <el-input v-model="model.service_id" />
        </el-form-item>
        <el-form-item label="POC" prop="poc">
          <el-input v-model="model.poc" />
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
/** @typedef {import('@/models').SubscriptionModel} SubscriptionModel */
/** @template T @typedef {import('@/models').ElTableScope<T>} ElTableScope<T> */
/** @template T @typedef {T extends Record<string, infer R> ? R : unknown} EnumValue */
/** @typedef {import('@/types/validator').Rule} Rule */
import { isUndefined } from '@/utils/is'
import { chunk } from '@/utils/helper'
import { createNow, parseTime } from '@/utils/datetime'
import { getSubscriptions, postSubscriptions, putSubscriptions, deleteSubscriptions } from '@/api/table'
import Pagination from '@/components/Pagination/index.vue'

/**
 * @typedef {Object} ComponentData
 * @property {SubscriptionModel[]} list
 * @property {Promise<any>[]} queue
 * @property {number} total
 * @property {number} page
 * @property {number} perPage
 * @property {'' | 'create' | 'update'} dialog
 * @property {SubscriptionModel} model
 * @property {{ [ K in keyof SubscriptionModel]: Rule[] }} rules
 * @property {EnumValue<typeof ProductOptions>[]} productOptions
 */

/**
  * @return {SubscriptionModel}
  */
function createDefaultSubscriptionModel() {
  return {
    id: 0,
    customer_id: 0,
    product: '',
    service_id: '',
    poc: '',
    status: '',
    description: '',
    created_at: createNow(),
    updated_at: createNow()
  }
}

/**
  * @param {Partial<SubscriptionModel>} model
  * @return {SubscriptionModel}
  */
function createSubscriptionModel(model) {
  const defaultModel = createDefaultSubscriptionModel()
  if (model) {
    if (isUndefined(model.id)) model.id = defaultModel.id
    if (isUndefined(model.poc)) model.poc = defaultModel.poc
    if (isUndefined(model.description)) model.description = defaultModel.description
    if (isUndefined(model.product)) model.product = defaultModel.product
    if (isUndefined(model.service_id)) model.service_id = defaultModel.service_id
    if (isUndefined(model.status)) model.status = defaultModel.status
    if (isUndefined(model.customer_id)) model.customer_id = defaultModel.customer_id
    if (isUndefined(model.created_at)) model.created_at = defaultModel.created_at
    if (isUndefined(model.updated_at)) model.updated_at = defaultModel.updated_at
    return model
  }
  return defaultModel
}

const statusMap = {
  published: 'success',
  draft: 'gray',
  deleted: 'danger'
}

/**
 * @enum {string}
 */
const ProductOptions = {
  /** @type {'Production1'} */
  PROD1: 'Production1',
  /** @type {'Production2'} */
  PROD2: 'Production2',
  /** @type {'Production3'} */
  PROD3: 'Production3',
  /** @type {'Production4'} */
  PROD4: 'Production4'
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
      model: createDefaultSubscriptionModel(),
      rules: {
        description: [{ required: true }],
        product: [{ required: true }],
        service_id: [{ required: true }],
        poc: [{ required: true }]
      },
      productOptions: Object.values(ProductOptions)
    }
  },
  computed: {
    /** @return {boolean} */
    isLoading() {
      return this.queue.length
    },
    /** @return {SubscriptionModel[]} */
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
     * @param {keyof typeof statusMap} status
     * @return {string}
     */
    statusType(status) {
      return statusMap[status]
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
      const req = getSubscriptions()
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
            this.model = createSubscriptionModel(model)
          } else {
            this.cancelModal()
          }
        }
      })
    },
    openCreateModal() {
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        dialog: 'create'
      }})
    },
    /**
     * @param {SubscriptionModel} row
     */
    openUpdateModal(row) {
      this.model = createSubscriptionModel(row)
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        dialog: 'update',
        id: row.id
      }})
    },
    cancelModal() {
      this.model = createSubscriptionModel()
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
        poc: this.model.poc,
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
          await postSubscriptions(form)
          notifyOptions.message = 'Create Successfully'
        } else {
          await putSubscriptions(this.model.id, form)
          notifyOptions.message = 'Update Successfully'
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
     * @param {SubscriptionModel} row
     */
    handleDelete(row) {
      this.$confirm('Are you sure you want to delete this?', 'confirm', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        return deleteSubscriptions(row.id)
          .then(() => {
            this.cancelModal()
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
</style>
