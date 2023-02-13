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

    <el-dialog v-if="dialog.includes('create')" key="create">
      <div>create</div>
    </el-dialog>

    <el-dialog v-if="dialog.includes('update')" key="update">
      <div>update</div>
    </el-dialog>

    <el-dialog v-if="dialog.includes('delete')" key="delete">
      <div>delete</div>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
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
 * @property {string[]} dialog
 */

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
      dialog: []
    }
  },
  computed: {
    /** @return {boolean} */
    isLoading() {
      return this.queue.length
    }
  },
  watch: {
    /**
     * @param {import('vue-router').Route} to
     * @param {import('vue-router').Route} from
     */
    $route(to) {
      const { query } = to
      if (query.dialog) {
        this.dialog = Array.isArray(query.dialog) ? query.dialog : [query.dialog]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /**
     * @param {string | number | Date} time
     * @param {string} [format="YYYY-MM-DD HH:mm:ss"]
     * @return {string}
     */
    parseTime(time, format = 'YYYY-MM-DD HH:mm:ss') {
      return dayjs(time).format(format)
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
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        dialog: 'update',
        id: row.id
      }})
    },
    /**
     * @param {SubscriptionModel} row
     */
    handleDelete(row) {
      this.$router.push({ ...this.$route, query: {
        ...this.$route.query,
        dialog: 'delete',
        id: row.id
      }})
    }
  }
}
</script>
<style lang="scss">
.filter-container {
  margin-bottom: 16px;
}
</style>
