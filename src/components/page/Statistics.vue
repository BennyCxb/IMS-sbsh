<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item, i) in breadcrumb" :key="i"><i class="el-icon-menu" v-if="i === 0"></i> {{item}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="handle-box">
      <el-select v-model="problem" placeholder="问题点位" class="handle-select mr10" size="small">
        <el-option v-for="(item, i) in proOptions" :key="i" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="edge" placeholder="四边" class="handle-select mr10" size="small">
        <el-option v-for="(item, i) in edgeOptions" :key="i" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="search" size="small">查询</el-button>
      <el-button type="primary" icon="el-icon-download" @click="getExcel" size="small">导出并下载</el-button>
    </div>
    <div class="handle-box text-center">
      <h1>四边三化{{proName}}{{edgeName}}统计表</h1>
    </div>
    <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        prop="FAgencyName"
        label="县(市区)"
        align="center"
        fixed
        header-align="center"
        width="100">
      </el-table-column>
      <el-table-column :label="item" header-align="center" v-for="(item, i) in items" :key="i">
        <el-table-column
          :prop="'FPerimeter' + (i + 1) + 'Count'"
          label="目标任务(个)"
          align="center"
          header-align="center">
        </el-table-column>
        <el-table-column
          :prop="'FPerimeter' + (i + 1) + 'Finish'"
          label="已完成(个)"
          align="center"
          header-align="center">
        </el-table-column>
        <el-table-column
          :prop="'FPerimeter' + (i + 1) + 'Rate'"
          label="完成比例(%)"
          align="center"
          header-align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column label="总计" header-align="center">
        <el-table-column
          prop="FAllCount"
          label="目标任务(个)"
          align="center"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="FAllFinish"
          label="已完成(个)"
          align="center"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="FAllRate"
          label="完成比例(%)"
          align="center"
          header-align="center">
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import _ from 'lodash'
import { formatDate } from '../../assets/js/date'
import fileDownload from 'js-file-download'
export default {
  computed: {
    proName () {
      let name = _.find(this.proOptions, {value: this.problem}).label
      return name
    },
    edgeName () {
      let self = this
      let name = ''
      _.each(this.edgeOptions, function (obj) {
        if (self.edge === obj.value) {
          name = obj.label
        }
      })
      return name
    }
  },
  data () {
    return {
      breadcrumb: [],
      tableData: [],
      items: [
        '乱搭乱建',
        '乱堆乱放',
        '废品垃圾',
        '乱采乱挖',
        '广告残留',
        '青山白化',
        '绿化缺失',
        '赤膊房',
        '矿山整治',
        '农田管理用房'
      ],
      edge: 0,
      problem: 1000011,
      edgeOptions: [],
      proOptions: [
        {
          label: '省级问题点位',
          value: 1000011
        },
        {
          label: '市级问题点位',
          value: 1000012
        },
        {
          label: '县级自查自纠点位',
          value: 1000013
        }
      ],
      loading: true,
      FYear: formatDate(new Date(), 'yyyy')
    }
  },
  methods: {
    /**
     * 获取面包屑
     */
    getBreadcrumb () {
      let blist = JSON.parse(sessionStorage.getItem('breadcrumb'))
      this.breadcrumb = [].concat(blist)
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
          let list = [{
            value: 0,
            label: '所有'
          }]
          _.each(data.object, (obj) => {
            list.push({
              value: Number(obj.FValue),
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
    getList () {
      let self = this
      if (!this.problem) {
        self.$message({
          message: '请选择问题点位',
          type: 'warning'
        })
        return false
      }
      // if (!this.edge) {
      //   self.$message({
      //     message: '请选择四边',
      //     type: 'warning'
      //   })
      //   return false
      // }
      this.loading = true
      this.$axios.get('Statistical/GetPerimeterTable', {
        params: {
          FBillTypeID: this.problem,
          FPerimeter: this.edge
        }
      })
        .then(function (response) {
          let data = response.data
          self.loading = false
          if (data.code === 1) {
            self.tableData = [].concat(data.object)
          } else {
            self.$message.error(data.message)
          }
        })
        .catch(function (error) {
          self.loading = false
          console.log(error)
          self.$alert('获取数据失败', '温馨提示', {
            confirmButtonText: '确定'
          })
        })
    },
    /**
     * 搜索事件
     */
    search () {
      this.getList()
    },
    getExcel () {
      let self = this
      this.$axios.get('Statistical/GetFPerimetersExcel', {
        params: {
          FBillTypeID: this.problem,
          FPerimeter: this.edge
        },
        responseType: 'blob'
      })
        .then(function (response) {
          let fileName = '四边三化' + self.proName + self.edgeName + '统计表.xls'
          fileDownload(response.data, fileName)
        })
        .catch(function (error) {
          console.log(error)
          self.$alert(error.message, '温馨提示', {
            confirmButtonText: '确定'
          })
        })
    },
    download (data) {
      if (!data) {
        return
      }
      let url = window.URL.createObjectURL(new Blob([data]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', 'excel.xls')

      document.body.appendChild(link)
      link.click()
    }
  },
  created () {
    this.getEdge()
    this.getList()
    this.getBreadcrumb()
  }
}
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-input {
    width: 200px;
    display: inline-block;
  }
</style>
