<template>
  <el-dialog :title="title" :visible.sync="formShow" :before-close="handleClose" width="80%">
    <el-form :model="form"
             :rules="rules"
             :disabled="isDisabled"
             ref="probForm"
             class="demo-form-inline demo-ruleForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="年度月份" :label-width="formLabelWidth" prop="month">
            <el-date-picker
              v-model="form.month"
              type="month"
              placeholder="选择年度月份">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="四边" :label-width="formLabelWidth" prop="edge">
            <el-select v-model="form.edge">
              <el-option
                v-for="(item,i) in edgeOptions"
                :key="i"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="行政区划" :label-width="formLabelWidth" prop="adcd">
            <el-select v-model="form.adcd">
              <el-option
                v-for="(item,i) in adcdOptions"
                :key="i"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="乡镇街道" :label-width="formLabelWidth" prop="town">
            <el-input v-model="form.town" placeholder="请输入乡镇街道"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="线路名称" :label-width="formLabelWidth" prop="lineName">
            <el-input v-model="form.lineName" placeholder="请输入线路名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="里程" :label-width="formLabelWidth" prop="mileage">
            <el-input v-model="form.mileage" placeholder="请输入里程"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="定位信息" :label-width="formLabelWidth" prop="position">
            <el-input v-model="form.position" @focus="openMap"
                      placeholder="点击选择定位"></el-input>
          </el-form-item>
          <mapSelect :mapShow="mapSelectShow" @selectMap="closeMap" @selectPosition="setPosition"></mapSelect>
        </el-col>
        <el-col :span="12">
          <el-form-item label="问题类型" :label-width="formLabelWidth" prop="proType">
            <el-select v-model="form.proType" placeholder="请选择问题类型">
              <el-option
                v-for="(item, i) in proOptions"
                :key="i"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="问题描述" :label-width="formLabelWidth" prop="proDescribe">
            <el-input v-model="form.proDescribe"
                      type="textarea"
                      :rows="2"
                      placeholder="请输入问题描述"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
            <el-input v-model="form.remarks"
                      type="textarea"
                      :rows="2"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="整改前照片" :label-width="formLabelWidth">
            <el-upload
              ref="upload1"
              :action="url"
              :headers="headers"
              :auto-upload="false"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :data="files1.data"
              :file-list="files1.fileList"
              :beforeUpload="beforeAvatarUpload"
              :on-success="uploadSuccess"
              :on-change="onFilesChange"
              accept="image/*"
              multiple>
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过3MB</div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible"
                       append-to-body>
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="整改后照片" :label-width="formLabelWidth">
            <el-upload
              ref="upload2"
              :action="url"
              :headers="headers"
              :auto-upload="false"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :data="files2.data"
              :file-list="files2.fileList"
              :beforeUpload="beforeAvatarUpload"
              :on-success="uploadSuccess"
              :on-change="onFilesChange"
              accept="image/*"
              multiple>
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过3MB</div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible"
                       append-to-body>
              <img width="100%" :src="dialogImageUrl" alt="">
              <div class="text-center"><a :href="dialogImageUrl" download target="_blank">下载</a></div>
            </el-dialog>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isEdit">
        <el-col :span="24">
          <el-form-item>
          <h3>审核历史</h3>
          <hr/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-table
              :data="auditList"
              max-height="250"
              style="width: 100%">
              <el-table-column
                prop="FAddTime"
                label="日期"
                width="180"
                :formatter="formatDatetime">
              </el-table-column>
              <el-table-column
                prop="FLevelName"
                label="事件"
                width="180">
              </el-table-column>
              <el-table-column
                prop="FName"
                label="操作用户"
                width="180">
              </el-table-column>
              <el-table-column
                prop="FRemark"
                label="结果">
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" v-cloak>
      <el-button @click="handleClose">关 闭</el-button>
      <el-button type="primary" @click="isDisabled = !isDisabled" v-if="isEdit && submitPossession && isDisabled">编 辑</el-button>
      <el-button @click="resetForm('probForm')" v-if="!isEdit && !form.FStatus && !isDisabled">重置</el-button>
      <el-button type="primary" @click="submit('probForm')" v-if="!form.FStatus && !isDisabled">保 存</el-button>
      <el-button type="primary" @click="submitAudit" v-if="isEdit && submitPossession && isDisabled">整改完成</el-button>
      <el-button type="primary" @click="openAudit" v-if="isEdit && auditPossession && isDisabled">立即审核</el-button>
      <problem-audit :dialogAudit="dialogAuditShow" :auditData="auditData" @closeAudit="closeAudit" @closePro="closePro"></problem-audit>
    </div>
  </el-dialog>
</template>

<script>
import mapSelect from './MapSelect.vue'
import problemAudit from './ProblemAudit.vue'
import {formatDate} from '../../assets/js/date.js'
import _ from 'lodash'

export default {
  components: {
    problemAudit,
    mapSelect
  },
  computed: {
    url () {
      return this.$axios.defaults.baseURL + 'Files/UploadFileForQiNiu'
    },
    headers () {
      return {
        Authorization: 'Bearer ' + this.$cookies.get('TZManage')
      }
    },
    auditData () {
      let data = {
        FBillTypeID: this.billTypeId,
        FID: this.fid,
        FCheckLevel: this.form.FCheckLevel
      }
      return JSON.stringify(data)
    }
  },
  data () {
    return {
      isEdit: false,
      isDisabled: false,
      title: '新增问题',
      mapSelectShow: false,
      dialogAuditShow: false,
      filesChange: false,
      submitPossession: false,
      auditPossession: false,
      form: {
        isSubmited: false,
        fid: this.fid,
        billTypeId: this.billTypeId,
        billNo: '',
        adcd: '',
        edge: 1,
        town: '',
        year: '',
        month: formatDate(new Date(), 'yyyy-M'),
        proNum: '',
        lineName: '',
        mileage: '',
        position: this.sposition,
        proType: 1,
        proDescribe: '',
        remarks: '',
        FStatus: 4,
        FChangeStatusName: 0,
        FCheckLevel: 0
      },
      files1: {
        data: {},
        fileList: []
      },
      files2: {
        data: {},
        fileList: []
      },
      formLabelWidth: '120px',
      adcdOptions: [],
      edgeOptions: [],
      proOptions: [],
      auditList: [],
      rules: {
        adcd: [
          {type: 'number', required: true, message: '请选择行政区划', trigger: 'change'}
        ],
        edge: [
          {type: 'number', required: true, message: '请选择', trigger: 'change'}
        ],
        town: [
          {required: true, message: '请输入乡镇街道', trigger: 'blur'}
        ],
        month: [
          {required: true, message: '请选择年度月份', trigger: 'change'}
        ],
        mileage: [
          {required: true, message: '请输入里程', trigger: 'blur'}
        ],
        proType: [
          {type: 'number', required: true, message: '请选择问题类型', trigger: 'change'}
        ],
        lineName: [
          {required: true, message: '请输入线路名称', trigger: 'blur'}
        ],
        position: [
          {required: false}
        ],
        proDescribe: [
          {required: true, message: '请输入问题描述', trigger: 'blur'}
        ],
        remarks: [
          {required: false}
        ]
      },
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    handleClose () {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$emit('closeProAdd', false)
        })
        .catch(_ => {
        })
    },
    getBillTypeId () {
      this.billTypeID = this.$route.params.btid
    },
    getHearder () {
      return 'Bearer ' + this.$cookies.get('TZManage')
    },
    openMap () {
      this.mapSelectShow = true
    },
    /**
     * 关闭地图
     */
    closeMap (msg) {
      this.mapSelectShow = msg
    },
    setPosition (msg) {
      this.form.position = msg.lng + ',' + msg.lat
    },
    getAdcd () {
      let self = this
      this.$axios.get('Common/GetAgencyList')
        .then(response => {
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
          self.adcdOptions = [].concat(adcdlist)
        })
        .catch(error => {
          console.log(error)
          self.$alert(error.message, '温馨提示', {
            confirmButtonText: '确定'
          })
        })
    },
    getEdge () {
      let self = this
      this.$axios.get('Common/GetEnumList', {
        params: {
          EnumType: '四边'
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
          self.edgeOptions = [].concat(list)
        })
        .catch(error => {
          console.log(error)
          self.$alert(error.message, '温馨提示', {
            confirmButtonText: '确定'
          })
        })
    },
    getProblemType () {
      let self = this
      this.$axios.get('Common/GetEnumList', {
        params: {
          EnumType: '问题类型'
        }
      })
        .then(response => {
          let data = response.data
          let ptypelist = []
          _.each(data.object, (obj) => {
            ptypelist.push({
              value: obj.FValue,
              label: obj.FName
            })
          })
          self.proOptions = [].concat(ptypelist)
        })
        .catch(error => {
          console.log(error)
          self.$alert(error.message, '温馨提示', {
            confirmButtonText: '确定'
          })
        })
    },
    /**
     * 获取问题详情
     */
    getInfo () {
      let self = this
      this.getAuditList()
      this.$axios.get('LoanApply/GetApplyInfo', {
        params: {
          FID: this.fid
        }
      })
        .then(response => {
          let data = response.data
          if (data.code === 1) {
            let obj = data.object
            self.form = {
              isSubmited: false,
              fid: obj.FID,
              billTypeId: obj.FBillTypeID,
              billNo: obj.FBillNo,
              adcd: Number(obj.FAgencyValue),
              edge: obj.FPerimeter,
              town: obj.FTwon,
              year: obj.FYear,
              month: obj.FYear + '-' + obj.FMonth,
              lineName: obj.FLineName,
              mileage: obj.FMileage,
              position: obj.FGPS,
              proType: obj.FProbTypeID,
              proDescribe: obj.FProbDescribe,
              remarks: obj.FRemark,
              FStatus: obj.FStatus,
              FChangeStatusName: obj.FChangeStatusName,
              FCheckLevel: obj.FCheckLevel
            }
            self.getAttachTypeList(obj.FID)
            if (obj.FStatus !== 0) {
              self.isDisabled = true
            }
            self.getSubmitPossession()
            self.getAuditPossession()
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
    /**
     * 重置表单
     */
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    /**
     * 提交数据
     */
    submit (formName) {
      let self = this
      if (self.form.isSubmited === false) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              FBillTypeID: self.billTypeId,
              FBillNo: self.form.billNo,
              FAgencyValue: self.form.adcd,
              FPerimeter: self.form.edge,
              FYear: Number(self.form.month.substring(0, 4)),
              FMonth: Number(self.form.month.substring(5)),
              FLineName: self.form.lineName,
              FMileage: self.form.mileage,
              FProbTypeID: self.form.proType,
              FProbDescribe: self.form.proDescribe,
              FGPS: self.form.position,
              FTwon: self.form.town,
              FRemark: self.form.remarks
            }
            if (self.isEdit) {
              data.FID = self.form.fid
            }
            this.$axios.post('LoanApply/SaveSJApply', data)
              .then(response => {
                let data = response.data
                if (data.code === 1) {
                  self.form.fid = data.object
                  self.form.isSubmited = true
                  self.getAttachTypeList(self.form.fid, true)
                  if (!self.filesChange) {
                    self.$message({
                      message: self.isEdit !== '' ? '修改成功' : '新增成功！',
                      type: 'success'
                    })
                    self.$emit('closeProAdd', false)
                  }
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
      } else {
        self.submitUpload1()
        self.submitUpload2()
      }
    },
    getAttachTypeList (FLoanID, isUpload) {
      let self = this
      this.$axios.get('Files/GetAttachTypeList', {
        params: {
          FBillTypeID: self.billTypeId
        }
      })
        .then(response => {
          let data = response.data
          if (data.code === 1) {
            _.each(data.object, obj => {
              if (obj.FName === '整改前照片') {
                self.files1.data.FLoanID = FLoanID
                self.files1.data.AttachType = obj.FID
                self.files1.data.FBillTypeID = Number(self.billTypeId)
                if (isUpload) {
                  self.submitUpload1()
                } else {
                  self.files1.fileList = []
                  self.getFilesUrl(self.files1, obj.FID)
                }
              } else if (obj.FName === '整改后照片') {
                self.files2.data.FLoanID = FLoanID
                self.files2.data.AttachType = obj.FID
                self.files2.data.FBillTypeID = Number(self.billTypeId)
                if (isUpload) {
                  self.submitUpload2()
                } else {
                  self.files2.fileList = []
                  self.getFilesUrl(self.files2, obj.FID)
                }
              }
            })
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
    /**
     * 获取整改照片地址
     */
    getFilesUrl: function (files, FAttachType) {
      let self = this
      this.$axios.get('Files/GetFilesUrl', {
        params: {
          FAttachType: FAttachType,
          FLoanID: this.fid,
          FBillTypeID: this.billTypeId
        }
      })
        .then(response => {
          let data = response.data
          if (data.code === 1) {
            _.each(data.object, function (obj) {
              files.fileList.push({
                name: obj.FileName,
                url: obj.FileUrl
              })
            })
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
    onFilesChange (file, fileList) {
      this.filesChange = true
    },
    /**
     * 提交整改前照片
     */
    submitUpload1 () {
      this.$refs.upload1.submit()
    },
    /**
     * 提交整改后照片
     */
    submitUpload2 () {
      this.$refs.upload2.submit()
    },
    beforeAvatarUpload (file) {
      // console.log(file)
      var testmsg = file.type.substring(0, file.type.lastIndexOf('/') + 1)
      const extension = testmsg === 'image/'
      const isLt2M = file.size / 1024 / 1024 < 3
      if (!extension) {
        this.$message({
          message: '上传文件只能是图片文件!',
          type: 'warning'
        })
      }
      if (!isLt2M) {
        this.$message({
          message: '上传图片大小不能超过 3MB!',
          type: 'warning'
        })
      }
      return extension && isLt2M
    },
    uploadSuccess (response, file, fileLis) {
      let self = this
      let data = response
      // console.log(response)
      if (data.code === 1) {
        this.form.isSubmited = false
        this.filesChange = false
        this.$message({
          message: self.isEdit !== '' ? '修改成功' : '新增成功！',
          type: 'success'
        })
        this.$emit('closeProAdd', false)
      } else {
        this.$message({
          message: data.message,
          type: 'warning'
        })
      }
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleError () {
      this.$notify.error({
        title: '上传失败',
        message: '图片上传接口上传失败，可更改为自己的服务器接口'
      })
    },
    submitAudit () {
      let self = this
      this.$axios.post('LoanApply/SubmitSJApply', {
        FBillTypeID: self.billTypeId,
        FID: self.form.fid
      })
        .then(response => {
          let data = response.data
          if (data.code === 1) {
            self.$message({
              message: '提交审核成功',
              type: 'success'
            })
            this.$emit('closeProAdd', false)
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
    openAudit () {
      this.dialogAuditShow = true
    },
    closeAudit (msg) {
      this.dialogAuditShow = false
    },
    closePro (msg) {
      console.log(msg)
      location.reload()
    },
    getAuditList () {
      let self = this
      this.$axios.get('LoanApply/GetCheckList', {
        params: {
          FLoanID: this.fid,
          FBillTypeID: this.billTypeId
        }
      })
        .then(response => {
          let data = response.data
          // console.log(data)
          if (data.code === 1) {
            self.auditList = [].concat(data.object)
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
    formatDatetime (row, column, cellValue) {
      return formatDate(new Date(cellValue), 'yyyy-MM-dd hh:mm:ss')
    },
    // 编辑、提交整改权限
    getSubmitPossession () {
      let FLevel = Number(localStorage.getItem('FLevel'))
      let blist = JSON.parse(sessionStorage.getItem('breadcrumb'))
      let binx = _.indexOf(blist, '县级自查自纠点位')
      if (FLevel === 1) {
        if (this.form.FStatus === 0) {
          this.submitPossession = true
        } else {
          this.submitPossession = false
        }
      } else if (FLevel === 3 && binx === -1 && this.form.FStatus === 0) {
        this.submitPossession = true
      } else if (FLevel === 4 && binx > -1 && this.form.FStatus === 0) {
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
      if (FLevel === 1 || FLevel === 2) {
        if (this.form.FStatus === 1) {
          this.auditPossession = true
        } else {
          this.auditPossession = false
        }
      } else if (binx > -1 && this.form.FStatus === 1 && FLevel === 3) {
        this.auditPossession = true
      } else {
        this.auditPossession = false
      }
    },
    download (index, obj) {
      let filename = obj.name.split('.')[0]
      var $a = document.createElement('a')
      $a.setAttribute('href', obj.url)
      $a.setAttribute('download', filename)
      var evObj = document.createEvent('MouseEvents')
      evObj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null)
      $a.dispatchEvent(evObj)
    }
  },
  props: ['fid', 'formShow', 'sposition', 'billTypeId'],
  created () {
    this.getAdcd()
    this.getEdge()
    this.getProblemType()
  },
  watch: {
    formShow (curVal) {
      if (curVal === true) {
        if (this.fid) {
          this.isEdit = true
          this.isDisabled = true
          this.title = '问题详情'
          this.getInfo()
        } else {
          this.isEdit = false
          this.isDisabled = false
          this.form.FStatus = 0
          this.title = '新增问题'
        }
      } else {
        this.resetForm('probForm')
        Object.assign(this.$data.form, this.$options.data().form)
        Object.assign(this.$data.files1, this.$options.data().files1)
        Object.assign(this.$data.files2, this.$options.data().files2)
        Object.assign(this.$data.filesChange, this.$options.data().filesChange)
      }
    },
    fid (curVal) {
      this.form.fid = curVal
    },
    sposition (curVal) {
      this.form.position = curVal
    },
    billTypeId (curVal) {
      this.form.billTypeId = curVal
    }
  }
}
</script>
