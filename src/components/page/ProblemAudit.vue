<template>
  <el-dialog title="审核信息" :visible.sync="dialogAudit" :before-close="handleClose" width="60%" append-to-body>
    <el-form :model="form" ref="auditForm" size="small" v-if="isReturn">
      <el-form-item label="退回理由" :label-width="formLabelWidth" prop="FlowMessage">
        <el-input v-model="form.FlowMessage"
                  type="textarea"
                  :rows="3"
                  :rules="[{ required: true, message: '退回意见不能为空'}]"
                  placeholder="请输入退回理由"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="form" ref="auditForm" v-else>
      <el-form-item label="审核意见" :label-width="formLabelWidth" prop="FlowMessage">
        <el-input v-model="form.FlowMessage"
                  type="textarea"
                  :rows="3"
                  :rules="[{ required: true, message: '审核意见不能为空'}]"
                  placeholder="审核通过可不填，若审核不通过则必填"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="isReturn">
      <el-button type="danger" @click="auditReject">退回</el-button>
    </div>
    <div slot="footer" class="dialog-footer" v-else>
      <el-button type="danger" @click="auditReject">审核不通过</el-button>
      <el-button type="success" @click="AuditPass">审核通过</el-button>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      isReturn: false,
      form: {
        FlowMessage: ''
      },
      formLabelWidth: '120px'
    }
  },
  watch: {
    dialogAudit (curVul) {
      if (curVul) {
        let FLevel = Number(localStorage.getItem('FLevel'))
        let blist = JSON.parse(sessionStorage.getItem('breadcrumb'))
        let FStatus = JSON.parse(this.auditData).FStatus
        let binx = _.indexOf(blist, '县级自查自纠点位')
        if (binx > -1 && FStatus === 2 && (FLevel === 1 || FLevel === 2)) {
          this.isReturn = true
        } else {
          this.isReturn = false
        }
      } else {
        Object.assign(this.$data.form, this.$options.data().form)
      }
    }
  },
  methods: {
    handleClose () {
      this.$emit('closeAudit', false)
    },
    probClose (msg) {
      // console.log(msg)
      this.$emit('closeAudit', msg)
      this.$emit('closePro', false)
    },
    AuditPass () {
      let self = this
      let data = JSON.parse(this.auditData)
      this.$axios.post('Flow/AdoptApply', {
        FBillTypeID: data.FBillTypeID,
        FID: data.FID,
        FCurrentLevel: data.FCheckLevel,
        FlowMessage: this.form.FlowMessage
      })
        .then(response => {
          let data = response.data
          if (data.code === 1) {
            self.$message({
              message: '审核通过',
              type: 'success'
            })
            self.probClose(true)
          } else {
            self.$message({
              message: data.message,
              type: 'warning'
            })
          }
        })
        .catch(error => {
          // console.log(error)
          self.$message.error(error.message)
        })
    },
    auditReject () {
      let self = this
      this.$refs['auditForm'].validate((valid) => {
        if (valid) {
          let data = JSON.parse(this.auditData)
          if (this.form.FlowMessage === '') {
            self.$message({
              message: '请输入不通过原因',
              type: 'warning'
            })
            return false
          }
          this.$axios.post('Flow/RejectApply', {
            FBillTypeID: data.FBillTypeID,
            FID: data.FID,
            FCurrentLevel: data.FCheckLevel,
            FlowMessage: this.form.FlowMessage
          })
            .then(response => {
              let data = response.data
              if (data.code === 1) {
                self.$message({
                  message: '操作成功',
                  type: 'success'
                })
                self.probClose(true)
              } else {
                self.$message({
                  message: data.message,
                  type: 'warning'
                })
              }
            })
            .catch(error => {
              // console.log(error)
              self.$message.error(error.message)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  props: ['dialogAudit', 'auditData']
}
</script>

<style scoped>

</style>
