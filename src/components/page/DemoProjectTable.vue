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
        placeholder="选择年">
      </el-date-picker>
      <el-date-picker
        class="handle-select"
        v-model="select_mouths"
        format="MM"
        type="month"
        placeholder="选择月">
      </el-date-picker>
      <el-select v-model="select_adcd" class="handle-select" placeholder="行政区划" clearable>
        <el-option
          v-for="item in adlist"
          :key="item.value"
          :label="item.label"
          :value="item.value">
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        </el-option>
      </el-select>
      <el-select v-model="select_project" placeholder="项目类型" class="handle-select mr10" clearable>
        <el-option v-for="(item, i) in proOptions" :key="i" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
    <div class="handle-box">
      <el-input v-model="select_biil_num" placeholder="项目编号" class="handle-input mr10"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="addProblem" v-if="FLevel !== 2">新增项目</el-button>
      <demo-project-form :fid="editFid" :billTypeId="billTypeID" :formShow="proAddShow" @closeProAdd="closePro"></demo-project-form>
    </div>
    <el-table v-loading="loading" :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange"
              stripe>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="FAgencyName" label="行政区划">
      </el-table-column>
      <el-table-column prop="FBillNo" label="项目编号" sortable>
      </el-table-column>
      <el-table-column prop="FPorjectName" label="项目名称">
      </el-table-column>
      <el-table-column prop="FMileage" label="里程桩号">
      </el-table-column>
      <el-table-column prop="FLength" label="长度">
      </el-table-column>
      <el-table-column prop="FProjectType" label="项目类型">
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="small"
                     @click="handleEdit(scope.$index, scope.row)">查看
          </el-button>
          <el-button size="small" type="danger"
                     @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="total">
      </el-pagination>
    </div>
  </div>

</template>

<script>
import _ from 'lodash'
import DemoProjectForm from './DemoProjectForm.vue'

export default {
  components: {
    DemoProjectForm
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
      pageSize: 15,
      total: 1,
      multipleSelection: [],
      select_cate: '',
      select_years: '',
      select_mouths: '',
      select_adcd: '',
      select_edge: '',
      select_biil_num: '',
      select_project: '',
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
      loading: true
    }
  },
  created () {
    this.getBillTypeId()
    this.getBreadcrumb()

    this.getAdcd()
    this.getData()
    this.getProjectType()
  },
  methods: {
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
          console.log(error)
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
          console.log(error)
          self.$message.error(error.message)
        })
    },
    /**
     * 获取项目类型
     */
    getProjectType () {
      let self = this
      this.$axios.get('Common/GetEnumList', {
        params: {
          EnumType: '项目类型'
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
          console.log(error)
          self.$message.error(error.message)
        })
    },
    /**
     * 获取列表
     */
    getData () {
      let self = this
      this.loading = true
      this.$axios.post('LoanApply/GetQXList', {
        curr: this.cur_page,
        pageSize: this.pageSize,
        FAgencyValue: this.select_adcd,
        FBillTypeID: this.billTypeID,
        FBillNo: this.select_biil_num,
        FProjectTypeID: this.select_project,
        FYear: this.select_years,
        FMonth: this.select_mouths,
        strSortFiled: '',
        strSortType: ''
      })
        .then(response => {
          let data = response.data
          self.loading = false
          self.tableData = data.object
          self.total = data.page ? data.page.totalRecords : 0
        })
        .catch(error => {
          console.log(error)
          self.loading = false
          self.$message.error(error.message)
        })
    },
    /**
     * 搜索事件
     */
    search () {
      this.is_search = true
      this.getData()
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
              self.$message.error('删除成功！')
              self.getData()
            })
            .catch(function (error) {
              console.log(error)
              self.$alert(error.message, '温馨提示', {
                confirmButtonText: '确定'
              })
            })
        })
        .catch(error => {
          console.log(error)
          self.$message.error(error.message)
        })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
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
    closePro: function (msg) {
      this.proAddShow = msg
      this.getData()
    }
  },
  watch: {
    '$route' (to, from) {
      console.log(to)
      console.log(from)
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
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }
</style>
