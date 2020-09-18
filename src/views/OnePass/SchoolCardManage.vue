<template>
  <div class="app-container">
    <!--    头部搜索框-->
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
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search">
        搜索
      </el-button>
      <!--      <el-button v-waves class="filter-item" type="success" icon="el-icon-search">-->
      <!--        编辑-->
      <!--      </el-button>-->
      <!--      <el-button v-waves class="filter-item" type="success" icon="el-icon-search">-->
      <!--        导入-->
      <!--      </el-button>-->
      <!--      <el-button v-waves class="filter-item" type="info" icon="el-icon-search">-->
      <!--        下载导入模板-->
      <!--      </el-button>-->
      <!--      <el-button v-waves class="filter-item" type="warning" icon="el-icon-search">-->
      <!--        更新导入-->
      <!--      </el-button>-->
      <el-button v-waves class="filter-item" type="danger" icon="el-icon-search">
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

    <!--    table-->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />

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
      <el-table-column label="状态" min-width="80px" align="center">
        <template slot-scope="{row}">
          <!--        <span>{{ row.familyPhone }}</span>-->
          <!--          <span>{{ row.status === 1 ? '正常' : '异常' }}</span>-->
          <el-tag v-if="row.status===1" type="success">正常</el-tag>
          <el-tag v-else type="danger">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="学生照片" min-width="80px" align="center">
        <!--        <template slot-scope="{row}">-->
        <!--        <template>-->

        <!--          <span>{{ row.status }}</span>-->
        <span>--</span>
        <!--        </template>-->
      </el-table-column>
      <el-table-column label="校牌相片" min-width="80px" align="center">
        <!--        <template slot-scope="{row}">-->
        <!--        <templat>-->

        <!--          <span>{{ row.status }}</span>-->
        <span>--</span>
        <!--        </templat>-->
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            补卡发卡
          </el-button>
          <el-button type="danger" size="mini" @click="reportTheLossDialog=true">
            挂失卡片
          </el-button>
          <el-button type="success" size="mini" @click="cancelReportTheLoss(row)">
            卡片解挂
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
    <!--分页器-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!--    // 发卡弹窗-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 500px; margin-left:50px;"
      >
        <el-form-item label="相片">
          <div>
            <img :src="temp.avatar" alt="">
          </div>
        </el-form-item>
        <el-form-item label="姓名">
          <div>{{ temp.name }}</div>
          <!--          <el-input   disabled>-->
          <!--            <el-option-->
          <!--              v-for="item in calendarTypeOptions"-->
          <!--              :key="item.key"-->
          <!--              :label="item.display_name"-->
          <!--              :value="item.key"-->
          <!--            />-->
          <!--          </el-input>-->
        </el-form-item>

        <el-form-item label="班级">
          <div>{{ temp.className }}</div>
        </el-form-item>
        <el-form-item label="学号">
          <div>{{ temp.studentNumber }}</div>
        </el-form-item>
        <el-form-item label="学生类型">
          <div>{{ temp.type }}</div>
        </el-form-item>
        <el-form-item label="补发卡号">
          <el-input v-model="temp.cardNumber" placeholder="请输入卡号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <!--    // 挂失确认弹窗-->
    <el-dialog
      title="提示"
      :visible.sync="reportTheLossDialog"
      width="30%"
      :before-close="handleClose"
    >
      <span>是否确认挂失?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reportTheLossDialog = false">取 消</el-button>
        <el-button type="primary" @click="reportTheLossDialog = false">确 定</el-button>
      </span>
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
        ]
      },

      calendarTypeOptions,

      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        avatar: undefined,
        name: undefined,
        studentNumber: undefined,
        cardNumber: undefined,
        className: undefined,
        type: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '补发校卡'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      /**
       * 是否确认挂失 弹窗
       */
      reportTheLossDialog: false
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
    // 重置 temp 数据
    resetTemp() {
      this.temp = {
        id: '',
        avatar: '',
        name: '',
        studentNumber: '',
        cardNumber: '',
        className: '',
        type: ''
      }
    },
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
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
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
    // 挂失卡片
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.cardNumber = ''
      this.dialogStatus = 'create'
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
     * 是否确认挂失弹窗 点击页面其他区域关闭弹窗时触发
     * before-close 属性
     * @param done
     */
    handleClose(done) {
      this.$confirm('确认取消挂失,关闭弹窗吗？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    /**
     * 解除挂失-方法
     */
    cancelReportTheLoss(data) {
      this.$confirm('是否解除挂失')
        .then(_ => {
          console.log(data)
        })
        .catch(_ => {
        })
    }
  }
}
</script>
<style scoped lang="scss">

</style>
