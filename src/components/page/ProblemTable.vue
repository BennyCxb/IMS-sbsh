<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item, i) in breadcrumb" :key="i"><i class="el-icon-menu" v-if="i === 0"></i> {{item}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="handle-box">
      <el-date-picker
        class="handle-select"
        v-model="select_years"
        align="right"
        type="year"
        value-format="yyyy"
        placeholder="选择年"
        size="small"
        clearable>
      </el-date-picker>
      <el-date-picker
        class="handle-select"
        v-model="select_mouths"
        format="MM"
        value-format="MM"
        type="month"
        placeholder="选择月"
        size="small"
        clearable>
      </el-date-picker>
      <el-select v-model="select_adcd" class="handle-select" placeholder="行政区划" size="small" clearable>
        <el-option
          v-for="item in adlist"
          :key="item.value"
          :label="item.label"
          :value="item.value">
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        </el-option>
      </el-select>
      <el-select v-model="select_edge" placeholder="四边" class="handle-select mr10" clearable size="small">
        <el-option v-for="(item, i) in edgeOptions" :key="i" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="select_problem" placeholder="存在问题" class="handle-select mr10" clearable size="small">
        <el-option v-for="(item, i) in proOptions" :key="i" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="select_status" placeholder="审核状态" class="handle-select mr10" clearable size="small">
        <el-option v-for="(item, i) in staOptions" :key="i" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <!--<el-select v-model="select_cttatus" placeholder="整改状态" class="handle-select mr10" clearable>-->
        <!--<el-option v-for="(item, i) in cstaOptions" :key="i" :label="item.label" :value="item.value"></el-option>-->
      <!--</el-select>-->
      <el-input v-model="select_problem_num" placeholder="问题编号" class="handle-input mr10" size="small" clearable></el-input>
      <el-button type="primary" icon="el-icon-search" @click="search" size="small">搜索</el-button>
      <el-button type="primary" icon="el-icon-upload2" :disabled="disabled0" v-if="submitPossession" @click="batchSubmit" :loading="submitLoading" size="small">批量提交审核</el-button>
      <el-button type="success" icon="el-icon-success" :disabled="disabled1" v-if="auditPossession" @click="batchAuditPass" :loading="passLoading" size="small">批量审核通过</el-button>
      <el-button type="danger" icon="el-icon-error" :disabled="disabled1" v-if="auditPossession" @click="batchAuditReject" :loading="rejectLoading" size="small">批量审核不通过</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="addProblem" v-if="FLevel !== 2" size="small">新增问题</el-button>
      <vProblemForm :fid="editFid" :billTypeId="billTypeID" :formShow="proAddShow" @closeProAdd="closePro"></vProblemForm>
    </div>
    <el-table v-loading="loading"
              :data="data"
              border
              style="width: 100%"
              ref="multipleTable"
              @selection-change="handleSelectionChange"
              stripe size="mini">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="FYear" label="年度" sortable width="120">
      </el-table-column>
      <el-table-column prop="FAgencyName" label="行政区划">
      </el-table-column>
      <el-table-column prop="FBillNo" label="问题编号" sortable>
      </el-table-column>
      <el-table-column prop="FLineName" label="线路名称">
      </el-table-column>
      <el-table-column prop="FMileage" label="里程/村庄">
      </el-table-column>
      <el-table-column prop="FProbType" label="问题类型">
      </el-table-column>
      <el-table-column prop="FStatusName" label="审核状态">
      </el-table-column>
      <!--<el-table-column prop="FChangeStatusName" label="整改状态">-->
      <!--</el-table-column>-->
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="small"
                     @click="handleEdit(scope.$index, scope.row)">查看
          </el-button>
          <el-button size="small" type="danger" v-if="(FLevel === 1 || FLevel === 3) && scope.row.FStatusName === '待整改'"
                     @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cur_page"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>

</template>

<script>
import _ from 'lodash'
import vProblemForm from './ProblemForm.vue'

export default {
  components: {
    vProblemForm
  },
  computed: {
    data () {
      return this.tableData
    },
    FLevel () {
      let FLevel = Number(localStorage.getItem('FLevel'))
      return FLevel || 4
    }
  },
  data () {
    return {
      editFid: '',
      billTypeID: '',
      tableData: [],
      cur_page: 1,
      pageSize: 20,
      total: 1,
      multipleSelection: [],
      select_cate: '',
      select_years: '',
      select_mouths: '',
      select_adcd: '',
      select_edge: '',
      select_problem_num: '',
      select_problem: '',
      select_status: '',
      select_cttatus: '',
      del_list: [],
      is_search: false,
      adlist: [],
      proOptions: [],
      edgeOptions: [],
      staOptions: [],
      cstaOptions: [],
      proAddShow: false,
      breadcrumb: [],
      loading: true,
      disabled0: true,
      disabled1: true,
      submitPossession: false,
      auditPossession: false,
      submitLoading: false,
      passLoading: false,
      rejectLoading: false,
      rowOptions: [
        {
          label: '每页10行',
          value: 10
        },
        {
          label: '每页15行',
          value: 15
        },
        {
          label: '每页20行',
          value: 20
        }
      ]
    }
  },
  created () {
    this.select_years = this.$moment().format('YYYY')
    this.getBillTypeId()
    this.getBreadcrumb()

    this.getAdcd()
    this.getEdge()
    this.getData()
    this.getProblemType()
    this.getStatusData()
    this.getChangeStatusData()
    this.getSubmitPossession()
    this.getAuditPossession()
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.cur_page = val
      this.getData()
    },
    getStatus (urlStr) {
      let urlStrArr = urlStr.split('/')
      return urlStrArr[urlStrArr.length - 1]
    },
    /**
     * 获取BiilTypeID
     */
    getBillTypeId () {
      this.billTypeID = this.$route.params.btid
    },
    /**
     * 获取面包屑
     */
    getBreadcrumb () {
      let blist = JSON.parse(sessionStorage.getItem('breadcrumb'))
      this.breadcrumb = [].concat(blist)
    },
    /**
     * 获取行政区划
     */
    getAdcd () {
      let self = this
      this.$axios.get('Common/GetAgencyList')
        .then(function (response) {
          let data = response.data
          let adcdlist = []
          let FAgencyValue = localStorage.getItem('FAgencyValue')
          if (FAgencyValue !== 'null') {
            let item = _.find(data.object, {FValue: FAgencyValue})
            adcdlist.push({
              value: Number(item.FValue),
              label: item.FName
            })
          } else {
            _.each(data.object, (obj) => {
              adcdlist.push({
                value: Number(obj.FValue),
                label: obj.FName
              })
            })
          }
          self.adlist = [].concat(adcdlist)
        })
        .catch(function (error) {
          // console.log(error)
          self.$message.error(error.message)
        })
    },
    /**
     * 获取四边
     */
    getEdge () {
      let self = this
      this.$axios.get('Common/GetEnumList', {
        params: {
          EnumType: '四边'
        }
      })
        .then(function (response) {
          let data = response.data
          let list = []
          _.each(data.object, (obj) => {
            list.push({
              value: obj.FValue,
              label: obj.FName
            })
          })
          self.edgeOptions = [].concat(list)
        })
        .catch(function (error) {
          // console.log(error)
          self.$message.error(error.message)
        })
    },
    /**
     * 获取审核状态
     */
    getStatusData () {
      let self = this
      this.$axios.get('Common/GetEnumList', {
        params: {
          EnumType: '审核状态'
        }
      })
        .then(function (response) {
          let data = response.data
          let list = []
          _.each(data.object, (obj) => {
            list.push({
              value: obj.FValue,
              label: obj.FName
            })
          })
          self.staOptions = [].concat(list)
        })
        .catch(function (error) {
          // console.log(error)
          self.$message.error(error.message)
        })
    },
    /**
     * 获取整改状态
     */
    getChangeStatusData () {
      let self = this
      this.$axios.get('Common/GetEnumList', {
        params: {
          EnumType: '整改状态'
        }
      })
        .then(function (response) {
          let data = response.data
          let list = []
          _.each(data.object, (obj) => {
            list.push({
              value: obj.FValue,
              label: obj.FName
            })
          })
          self.cstaOptions = [].concat(list)
        })
        .catch(function (error) {
          // console.log(error)
          self.$message.error(error.message)
        })
    },
    /**
     * 获取问题类型
     */
    getProblemType () {
      let self = this
      this.$axios.get('Common/GetEnumList', {
        params: {
          EnumType: '问题类型'
        }
      })
        .then(response => {
          let data = response.data
          let list = []
          _.each(data.object, (obj) => {
            list.push({
              value: obj.FValue,
              label: obj.FName
            })
          })
          self.proOptions = [].concat(list)
        })
        .catch(error => {
          // console.log(error)
          self.$message.error(error.message)
        })
    },
    /**
     * 获取列表
     */
    getData () {
      let self = this
      this.loading = true
      this.$axios.post('LoanApply/GetSJList', {
        curr: this.cur_page,
        pageSize: this.pageSize,
        FAgencyValue: this.select_adcd,
        FBillTypeID: this.billTypeID,
        FBillNo: this.select_problem_num,
        FEdge: this.select_edge,
        FProbType: this.select_problem,
        FStatus: this.select_status,
        FYear: this.select_years,
        FMonth: this.select_mouths,
        FChangeStatus: this.select_cttatus,
        strSortFiled: '',
        strSortType: ''
      })
        .then(response => {
          let data = response.data
          if (data.code === 1) {
            self.loading = false
            self.tableData = data.object
            self.total = data.page ? data.page.totalRecords : 0
          } else {
            self.$message.error(data.message)
          }
        })
        .catch(error => {
          // console.log(error)
          self.loading = false
          self.$message.error(error.message)
        })
    },
    /**
     * 搜索事件
     */
    search () {
      this.is_search = true
      this.handleCurrentChange(1)
    },
    formatter (row, column) {
      return row.address
    },
    /**
     * 修改信息触发
     */
    handleEdit (index, row) {
      this.editProblem(row.FID)
    },
    /**
     * 删除信息触发
     */
    handleDelete (index, row) {
      let self = this
      this.$confirm('确认删除？')
        .then(_ => {
          self.$axios.get('LoanApply/DeleteApply', {
            params: {
              FID: row.FID
            }
          })
            .then(function (response) {
              let data = response.data
              if (data.code === 1) {
                self.$message.error('删除成功！')
                self.getData()
              } else {
                self.$message.error(data.message)
              }
            })
            .catch(function (error) {
              // console.log(error)
              self.$alert(error.message, '温馨提示', {
                confirmButtonText: '确定'
              })
            })
        })
        .catch(error => {
          // console.log(error)
          self.$message.error(error.message)
        })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      let total = val.length
      if (total) {
        let count = _.countBy(val, 'FStatus')
        if (count[0] === total) {
          this.disabled0 = false
        } else if (count[1] === total) {
          this.disabled1 = false
        } else {
          this.disabled0 = true
          this.disabled1 = true
        }
      } else {
        this.disabled0 = true
        this.disabled1 = true
      }
    },
    /**
     * 新增问题点位
     */
    addProblem () {
      this.proAddShow = true
      this.editFid = ''
    },
    /**
     * 修改问题点位
     */
    editProblem (fid) {
      this.proAddShow = true
      this.editFid = fid
    },
    /**
     * 关闭问题信息框
     */
    closePro (msg) {
      this.proAddShow = msg
      this.getData()
    },
    /**
     * 批量提交审核
     */
    batchSubmit () {
      let list = []
      this.submitLoading = true
      _.each(this.multipleSelection, item => {
        list.push(this.auditSubmit(item))
      })
      this.$axios.all(list)
        .then(response => {
          this.submitLoading = false
          this.getData()
        })
    },
    /**
     * 批量审核通过
     */
    batchAuditPass () {
      let list = []
      this.passLoading = true
      _.each(this.multipleSelection, item => {
        list.push(this.auditPass(item))
      })
      this.$axios.all(list)
        .then(response => {
          this.passLoading = false
          this.getData()
        })
    },
    /**
     * 批量审核不通过
     */
    batchAuditReject () {
      let list = []
      this.rejectLoading = true
      _.each(this.multipleSelection, item => {
        list.push(this.auditReject(item))
      })
      this.$axios.all(list)
        .then(response => {
          this.rejectLoading = false
          this.getData()
        })
    },
    auditSubmit (obj) {
      return this.$axios.post('Flow/SubmitApply', {
        FBillTypeID: this.billTypeID,
        FID: obj.FID,
        FCurrentLevel: obj.FCheckLevel,
        FlowMessage: ''
      })
    },
    auditPass (obj) {
      return this.$axios.post('Flow/AdoptApply', {
        FBillTypeID: this.billTypeID,
        FID: obj.FID,
        FCurrentLevel: obj.FCheckLevel,
        FlowMessage: ''
      })
    },
    auditReject (obj) {
      return this.$axios.post('Flow/RejectApply', {
        FBillTypeID: this.billTypeID,
        FID: obj.FID,
        FCurrentLevel: obj.FCheckLevel,
        FlowMessage: ''
      })
    },
    // 编辑、提交整改权限
    getSubmitPossession () {
      let FLevel = Number(localStorage.getItem('FLevel'))
      let blist = JSON.parse(sessionStorage.getItem('breadcrumb'))
      let binx = _.indexOf(blist, '县级自查自纠点位')
      if (FLevel === 1) {
        this.submitPossession = true
      } else if (FLevel === 3 && binx === -1) {
        this.submitPossession = true
      } else if (FLevel === 4 && binx > -1) {
        this.submitPossession = true
      } else {
        this.submitPossession = false
      }
    },
    // 审核整改权限
    getAuditPossession () {
      let FLevel = Number(localStorage.getItem('FLevel'))
      let blist = JSON.parse(sessionStorage.getItem('breadcrumb'))
      let binx = _.indexOf(blist, '县级自查自纠点位')
      if ((FLevel === 1 || FLevel === 2) && binx === -1) {
        this.auditPossession = true
      } else if (FLevel === 3 && binx > -1) {
        this.auditPossession = true
      } else {
        this.auditPossession = false
      }
    }
  },
  watch: {
    '$route' (to, from) {
      // console.log(to)
      // console.log(from)
      this.getStatus(this.$route.path)
      this.getBillTypeId()
      this.getBreadcrumb()
      this.getData()
    }
  }
}
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
    line-height: 40px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 150px;
    display: inline-block;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 120px;
  }
</style>
