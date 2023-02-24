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
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="openCreateModal">
        Add
      </el-button>
    </div>

    <el-table
      v-loading="isLoading"
      :data="tables"
      element-loading-text="Loading"
      :border="true"
      fit
      highlight-current-row
      :default-sort="{prop: 'customer_id', order: 'descending'}"
    >
      <el-table-column :align="'center'" label="" width="60">
        <template #default="/** @type {ElTableScope<CustomerModel>} */scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Customer Name" width="170" sortable prop="customer_name">
        <template #default="/** @type {ElTableScope<CustomerModel>} */scope">
          {{ scope.row.customer_name }}
        </template>
      </el-table-column>
      <el-table-column label="Customer ID" width="170" :align="'center'" sortable prop="customer_id">
        <template #default="/** @type {ElTableScope<CustomerModel>} */scope">
          {{ scope.row.customer_id }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Customer Property" width="180" :align="'center'" sortable prop="customer_property">
        <template #default="/** @type {ElTableScope<CustomerModel>} */scope">
          <el-tag :type="statusType(scope.row.customer_property)">{{ scope.row.customer_property }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="AM" width="120" :align="'center'" sortable prop="am">
        <template #default="/** @type {ElTableScope<CustomerModel>} */scope">
          {{ scope.row.am }}
        </template>
      </el-table-column>
      <el-table-column label="Description" sortable prop="description">
        <template #default="/** @type {ElTableScope<CustomerModel>} */scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :align="'center'" prop="created_at" label="Created At" width="200" sortable>
        <template #default="/** @type {ElTableScope<CustomerModel>} */scope">
          <i class="el-icon-time" />
          <span>{{ parseTime(scope.row.created_at, 'YYYY/MM/DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column :align="'center'" prop="updated_at" label="Updated At" width="200" sortable>
        <template #default="/** @type {ElTableScope<CustomerModel>} */scope">
          <i class="el-icon-time" />
          <span>{{ parseTime(scope.row.updated_at, 'YYYY/MM/DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" :align="'center'" width="180" class-name="small-padding fixed-width">
        <template #default="/** @type {ElTableScope<CustomerModel>} */scope">
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

    <el-dialog title="Create Customer" :visible="dialog === 'create' || dialog === 'update'" @close="handleCancel">
      <el-form ref="form" :rules="rules" :model="model" label-position="left" label-width="160px" style="width: 400px; margin-left:50px;" @submit="onSubmit">
        <el-form-item label="Customer Name" prop="customer_name">
          <el-input v-model="model.customer_name" />
        </el-form-item>
        <el-form-item label="Customer ID" prop="customer_id">
          <el-input v-model="model.customer_id" />
        </el-form-item>
        <el-form-item label="Customer Property" prop="customer_property">
          <el-select v-model="model.customer_property" class="filter-item" placeholder="Please select">
            <el-option v-for="item in propertyOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="AM" prop="am">
          <el-input v-model="model.am" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="model.description" />
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
/** @typedef {import('@/models').CustomerModel} CustomerModel */
/** @template T @typedef {import('@/models').ElTableScope<T>} ElTableScope<T> */
/** @template T @typedef {T extends Record<string, infer R> ? R : unknown} EnumValue */
/** @typedef {import('@/types/validator').Rule} Rule */
import { isUndefined } from '@/utils/is'
import { chunk } from '@/utils/helper'
import { createNow, parseTime } from '@/utils/datetime'
import {
  getCustomers,
  postCustomers,
  putCustomers,
  deleteCustomers
} from '@/api/table'
import Pagination from '@/components/Pagination/index.vue'

/**
 * @typedef {Object} ComponentData
 * @property {CustomerModel[]} list
 * @property {Promise<any>[]} queue
 * @property {number} total
 * @property {number} page
 * @property {number} perPage
 * @property {'' | 'create' | 'update'} dialog
 * @property {CustomerModel} model
 * @property {{ [ K in keyof CustomerModel]: Rule[] }} rules
 * @property {EnumValue<typeof PropertyOptions>[]} propertyOptions
 */

/**
  * @return {CustomerModel}
  */
function createDefaultCustomerModel() {
  return {
    id: 0,
    customer_id: '',
    customer_name: '',
    customer_property: '',
    am: '',
    description: '',
    created_at: createNow(),
    updated_at: createNow()
  }
}

/**
  * @param {Partial<CustomerModel>} model
  * @return {CustomerModel}
  */
function createCustomerModel(model) {
  const defaultModel = createDefaultCustomerModel()
  if (model) {
    if (isUndefined(model.id)) model.id = defaultModel.id
    if (isUndefined(model.customer_name)) model.customer_name = defaultModel.customer_name
    if (isUndefined(model.customer_id)) model.customer_id = defaultModel.customer_id
    if (isUndefined(model.customer_property)) model.customer_property = defaultModel.customer_property
    if (isUndefined(model.am)) model.am = defaultModel.am
    if (isUndefined(model.description)) model.description = defaultModel.description
    if (isUndefined(model.created_at)) model.created_at = defaultModel.created_at
    if (isUndefined(model.updated_at)) model.updated_at = defaultModel.updated_at
    return model
  }
  return defaultModel
}

const statusMap = {
  Presales: 'success',
  Existing: 'gray',
  Terminated: 'danger'
}

/**
 * @enum {string}
 */
const PropertyOptions = {
  /** @type {'Property1'} */
  PROD1: 'Presales',
  /** @type {'Property2'} */
  PROD2: 'Existing',
  /** @type {'Property3'} */
  PROD3: 'Terminated'
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
      model: createDefaultCustomerModel(),
      rules: {
        customer_name: [{ required: true }],
        customer_id: [{ required: true }],
        customer_property: [{ required: true }],
        description: [{ required: false }]
      },
      propertyOptions: Object.values(PropertyOptions)
    }
  },
  computed: {
    /** @return {boolean} */
    isLoading() {
      return this.queue.length
    },
    /** @return {CustomerModel[]} */
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
      const req = getCustomers()
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
            this.model = createCustomerModel(model)
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
     * @param {CustomerModel} row
     */
    openUpdateModal(row) {
      this.model = createCustomerModel(row)
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        dialog: 'update',
        id: row.id
      }})
    },
    cancelModal() {
      this.model = createCustomerModel()
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        id: undefined,
        dialog: undefined
      }})
    },
    handleCancel() {
      this.model = createCustomerModel()
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        id: undefined,
        dialog: undefined
      }})
    },
    async handleSubmit() {
      const form = {
        customer_name: this.model.customer_name,
        customer_id: this.model.customer_id,
        customer_property: this.model.customer_property,
        am: this.model.am,
        description: this.model.description
      }
      try {
        const notifyOptions = {
          title: 'Success',
          message: '',
          type: 'success',
          duration: 2000
        }
        if (this.model.id === 0) {
          await postCustomers(form)
          this.fetchData()
          notifyOptions.message = 'Create Successfully'
        } else {
          await putCustomers(this.model.id, form)
          this.fetchData()
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
     * @param {CustomerModel} row
     */
    handleDelete(row) {
      this.$confirm('Are you sure you want to delete this?', 'confirm', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        return deleteCustomers(row.id)
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
</style>
