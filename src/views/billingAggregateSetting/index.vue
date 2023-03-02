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
      :default-sort="{prop: 'group_name', order: 'descending'}"
    >
      <el-table-column :align="'center'" label="" width="60">
        <template #default="/** @type {ElTableScope<BillingAggregateSettingModel>} */scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Group Name" width="170" sortable prop="group_name">
        <template #default="/** @type {ElTableScope<BillingAggregateSettingModel>} */scope">
          {{ scope.row.group_name }}
        </template>
      </el-table-column>
      <el-table-column label="Billing List" width="170" :align="'center'" sortable prop="billing_list">
        <template #default="/** @type {ElTableScope<BillingAggregateSettingModel>} */scope">
          {{ scope.row.billing_list }}
        </template>
      </el-table-column>
      <el-table-column label="cir" width="120" :align="'center'" sortable prop="cir">
        <template #default="/** @type {ElTableScope<BillingAggregateSettingModel>} */scope">
          {{ scope.row.cir }}
        </template>
      </el-table-column>
      <el-table-column label="cir" width="120" :align="'center'" sortable prop="pir">
        <template #default="/** @type {ElTableScope<BillingAggregateSettingModel>} */scope">
          {{ scope.row.pir }}
        </template>
      </el-table-column>
      <el-table-column label="permanent" width="120" :align="'center'" sortable prop="permanent">
        <template #default="/** @type {ElTableScope<BillingAggregateSettingModel>} */scope">
          {{ scope.row.permanent }}
        </template>
      </el-table-column>
      <el-table-column :align="'center'" prop="created_at" label="Created At" width="200" sortable>
        <template #default="/** @type {ElTableScope<BillingAggregateSettingModel>} */scope">
          <i class="el-icon-time" />
          <span>{{ parseTime(scope.row.created_at, 'YYYY/MM/DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column :align="'center'" prop="updated_at" label="Updated At" width="200" sortable>
        <template #default="/** @type {ElTableScope<BillingAggregateSettingModel>} */scope">
          <i class="el-icon-time" />
          <span>{{ parseTime(scope.row.updated_at, 'YYYY/MM/DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" :align="'center'" width="180" class-name="small-padding fixed-width">
        <template #default="/** @type {ElTableScope<BillingAggregateSettingModel>} */scope">
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

    <el-dialog title="Create Billing Aggregate Setting" :visible="dialog === 'create' || dialog === 'update'" @close="handleCancel">
      <el-form ref="form" :rules="rules" :model="model" label-position="left" label-width="160px" style="width: 400px; margin-left:50px;" @submit="onSubmit">
        <el-form-item label="Group Name" prop="group_name">
          <el-input v-model="model.group_name" />
        </el-form-item>
        <el-form-item label="Billing List" prop="billing_list">
          <el-select v-model="model.billing_list" filterable placeholder="Please select">
            <el-option
              v-for="item in billingSettingOptions"
              :key="item.id"
              :label="item.billing_id"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="Billing_List" prop="billing_list">-->
        <!--          <el-input v-model="model.billing_list" />-->
        <!--        </el-form-item>-->
        <el-form-item label="Cir" prop="cir">
          <el-input v-model="model.cir" />
        </el-form-item>
        <el-form-item label="Pir" prop="pir">
          <el-input v-model="model.pir" />
        </el-form-item>
        <el-form-item label="permanent" prop="permanent">
          <el-select v-model="model.permanent" class="filter-item" placeholder="Please select">
            <el-option v-for="item in permanentOptions" :key="item" :label="item" :value="item" />
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

    <el-dialog v-if="dialog === 'update'" key="update">
      <div>update</div>
    </el-dialog>
  </div>
</template>

<script>
/** @typedef {import('@/models').BillingAggregateSettingModel} BillingAggregateSettingModel */
/** @template T @typedef {import('@/models').ElTableScope<T>} ElTableScope<T> */
/** @template T @typedef {T extends Record<string, infer R> ? R : unknown} EnumValue */
/** @typedef {import('@/types/validator').Rule} Rule */
import { isUndefined } from '@/utils/is'
import { chunk } from '@/utils/helper'
import { createNow, parseTime } from '@/utils/datetime'
import {
  getBillingAggregateSettings,
  postBillingAggregateSettings,
  putBillingAggregateSettings,
  deleteBillingAggregateSettings,
  getBilling
} from '@/api/table'
import Pagination from '@/components/Pagination/index.vue'

/**
 * @typedef {Object} ComponentData
 * @property {BillingAggregateSettingModel[]} list
 * @property {Promise<any>[]} queue
 * @property {number} total
 * @property {number} page
 * @property {number} perPage
 * @property {'' | 'create' | 'update'} dialog
 * @property {BillingAggregateSettingModel} model
 * @property {{ [ K in keyof BillingAggregateSettingModel]: Rule[] }} rules
 * @property {EnumValue<typeof PermanentOptions>[]} permanentOptions
 */

/**
  * @return {BillingAggregateSettingModel}
  */
function createDefaultBillingAggregateSettingModel() {
  return {
    id: 0,
    group_name: '',
    billing_list: '',
    cir: '',
    pir: '',
    permanent: '',
    created_at: createNow(),
    updated_at: createNow()
  }
}

/**
  * @param {Partial<BillingAggregateSettingModel>} model
  * @return {BillingAggregateSettingModel}
  */
function createBillingAggregateSettingModel(model) {
  const defaultModel = createDefaultBillingAggregateSettingModel()
  if (model) {
    if (isUndefined(model.id)) model.id = defaultModel.id
    if (isUndefined(model.group_name)) model.group_name = defaultModel.group_name
    if (isUndefined(model.billing_list)) model.billing_list = defaultModel.billing_list
    if (isUndefined(model.cir)) model.cir = defaultModel.cir
    if (isUndefined(model.pir)) model.pir = defaultModel.pir
    if (isUndefined(model.permanent)) model.permanent = defaultModel.permanent
    if (isUndefined(model.created_at)) model.created_at = defaultModel.created_at
    if (isUndefined(model.updated_at)) model.updated_at = defaultModel.updated_at
    return model
  }
  return defaultModel
}
/**
 * @enum {string}
 */
const PermanentOptions = {
  /** @type {'Permanent1'} */
  PERMANENT1: 'auto-every-month',
  /** @type {'Permanent2'} */
  PERMANENT2: 'manual-one-time',
  /** @type {'Permanent3'} */
  PERMANENT3: 'combined-ratelimit'
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
      model: createDefaultBillingAggregateSettingModel(),
      rules: {
        group_name: [{ required: true }],
        billing_list: [{ required: true }],
        cir: [{ required: false }],
        pir: [{ required: false }],
        permanent: [{ required: true }]
      },
      permanentOptions: Object.values(PermanentOptions),
      billingSettingOptions: [],
      billingSettingList: {}
    }
  },
  computed: {
    /** @return {boolean} */
    isLoading() {
      return this.queue.length
    },
    /** @return {BillingAggregateSettingModel[]} */
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
    await this.createBillingSettingOptions()
    await this.fetchData()
    await this.init()
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
      const req = getBillingAggregateSettings()
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
            this.model = createBillingAggregateSettingModel(model)
          } else {
            this.cancelModal()
          }
        }
      })
    },
    createBillingSettingOptions() {
      const req = getBilling()
      const billingsettings = {}
      return req.then(response => {
        this.customerList = response.data.map(
          function(item) {
            // eslint-disable-next-line no-prototype-builtins
            if (!billingsettings.hasOwnProperty(item.id)) {
              billingsettings[item.id] = []
            }
            billingsettings[item.id] = item
          }
        )
        this.billingSettingList = billingsettings
        this.billingSettingOptions = response.data
      })
    },
    openCreateModal() {
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        dialog: 'create'
      }})
    },
    /**
     * @param {BillingAggregateSettingModel} row
     */
    openUpdateModal(row) {
      this.model = createBillingAggregateSettingModel(row)
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        dialog: 'update',
        id: row.id
      }})
    },
    cancelModal() {
      this.model = createBillingAggregateSettingModel()
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        id: undefined,
        dialog: undefined
      }})
    },
    handleCancel() {
      this.model = createBillingAggregateSettingModel()
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        id: undefined,
        dialog: undefined
      }})
    },
    async handleSubmit() {
      const form = {
        group_name: this.model.group_name,
        billing_list: this.model.billing_list,
        cir: this.model.cir,
        pir: this.model.pir,
        permanent: this.model.permanent
      }
      try {
        const notifyOptions = {
          title: 'Success',
          message: '',
          type: 'success',
          duration: 2000
        }
        if (this.model.id === 0) {
          await postBillingAggregateSettings(form)
          this.fetchData()
          notifyOptions.message = 'Create Successfully'
        } else {
          await putBillingAggregateSettings(this.model.id, form)
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
     * @param {BillingAggregateSettingModel} row
     */
    handleDelete(row) {
      this.$confirm('Are you sure you want to delete this?', 'confirm', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        return deleteBillingAggregateSettings(row.id)
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
