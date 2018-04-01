<template>
  <el-dialog title="审核信息" :visible.sync="dialogAudit" :before-close="handleClose" width="60%" append-to-body>
    <el-form :model="form" ref="auditForm">
      <el-form-item label="审核意见" :label-width="formLabelWidth" prop="FlowMessage">
        <el-input v-model="form.FlowMessage"
                  type="textarea"
                  :rows="3"
                  :rules="[{ required: true, message: '审核意见不能为空'}]"
                  placeholder="审核通过可不填，若审核不通过则必填"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" @click="auditReject">审核不通过</el-button>
      <el-button type="primary" @click="AuditPass">审核通过</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      form: {
        FlowMessage: ''
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    handleClose () {
      this.$emit('closeAudit', false)
    },
    probClose (msg) {
      console.log(msg)
      this.$emit('closeAudit', msg)
      this.$emit('closePro', false)
    },
    AuditPass () {
      let self = this
      let data = JSON.parse(this.auditData)
      this.$axios.post('LoanApply/AdoptSJApply', {
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
          console.log(error)
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
          this.$axios.post('LoanApply/RejectSJApply', {
            FBillTypeID: data.FBillTypeID,
            FID: data.FID,
            FCurrentLevel: data.FCheckLevel,
            FlowMessage: this.form.FlowMessage
          })
            .then(response => {
              let data = response.data
              if (data.code === 1) {
                self.$message({
                  message: '审核不通过',
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
              console.log(error)
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
