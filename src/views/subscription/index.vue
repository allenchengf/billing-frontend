<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
    </div>

    <el-table
      v-loading="isLoading"
      :data="list"
      element-loading-text="Loading"
      :border="true"
      fit
      highlight-current-row
    >
      <el-table-column :align="'center'" label="Index" width="60">
        <template #default="/** @type {ElTableScope<SubscriptionModel>} */scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Poc" width="100">
        <template #default="/** @type {ElTableScope<SubscriptionModel>} */scope">
          {{ scope.row.poc }}
        </template>
      </el-table-column>
      <el-table-column label="Description" width="110" :align="'center'">
        <template #default="/** @type {ElTableScope<SubscriptionModel>} */scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Product" width="110" :align="'center'">
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
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            Edit
          </el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleDelete(scope.row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="current_page" :limit.sync="per_page" @pagination="handleCurrentChange" />

    <el-dialog title="Create Subscription" :visible="dialog === 'create' || dialog === 'update'" @close="handleCancel">
      <el-form ref="form" :rules="rules" :model="model" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;" @submit="handleSubmit">
        <el-form-item label="Description" prop="description">
          <el-input v-model="model.description" />
        </el-form-item>
        <el-form-item label="Product" prop="product">
          <el-input v-model="model.product" />
        </el-form-item>
        <el-form-item label="Service ID" prop="service_id">
          <el-input v-model="model.service_id" />
        </el-form-item>
        <el-form-item label="POC" prop="poc">
          <el-input v-model="model.poc" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">
          Cancel
        </el-button>
        <el-button type="primary" native-type="submit" @click="handleSubmit">
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
import { isUndefined } from '@/utils/is'
import { createNow, parseTime } from '@/utils/datetime'
import { getSubscriptions } from '@/api/table'
import Pagination from '@/components/Pagination/index.vue'

/**
 * @typedef {import('@/models').SubscriptionModel} SubscriptionModel
 */
/**
 * @template T
 * @typedef {import('@/models').ElTableScope<T>} ElTableScope<T>
 */

/**
 * @typedef {Object} ComponentData
 * @property {SubscriptionModel[]} list
 * @property {Promise<any>[]} queue
 * @property {number} total
 * @property {number} current_page
 * @property {number} per_page
 * @property {'' | 'create' | 'update'} dialog
 * @property {SubscriptionModel} model
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

export default {
  components: {
    Pagination
  },
  /** @type {() => ComponentData} */
  data() {
    return {
      list: [],
      queue: [],
      total: 1,
      current_page: 1,
      per_page: 10,
      dialog: '',
      model: createDefaultSubscriptionModel(),
      rules: {}
    }
  },
  computed: {
    /** @return {boolean} */
    isLoading() {
      return this.queue.length
    }
  },
  watch: {
    $route() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
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
      // fetch data
      this.fetchData()
    },
    parseTime,
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
        page: info.page
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
      })
    },
    handleCreate() {
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        dialog: 'create'
      }})
    },
    /**
     * @param {SubscriptionModel} row
     */
    handleUpdate(row) {
      this.model = createSubscriptionModel(row)
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        dialog: 'update',
        id: row.id
      }})
    },
    handleCancel() {
      this.model = createSubscriptionModel()
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        id: undefined,
        dialog: undefined
      }})
    },
    handleSubmit(e) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.model.id === 0) {
            console.log('create')
          } else {
            console.log('update')
          }
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
        //
      }).catch(() => {
        //
      })
    }
  }
}
</script>
<style lang="scss">
.filter-container {
  margin-bottom: 16px;
}
</style>
