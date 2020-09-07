<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.className"
        clearable
        placeholder="班级"
        class="filter-item"
        style="width: 100px"
        @change="handleFilter"
      >
        <el-option
          v-for="item in listFilter.className"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

      <el-select v-model="listQuery.searchTypes" placeholder="搜索类型" clearable style="width: 120px" class="filter-item">
        <el-option
          v-for="item in listFilter.searchTypes"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-input
        v-model="listQuery.keyword"
        placeholder="关键字"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!--      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">-->
      <el-button v-waves class="filter-item" type="primary" @click="handleFilter">
        搜索
      </el-button>
      <!--      <el-button v-waves class="filter-item" type="success" icon="el-icon-search" @click="">-->
      <!--        编辑-->
      <!--      </el-button>-->
      <!--      <el-button v-waves class="filter-item" type="success" icon="el-icon-search">-->
      <el-button v-waves class="filter-item" type="success">
        导入
      </el-button>
      <!--      <el-button v-waves class="filter-item" type="info" icon="el-icon-search">-->
      <el-button v-waves class="filter-item" type="info">
        下载导入模板
      </el-button>
      <!--      <el-button v-waves class="filter-item" type="warning" icon="el-icon-search">-->
      <el-button v-waves class="filter-item" type="warning">
        更新导入
      </el-button>
      <!--      <el-button v-waves class="filter-item" type="danger" icon="el-icon-search">-->
      <el-button v-waves class="filter-item" type="danger">
        导出
      </el-button>

      <!--      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"-->
      <!--                 @click="handleCreate">-->
      <!--        Add-->
      <!--      </el-button>-->
      <!--      <el-button-->
      <!--        v-waves-->
      <!--        :loading="downloadLoading"-->
      <!--        class="filter-item"-->
      <!--        type="primary"-->
      <!--        icon="el-icon-download"-->
      <!--        @click="handleDownload">-->
      <!--        导出明细-->
      <!--      </el-button>-->
      <!--      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">-->
      <!--        reviewer-->
      <!--      </el-checkbox>-->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <!--      @selection-change="handleSelectionChange"-->

      <!--      <el-table-column-->
      <!--        type="selection"-->
      <!--        width="55"-->
      <!--      />-->
      <!--      <el-table-column label="选择" width="55">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-radio  v-model="tableRadio" :label="scope.row"><i></i></el-radio>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <el-table-column label="姓名" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.studentNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column label="班级" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.className }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学生类型" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="亲情号码" min-width="80px" align="center">
        <template slot-scope="{row}">
          <!--        <span>{{ row.familyPhone }}</span>-->
          <span>{{ row.studentNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!--                <el-button v-if="row.status!='published'" size="mini" type="success"-->
          <!--                           @click="handleModifyStatus(row,'published')">-->
          <!--                  Publish-->
          <!--                </el-button>-->
          <!--                <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">-->
          <!--                  Draft-->
          <!--                </el-button>-->
          <!--                <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">-->
          <!--                  Delete-->
          <!--                </el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 500px; margin-left:50px;"
      >
        <el-form-item label="姓名" prop="type">
          <el-input :value="temp.name " disabled />
          <!--          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">-->
          <!--            <el-option-->
          <!--              v-for="item in listFilter.type"-->
          <!--              :key="item.id"-->
          <!--              :label="item.name"-->
          <!--              :value="item.id"-->
          <!--            />-->
          <!--          </el-select>-->
        </el-form-item>
        <!--        <el-form-item label="Date" prop="timestamp">-->
        <!--          <el-date-picker-->
        <!--            v-model="temp.timestamp"-->
        <!--            type="datetime"-->
        <!--            placeholder="Please pick a date"-->
        <!--          />-->
        <!--        </el-form-item>-->
        <el-form-item label="学号" prop="title">
          <el-input
            v-model="temp.studentNumber"
            disabled
          />
        </el-form-item>
        <el-form-item label="卡号" prop="title">
          <el-input
            v-model="temp.cardNumber"
            disabled
          />
        </el-form-item>

        <el-form-item label="班级">
          <el-select v-model="temp.className" class="filter-item" placeholder="Please select" disabled>
            <el-option
              v-for="item in listFilter.className"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学生类型">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select" disabled>
            <el-option
              v-for="item in listFilter.type"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="亲情号码">
          <!--          <el-select v-model="temp.relation" class="filter-item" placeholder="Please select">-->
          <!--            <el-option-->
          <!--              v-for="item in temp.relation"-->
          <!--              :key="item.id"-->
          <!--              :label="item"-->
          <!--              :value="item"-->
          <!--            />-->
          <!--          </el-select>-->
          <div v-for="(item) in temp.relation" :key="item.id" style="margin-bottom: 2px;">
            <el-input :value="item.call" placeholder="亲属关系" style="width: 30%;margin-right: 5px; " />
            <el-input :value="item.phone" placeholder="电话号码" style="width: 40%;margin-right: 5px;" />
            <el-button type="danger" @click.prevent="removeRelation(item)">删除</el-button>
          </div>
          <el-button type="primary" @click.prevent="addRelation">新增</el-button>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column
          prop="key"
          label="Channel"
        />
        <el-table-column
          prop="pv"
          label="Pv"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { getSchoolAttendanceList } from '@/api/table'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils/index.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  components: { Pagination },
  directives: { waves },
  /**
   * 过滤器
   */
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        draft: 'info',
        2: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      multipleSelection: [], // 复选框
      listQuery: { // 查询参数
        page: 1,
        limit: 20,
        className: undefined, // 班级
        schoolBus: undefined, // 校车
        inOrOut: undefined, // 进出学校
        date: undefined, // 进出学校
        status: undefined, // 考勤状态
        week: undefined, // 星期
        timeBucket: undefined, // 考勤时段
        deviceCode: undefined, // 设备ID
        searchTypes: undefined, // 搜索类型
        keyword: undefined // 关键字
        // sort: '+id'
      },
      /**
       * 条件
       */
      listFilter: {
        className: [ // 班级list
          { id: 0, name: '一年级一班' },
          { id: 1, name: '一年级二班' },
          { id: 2, name: '二年级三班' }],
        schoolBus: [
          { id: 0, name: '1号线' },
          { id: 1, name: '2号线' }
        ],
        upOrDown: [

          { id: 0, name: '上车' },
          { id: 1, name: '下车' }
        ],
        inOrOut: [
          { id: 0, name: '进校' },
          { id: 1, name: '离校' }
        ],
        status: [
          { id: 0, name: '正常' },
          { id: 1, name: '异常' }
        ],
        week: [
          { id: 0, name: '周一' },
          { id: 1, name: '周二' },
          { id: 1, name: '周三' },
          { id: 1, name: '周四' },
          { id: 1, name: '周五' },
          { id: 1, name: '周六' },
          { id: 1, name: '周日' }
        ],
        timeBucket: [
          { id: 0, name: '上午:8:00~12:00' },
          { id: 1, name: '下午:14:00~17:30' }
        ],
        deviceCode: [
          { id: 0, name: '20200909' },
          { id: 1, name: '20200808' }
        ],
        searchTypes: [
          { id: 0, name: '姓名' },
          { id: 1, name: '学号' },
          { id: 2, name: '卡号' }
        ],
        type: [
          { id: 0, name: '走读生' },
          { id: 1, name: '住校生' }
        ]
      },

      calendarTypeOptions,

      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      /**
       * 编辑-修改 弹窗数据
       */
      temp: {
        id: undefined,
        name: undefined,
        studentNumber: undefined,
        cardNumber: undefined,
        className: undefined,
        type: undefined,
        relation: [
          {
            id: 1,
            call: '爸爸',
            phone: '13800138000'
          },
          {
            id: 2,
            call: '妈妈',
            phone: '13800138999'
          }
        ]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      /**
       * 动态判断弹窗标题
       */
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /**
     * 获取数据
     */
    getList() {
      this.listLoading = true
      getSchoolAttendanceList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    /**
     * 复选框切换
     * @param val
     */
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    /**
     *重置弹窗
     */
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    /**
     * 弹窗事件 编辑
     */
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel.js').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    /**
     * 新增亲情号码-新增
     */
    addRelation() {
      this.temp.relation.push({
        // id: 1,
        call: '',
        phone: ''
      })
    },
    /**
     * 新增亲情电话号码-移除
     * @param item object
     */
    removeRelation(item) {
      var index = this.temp.relation.indexOf(item)
      if (index !== -1) {
        this.temp.relation.splice(index, 1)
      }
    }
  }
}
</script>
<style scoped lang="scss">

</style>
