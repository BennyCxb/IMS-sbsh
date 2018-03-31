<template>
  <el-dialog :title="title" :visible.sync="formShow" :before-close="handleClose" width="80%">
    <el-form :model="form"
             :rules="rules"
             :disabled="form.FStatus !== 0 && !form.FChangeStatusName"
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
      <!--<el-row>-->
        <!--<el-col :span="24">-->
          <!--<el-form-item label="整改后照片" :label-width="formLabelWidth">-->
            <!--<el-upload-->
              <!--ref="upload2"-->
              <!--:action="url"-->
              <!--:headers="headers"-->
              <!--:auto-upload="false"-->
              <!--list-type="picture-card"-->
              <!--:on-preview="handlePictureCardPreview"-->
              <!--:data="files2.data"-->
              <!--:file-list="files2.fileList"-->
              <!--accept="image/*"-->
              <!--:on-success="uploadSuccess"-->
              <!--multiple>-->
              <!--<i class="el-icon-plus"></i>-->
            <!--</el-upload>-->
            <!--<el-dialog :visible.sync="dialogVisible"-->
                       <!--append-to-body>-->
              <!--<img width="100%" :src="dialogImageUrl" alt="">-->
            <!--</el-dialog>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->
    </el-form>
    <el-form class="demo-form-inline demo-ruleForm" :disabled="form.FStatus !== 0 && form.FChangeStatusName">
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
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="form.FStatus === 1">
      <el-button type="primary" @click="submit('probForm')">审核通过</el-button>
      <el-button @click="submit('probForm')">审核不通过</el-button>
    </div>
    <div slot="footer" class="dialog-footer" v-else>
      <el-button @click="resetForm('probForm')" v-if="!form.FStatus && !form.fid">重置</el-button>
      <el-button type="primary" @click="submit('probForm')" v-if="!form.FStatus">保 存</el-button>
      <el-button type="primary" @click="submitAudit" v-if="fid">提交审核</el-button>
    </div>
  </el-dialog>
</template>

<script>
import mapSelect from './MapSelect.vue'
import {formatDate} from '../../assets/js/date.js'
import _ from 'lodash'

export default {
  components: {
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
    }
  },
  data () {
    return {
      title: '新增问题',
      append: true,
      innerVisible: false,
      mapSelectShow: false,
      form: {
        isSubmited: false,
        fid: this.fid,
        billTypeId: this.billTypeId,
        billNo: '',
        adcd: 331002,
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
        FStatus: 0,
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
      // this.$emit('selectMap', true)
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
          _.each(data.object, (obj) => {
            adcdlist.push({
              value: Number(obj.FValue),
              label: obj.FName
            })
          })
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
      if (this.fid !== '') {
        this.title = '问题详情'
        // this.getFilesUrl()
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
        this.title = '新增问题'
      }
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
            if (self.form.fid !== '') {
              data.FID = self.form.fid
            }
            this.$axios.post('LoanApply/SaveSJApply', data)
              .then(response => {
                let data = response.data
                if (data.code === 1) {
                  self.form.fid = data.object
                  self.form.isSubmited = true
                  self.files1.data.FLoanID = self.form.fid
                  self.files2.data.FLoanID = self.form.fid
                  self.submitUpload()
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
        self.submitUpload()
      }
    },
    getAttachTypeList () {
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
                self.files1 = {
                  data: {
                    AttachType: obj.FID,
                    FBillTypeID: Number(self.billTypeId)
                  },
                  fileList: []
                }
                if (self.form.fid) {
                  self.getFilesUrl(self.files1, obj.FID)
                }
              } else if (obj.FName === '整改后照片') {
                self.files2.data = {
                  AttachType: obj.FID,
                  FBillTypeID: Number(self.billTypeId)
                }
                if (self.form.fid) {
                  self.getFilesUrl(self.files1, obj.FID)
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
      self.$axios.get('Files/GetFilesUrl', {
        params: {
          FAttachType: FAttachType,
          FLoanID: self.fid,
          FBillTypeID: self.billTypeId
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
    // 提交整改照片
    submitUpload () {
      console.log('upload')
      this.$refs.upload1.submit()
      this.$refs.upload2.submit()
    },
    beforeAvatarUpload (file) {
      console.log(file)
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
      console.log(response)
      if (data.code === 1) {
        this.$message({
          message: self.fid !== '' ? '修改成功' : '新增成功！',
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
            this.$message({
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
    }
  },
  props: ['fid', 'formShow', 'sposition', 'billTypeId'],
  created () {
    this.getAdcd()
    this.getEdge()
    this.getProblemType()
    this.getAttachTypeList()
  },
  watch: {
    formShow (curVal) {
      if (curVal === true) {
        this.getInfo()
        this.getAttachTypeList()
      } else {
        this.resetForm('probForm')
        Object.assign(this.$data.form, this.$options.data().form)
        Object.assign(this.$data.files1, this.$options.data().files1)
        Object.assign(this.$data.files2, this.$options.data().files2)
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
