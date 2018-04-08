<template>
  <el-dialog :title="title" :visible.sync="formShow" :before-close="handleClose" width="80%">
    <el-form :model="form"
             :rules="rules"
             :disabled="isDisabled"
             ref="probForm"
             class="demo-form-inline demo-ruleForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="年度月份" :label-width="formLabelWidth" prop="FMonth">
            <el-date-picker
              v-model="form.FMonth"
              type="month"
              placeholder="选择年度月份">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目名称" :label-width="formLabelWidth" prop="FPorjectName">
            <el-input v-model="form.FPorjectName" placeholder="请输入项目名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="行政区划" :label-width="formLabelWidth" prop="FAgencyValue">
            <el-select v-model="form.FAgencyValue">
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
          <el-form-item label="乡镇街道" :label-width="formLabelWidth" prop="FTwon">
            <el-input v-model="form.FTwon" placeholder="请输入乡镇街道"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="里程桩号" :label-width="formLabelWidth" prop="FMileage">
            <el-input v-model="form.FMileage" placeholder="里程桩号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="定位信息" :label-width="formLabelWidth" prop="FGPS">
            <el-input v-model="form.FGPS" @focus="openMap"
                      placeholder="点击选择定位"></el-input>
          </el-form-item>
          <mapSelect :mapShow="mapSelectShow" @selectMap="closeMap" @selectPosition="setPosition"></mapSelect>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="长度(km)" :label-width="formLabelWidth" prop="FLength">
            <el-input v-model="form.FLength" placeholder="请输入长度"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目类型" :label-width="formLabelWidth" prop="FProjectTypeID">
            <el-select v-model="form.FProjectTypeID" placeholder="请选择项目类型">
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
        <el-col :span="12">
          <el-form-item label="投资金额" :label-width="formLabelWidth" prop="FInvestment">
            <el-input v-model="form.FInvestment" placeholder="请输入投资金额"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划完工时间" :label-width="formLabelWidth" prop="FPlanDate">
            <el-date-picker
              v-model="form.FPlanDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="利用面积(m²)" :label-width="formLabelWidth" prop="FAcreage">
            <el-input v-model="form.FAcreage" placeholder="请输入利用面积"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用途" :label-width="formLabelWidth" prop="FPurpose">
            <el-input v-model="form.FPurpose" placeholder="请输入用途"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="负责单位" :label-width="formLabelWidth" prop="FAccountabilityUnit">
            <el-input v-model="form.FAccountabilityUnit" placeholder="请输入负责单位"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" :label-width="formLabelWidth" prop="FLiablePerson">
            <el-input v-model="form.FLiablePerson" placeholder="请输入联系人"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系方式" :label-width="formLabelWidth" prop="FMobile">
            <el-input v-model="form.FMobile" placeholder="请输入联系方式"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="项目简介" :label-width="formLabelWidth" prop="FSynopsis">
            <el-input v-model="form.FSynopsis"
                      type="textarea"
                      :rows="2"
                      placeholder="请输入项目简介"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" :label-width="formLabelWidth" prop="FRemark">
            <el-input v-model="form.FRemark"
                      type="textarea"
                      :rows="2"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item>
            <h3>创建进度</h3>
            <hr/>
          </el-form-item>
        </el-col>
      </el-row>
      <!--<el-row>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="已开工" :label-width="formLabelWidth">-->
            <!--<el-upload-->
              <!--class="upload-demo"-->
              <!--drag-->
              <!--ref="upload1"-->
              <!--:action="url"-->
              <!--:headers="headers"-->
              <!--:auto-upload="false"-->
              <!--:data="files1.data"-->
              <!--:file-list="files1.fileList"-->
              <!--:beforeUpload="beforeAvatarUpload"-->
              <!--:on-success="uploadSuccess"-->
              <!--:on-change="onFilesChange"-->
              <!--multiple>-->
              <!--<i class="el-icon-upload"></i>-->
              <!--<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
            <!--</el-upload>-->
            <!--<el-dialog :visible.sync="dialogVisible"-->
                       <!--append-to-body>-->
              <!--<img width="100%" :src="dialogImageUrl" alt="">-->
            <!--</el-dialog>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="情况说明" :label-width="formLabelWidth">-->
            <!--<el-input v-model="form.FRemark"-->
                      <!--type="textarea"-->
                      <!--:rows="3"></el-input>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="24">-->
          <!--<el-form-item :label-width="formLabelWidth">-->
          <!--<el-table-->
            <!--:data="files1.fileList"-->
            <!--style="width: 100%">-->
            <!--<el-table-column-->
              <!--prop="date"-->
              <!--label="日期"-->
              <!--width="180">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="name"-->
              <!--label="文件名"-->
              <!--width="280">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="address"-->
              <!--label="操作">-->
            <!--</el-table-column>-->
          <!--</el-table>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <el-row v-for="(item, i) in files" :key="i">
        <el-col :span="24" v-if="item.type === 'img'">
          <el-form-item :label="item.label" :label-width="formLabelWidth">
            <el-upload
              :ref="'upload' + i"
              :action="url"
              :headers="headers"
              :auto-upload="false"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :data="item.data"
              :file-list="item.fileList"
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
            <hr/>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-else-if="item.type === 'file'">
          <el-col :span="12">
            <el-form-item :label="item.label" :label-width="formLabelWidth">
              <el-upload
                class="upload-demo"
                drag
                :ref="'upload' + i"
                :action="url"
                :headers="headers"
                :auto-upload="false"
                :data="item.data"
                :show-file-list="false"
                :on-success="uploadSuccess"
                :on-change="onFilesChange"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
          </el-col>
          <!--<el-col :span="12">-->
            <!--<el-table-->
              <!--:data="item.fileList"-->
              <!--style="width: 100%">-->
              <!--<el-table-column-->
                <!--prop="name"-->
                <!--label="文件名">-->
              <!--</el-table-column>-->
              <!--<el-table-column-->
                <!--prop="address"-->
                <!--label="操作"-->
                <!--width="100">-->
                <!--<template slot-scope="scope">-->
                  <!--<el-button size="small"-->
                             <!--:disabled="false"-->
                             <!--@click="handleEdit(scope.$index, scope.row)">下载-->
                  <!--</el-button>-->
                <!--</template>-->
              <!--</el-table-column>-->
            <!--</el-table>-->
          <!--</el-col>-->
        </el-col>
      </el-row>
    </el-form>
    <el-form>
      <el-row>
        <el-col :span="24">
          <el-form-item :label-width="formLabelWidth">
            <el-table
              :data="files[4].fileList"
              max-height="300"
              style="width: 100%">
              <el-table-column
                prop="name"
                label="文件名">
              </el-table-column>
              <el-table-column
                prop="address"
                label="操作"
                width="180">
                <template slot-scope="scope">
                  <el-button size="small" icon="el-icon-download" title="下载"
                             @click="download(scope.$index, scope.row)">
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关 闭</el-button>
      <el-button type="primary" @click="isDisabled = !isDisabled" v-if="isDisabled">编 辑</el-button>
      <el-button @click="resetForm('probForm')" v-if="!form.FStatus && !isEdit && !isDisabled">重置</el-button>
      <el-button type="primary" @click="submit('probForm')" v-if="!form.FStatus && !isDisabled">保 存</el-button>
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
      title: '新增项目',
      mapSelectShow: false,
      dialogAuditShow: false,
      filesChange: false,
      form: {
        isSubmited: false,
        FID: this.fid,
        FBillTypeID: this.billTypeId,
        FMonth: formatDate(new Date(), 'yyyy-M'),
        FBillNo: '',
        FAgencyValue: '',
        FPorjectName: '',
        FTwon: '',
        FInvestment: '',
        FLength: '',
        FMileage: '',
        FGPS: this.sposition,
        FProjectTypeID: 1,
        FPlanDate: formatDate(new Date(), 'yyyy-MM-ss'),
        FAcreage: '',
        FPurpose: '',
        FAccountabilityUnit: '',
        FLiablePerson: '',
        FMobile: '',
        FSynopsis: '',
        FRemark: ''
      },
      files: [
        {
          label: '创建（利用）前照片',
          type: 'img',
          data: {},
          fileList: []
        },
        {
          label: '创建（利用）规划设计效果图',
          type: 'img',
          data: {},
          fileList: []
        },
        {
          label: '创建（利用）中照片',
          type: 'img',
          data: {},
          fileList: []
        },
        {
          label: '创建（利用）后照片',
          type: 'img',
          data: {},
          fileList: []
        },
        {
          label: '创建报告（文件形式）',
          type: 'file',
          data: {},
          fileList: []
        }
      ],
      formLabelWidth: '120px',
      adcdOptions: [],
      edgeOptions: [],
      proOptions: [],
      auditList: [],
      rules: {
        FMonth: [
          {required: true, message: '请选择年度月份', trigger: 'change'}
        ],
        FAgencyValue: [
          {type: 'number', required: true, message: '请选择行政区划', trigger: 'change'}
        ],
        FTwon: [
          {required: true, message: '请输入乡镇街道', trigger: 'blur'}
        ],
        FPorjectName: [
          {required: true, message: '请输入项目名称', trigger: 'blur'}
        ],
        FMileage: [
          {required: false, message: '请输入里程桩号', trigger: 'blur'}
        ],
        FProjectTypeID: [
          {type: 'number', required: true, message: '请选择项目类型', trigger: 'change'}
        ],
        FInvestment: [
          {required: false, message: '请输入投资金额', trigger: 'blur'}
        ],
        FLength: [
          {required: false, message: '请输入长度', trigger: 'blur'}
        ],
        FPlanDate: [
          {required: true, message: '请选择完工时间', trigger: 'change'}
        ],
        FAcreage: [
          {required: false, message: '请输入利用面积', trigger: 'blur'}
        ],
        FPurpose: [
          {required: false, message: '请输入用途', trigger: 'blur'}
        ],
        FAccountabilityUnit: [
          {required: false, message: '请输入负责单位', trigger: 'blur'}
        ],
        FLiablePerson: [
          {required: false, message: '请输入联系人', trigger: 'blur'}
        ],
        FMobile: [
          {required: false, message: '请输入联系方式', trigger: 'blur'}
        ],
        FSynopsis: [
          {required: true, message: '请输入项目简介', trigger: 'blur'}
        ],
        FRemark: [
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
      this.form.FGPS = msg.lng + ',' + msg.lat
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
            self.form.FAgencyValue = Number(item.FValue)
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
    getProblemType () {
      let self = this
      this.$axios.get('Common/GetEnumList', {
        params: {
          EnumType: '项目类型'
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
              FID: obj.FID,
              FBillTypeID: obj.FBillTypeID,
              FMonth: obj.FYear + '-' + obj.FMonth,
              FBillNo: obj.FBillNo,
              FAgencyValue: Number(obj.FAgencyValue),
              FPorjectName: obj.FPorjectName,
              FTwon: obj.FTwon,
              FInvestment: obj.FInvestment,
              FLength: obj.FLength,
              FMileage: obj.FMileage,
              FGPS: obj.FGPS,
              FProjectTypeID: obj.FProjectTypeID,
              FPlanDate: obj.FPlanDate,
              FAcreage: obj.FAcreage,
              FPurpose: obj.FPurpose,
              FAccountabilityUnit: obj.FAccountabilityUnit,
              FLiablePerson: obj.FLiablePerson,
              FMobile: obj.FMobile,
              FSynopsis: obj.FSynopsis,
              FRemark: obj.FRemark
            }
            self.getAttachTypeList(obj.FID)
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
              FBillTypeID: self.form.FBillTypeID,
              FYear: Number(self.form.FMonth.substring(0, 4)),
              FMonth: Number(self.form.FMonth.substring(5)),
              FBillNo: self.form.FBillNo,
              FAgencyValue: self.form.FAgencyValue,
              FPorjectName: self.form.FPorjectName,
              FTwon: self.form.FTwon,
              FInvestment: self.form.FInvestment,
              FLength: self.form.FLength,
              FMileage: self.form.FMileage,
              FGPS: self.form.FGPS,
              FProjectTypeID: self.form.FProjectTypeID,
              FPlanDate: self.form.FPlanDate,
              FAcreage: self.form.FAcreage,
              FPurpose: self.form.FPurpose,
              FAccountabilityUnit: self.form.FAccountabilityUnit,
              FLiablePerson: self.form.FLiablePerson,
              FMobile: self.form.FMobile,
              FSynopsis: self.form.FSynopsis,
              FRemark: self.form.FRemark
            }
            if (self.isEdit) {
              data.FID = self.form.FID
            }
            this.$axios.post('LoanApply/SaveQXApply', data)
              .then(response => {
                let data = response.data
                if (data.code === 1) {
                  self.form.FID = data.object
                  self.form.isSubmited = true
                  self.getAttachTypeList(self.form.FID, true)
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
        self.submitUpload()
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
            var switchFiles = (obj, index) => {
              self.files[index].data.FLoanID = FLoanID
              self.files[index].data.AttachType = obj.FID
              self.files[index].data.FBillTypeID = Number(self.billTypeId)
              if (!isUpload) {
                self.files[index].fileList = []
                self.getFilesUrl(self.files[index], obj.FID)
              }
            }
            _.each(data.object, obj => {
              switch (obj.FName) {
                case '创建（利用）前照片':
                  switchFiles(obj, 0)
                  break
                case '创建（利用）规划设计效果图':
                  switchFiles(obj, 1)
                  break
                case '创建（利用）中照片':
                  switchFiles(obj, 2)
                  break
                case '创建（利用）后照片':
                  switchFiles(obj, 3)
                  break
                case '创建报告（文件形式）':
                  switchFiles(obj, 4)
                  break
              }
            })
            if (isUpload) {
              self.submitUpload()
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
     * 提交照片/文件
     */
    submitUpload () {
      this.$refs.upload0[0].submit()
      this.$refs.upload1[0].submit()
      this.$refs.upload2[0].submit()
      this.$refs.upload3[0].submit()
      this.$refs.upload4[0].submit()
    },
    beforeAvatarUpload (file) {
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
    formatDatetime (row, column, cellValue) {
      return formatDate(new Date(cellValue), 'yyyy-MM-dd hh:mm:ss')
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
    this.getProblemType()
  },
  watch: {
    formShow (curVal) {
      if (curVal === true) {
        if (this.fid) {
          this.isEdit = true
          this.isDisabled = true
          this.title = '项目详情'
          this.getInfo()
        } else {
          this.isEdit = false
          this.isDisabled = false
          this.title = '新增项目'
        }
      } else {
        this.resetForm('probForm')
        Object.assign(this.$data.form, this.$options.data().form)
        Object.assign(this.$data.files[0], this.$options.data().files[0])
        Object.assign(this.$data.files[1], this.$options.data().files[1])
        Object.assign(this.$data.files[2], this.$options.data().files[2])
        Object.assign(this.$data.files[3], this.$options.data().files[3])
        Object.assign(this.$data.files[4], this.$options.data().files[4])
        Object.assign(this.$data.filesChange, this.$options.data().filesChange)
      }
    },
    fid (curVal) {
      this.form.FID = curVal
    },
    sposition (curVal) {
      this.form.FGPS = curVal
    },
    billTypeId (curVal) {
      this.form.FBillTypeID = curVal
    }
  }
}
</script>
