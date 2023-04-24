<template>
  <div class="atomic-cases-add">
      <div class="steps"> 
          <el-steps :space="400" :active="step" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="参数配置"></el-step>
          <el-step title="结果检查"></el-step>
        </el-steps>
      </div>
      <div class="stepOne" v-show="step == '1'">
        <div class="headerTitle">基本信息</div>
        <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="120px" class="baseForm">
          <el-row>
            <el-col :span="9">
              <el-form-item label="接口名称" prop="name">
                <el-input v-model="formData.name" readonly/>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="接口地址" prop="address">
                <el-input v-model="formData.address" readonly/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="接口版本" prop="case">
                <el-input v-model="formData.version" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="9">
              <el-form-item label="用例名称" prop="case_title">
                <el-input v-model="formData.case_title" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="用例类型" prop="case_type">
                <el-select v-model="formData.case_type" placeholder="请选择" width="100%">
                  <el-option key="正常" label="正常" value="正常"></el-option>
                  <el-option key="异常" label="异常" value="异常"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="等待时间" prop="wait_time">
                <el-input-number v-model="formData.wait_time"  controls-position="right" :min="0" style='width:calc(100% - 20px);height:32px'/>
                <span class="tip">
                  <el-popover
                  placement="right"
                  title="Note"
                  :width="220"
                  trigger="hover"
                  content="内容：执行当前用例的等待时间，单位为秒"
                  >
                    <template #reference>
                      <i class="el-icon-question"></i>
                    </template>
                  </el-popover>
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="用例描述" prop="case_desc">
                <el-input v-model="formData.case_desc" :rows="2" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="applyTitle">Headers:</div>
        <el-table :data="applyTableData" stripe class="headerTable" :default-expand-all="true" row-key="index" :tree-props="{children: 'children'}">
          <el-table-column :show-overflow-tooltip="true" prop="name" label="参数名称">
            <template v-slot="scope">
              <el-input v-model="scope.row.name" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="required" label="是否必须" :formatter="change" />
          <el-table-column :show-overflow-tooltip="true" prop="desc" label="备注" />
          <el-table-column :show-overflow-tooltip="true" prop="value" label="参数值">
            <template v-slot="scope">
              <el-input v-model="scope.row.value" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="" label="">
            <template v-slot="scope">
              <i class="el-icon-circle-plus-outline" style="font-size:20px;margin:0 18px;cursor: pointer;" @click="addHeaderInfo(scope.row)"></i>
              <i class="el-icon-delete" style="font-size:20px;cursor: pointer;" @click="deleteHeaderInfo(scope.row)" v-show="scope.row.name!=='Content-Type'&&scope.row.name!=='username'&&scope.row.name!=='password'"></i>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="next" @click="changeStep('2','1')" type="primary">下一步</el-button>
      </div>
      <div class="stepTwo" v-show="step == '2'">
        <el-tabs v-model:activeName="data.activeName" @tab-click="handleClick" class="table-box">
          <el-tab-pane label="全量配置" name="0" ref="sectionRef">
            <div class="headerTitle">请求参数</div>
            <el-table :data="queryTableData" :default-expand-all="true" stripe class="headerTable" row-key="name" :tree-props="{children: 'children'}">
              <el-table-column :show-overflow-tooltip="true" prop="name" label="参数名称"/>
              <el-table-column :show-overflow-tooltip="true" prop="type" label="参数类型"/>
              <el-table-column :show-overflow-tooltip="true" prop="required" label="是否必须" :formatter="change" />
              <el-table-column :show-overflow-tooltip="true" prop="description" label="字段含义"/>
              <el-table-column :show-overflow-tooltip="true" prop="value" label="参数值">
                <template v-slot="scope">
                  <el-input v-model="scope.row.value" size="small"></el-input>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="value" label="是否参数化">
                <template v-slot="scope">
                  <el-checkbox v-model="scope.row.checked" @change="queryCheck">{{scope.row.checked?'是':'否'}}</el-checkbox>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="queryName" label="参数化名称"/>
              <el-table-column :show-overflow-tooltip="true" prop="queryValue" label="参数化值"/>
            </el-table>
            <div class="headerTitle">响应参数</div>
            <el-table :data="backTableData" :default-expand-all="true" stripe class="headerTable" row-key="name" :tree-props="{children: 'children'}">
              <el-table-column :show-overflow-tooltip="true" prop="name" label="参数名称"/>
              <el-table-column :show-overflow-tooltip="true" prop="type" label="类型"/>
              <el-table-column :show-overflow-tooltip="true" prop="required" label="是否必须" :formatter="change" />
              <el-table-column :show-overflow-tooltip="true" prop="value" label="默认值"/>
              <el-table-column :show-overflow-tooltip="true" prop="description" label="字段含义"/>
              <el-table-column :show-overflow-tooltip="true" prop="value" label="是否参数化">
                <template v-slot="scope">
                  <el-checkbox v-model="scope.row.checked" @change="responseCheck()">{{scope.row.checked?'是':'否'}}</el-checkbox>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="resonseName" label="参数化名称">
                <template v-slot="scope">
                  <el-input v-model="scope.row.resonseName" :disabled="!scope.row.checked">{{scope.row.checked?scope.row.resonseName:''}}</el-input>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="responseUrl" label="参数路径"/>
            </el-table>
            <div class="btns">
              <el-button class="btns-next" @click="changeStep('3','2')" type="primary">下一步</el-button>
              <el-button @click="changeStep('1','2')">上一步</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="高级配置" name="1" ref="sectionRef">
            <el-alert
              title="高级配置只支持请求参数和响应参数基础的参数值的配置，其他的参数化配置依然需要在全量配置急么进行配置"
              type="info"
              show-icon>
            </el-alert>
            <div style='font-size:12px;margin: 15px 0 ;'><span style="color: red">*</span >请求参数</div>
              <JsonEditorVue v-model="requestJson" @blur="validate" currentMode="text"/>
              <!-- <vue-json-editor
                v-model="requestJson"
                :showBtns="false"
                :mode="'code'"
                @json-change="onJsonChange"
                @json-save="onJsonSave"
                @has-error="onError"
              /> -->
            <div style='font-size:12px;margin: 15px 0'><span style="color: red">*</span>响应参数</div>
            <JsonEditorVue v-model="responseJson" @blur="validate" currentMode="text"/>

            <!-- <vue-json-editor
                v-model="responseJson"
                :showBtns="false"
                :mode="'code'"
                @json-change="onJsonChange"
                @json-save="onJsonSave"
                @has-error="onError"
              /> -->
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="stepThree" v-show="step == '3'">
        <div class="headerTitle">结果检查</div>
        <div>
          <span class="checkTitle">检查类型：</span>
          <div class="inputView">响应参数</div>
          <span class="checkName">数据库名称：</span>
          <div class="rightPart">
            <div class="inputView">{{dbName}}</div>
            <span class="tip">
            <el-popover
            placement="right"
            title="Note"
            :width="220"
            trigger="click"
            content="当前接口检查会从标记的数据库中进行数据获取，如果数据获取的库名与系统给的不一致，需要手动在SQL中进行库名指定，比如：select * from icode_upms.sys_category"
            >
              <template #reference>
                <i class="el-icon-question"></i>
              </template>
            </el-popover>
          </span>
          </div>
        </div>
        <el-alert
        title="响应参数中的响应码为必须校验内容，其他内容根据实际需要填写,目前响应码为固定值，其他数据只支持从数据库查询"
        type="info"
        class="tipInfo"
        show-icon>
        </el-alert>
        <div class="sqlCheck">
          <span class="checkTitle">检查sql：</span>
          <el-input
            type="textarea"
            :rows="3"
            v-model="checkSql.response"
            style="width:650px">
          </el-input>
          <span class="tipTwo">
            <el-popover
            placement="right"
            title="Note"
            :width="220"
            trigger="click"
            content="当前的检查sql只针对响应数据的第一层json的数据，为空，则第一层不进行统一数据获取"
            >
              <template #reference>
                <i class="el-icon-question"></i>
              </template>
            </el-popover>
          </span>
        </div>
        <el-table :data="checkResponseTableData" :default-expand-all="true" stripe class="headerTable" row-key="name" :tree-props="{children: 'children'}">
          <el-table-column :show-overflow-tooltip="true" prop="name" label="参数名称" width="auto"/>
          <el-table-column :show-overflow-tooltip="true" prop="type" label="类型" width="auto"/>
          <el-table-column :show-overflow-tooltip="true" prop="description" label="字段含义"/>
          <el-table-column :show-overflow-tooltip="true" prop="value" label="参数值" width="auto"/>
          <el-table-column :show-overflow-tooltip="true" prop="checked" label="是否检查" width="auto">
            <template v-slot="scope">
              <el-checkbox v-if="scope.row.name!=='code'" v-model="scope.row.isChecked" @change="responseSqlCheck(scope.row)">{{scope.row.isChecked?'是':'否'}}</el-checkbox>
              <el-checkbox v-if="scope.row.name=='code'" v-model="scope.row.isChecked" disabled>是</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="checkValue" label="检查值" width="500">
            <template v-slot="scope">
              <el-input v-model="scope.row.checkValue" :disabled="!scope.row.isChecked" size="small" @click="inputFoucus(scope.row)" @blur="inputBlur" @input="inputChange"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div class="headerTitle">检查值配置</div>
          <el-input
              type="textarea"
              :rows="3"
              :disabled="itemSqlDisabled"
              v-model="checkSql.itemSql"
              @input="itemSqlChange"
              style="width:750px;margin:0 0 30px 50px">
          </el-input>
        <div>
          <span class="checkTitle">检查类型：</span>
          <div class="inputView">请求参数</div>
        </div>
        <el-alert
        title="请求参数针对所有的字段进行校验，不支持字段选择，检查的sql为空，则不检查"
        type="info"
        class="tipInfo"
        show-icon>
        </el-alert>
        <div class="sqlCheck">
          <span class="checkTitle">检查sql：</span>
          <el-input
            type="textarea"
            :rows="3"
            v-model="checkSql.request"
            style="width:650px">
          </el-input>
        </div>
        <el-table :data="checkQueryTableData" :default-expand-all="true" stripe class="headerTable" row-key="name" :tree-props="{children: 'children'}">
          <el-table-column :show-overflow-tooltip="true" prop="name" label="参数名称"/>
          <el-table-column :show-overflow-tooltip="true" prop="type" label="参数类型"/>
          <el-table-column :show-overflow-tooltip="true" prop="required" label="是否必须" :formatter="change" />
          <el-table-column :show-overflow-tooltip="true" prop="description" label="字段含义" width="auto"/>
          <el-table-column :show-overflow-tooltip="true" prop="value" label="参数值">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="value" label="是否检查">
            <template v-slot="scope">
              <el-checkbox v-model="scope.row.isChecked" @change="requestSQLCheck(scope.row)">{{scope.row.isChecked?'是':'否'}}</el-checkbox>
            </template>
          </el-table-column>
        </el-table>
        <div class="btns">
          <el-button class="btns-next" @click="save()" type="primary">保存</el-button>
          <el-button @click="changeStep('2','3')">上一步</el-button>
        </div>
      </div>
  </div>
</template>
<script>
import { ref, reactive, unref,onMounted } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import axios from '@/lin/plugin/axios'
import { ElMessage,ElMessageBox } from 'element-plus'
import emitter from 'lin/util/emitter'
import JsonEditorVue from 'json-editor-vue3'

export default {
components: {JsonEditorVue },
setup() {
  const ruleFormRef = ref()
  let queryTableData = ref([])
  let applyTableData = ref([])
  let backTableData = ref([])
  let checkResponseTableData = ref([])
  let checkQueryTableData = ref([])
  let itemSqlDisabled = ref(true)
  const requestJson = ref({})
  let responseJson = ref({})
  const checkSql = reactive({
    response:'',
    request:'',
    itemSql:'',
    childCode:''
  })
  const formData = ref({
    case_title: '',
    case_desc: '',
    case_type: '正常',
    wait_time:'0',
    version:'',
    case_status: '',
    header: '',
    request_param: '',
    response: '',
    result_check: `{
  "check_type":"response",
  "check_sql":"",
  "check_field":{},
  "check_position":""
}`,
    case_variable: {},
    result_variable: {},
  })
  const case_variable = ref({})
  const result_variable = ref({})
  let isFirstTrans = true
  let headerTableData = ref([])
  let queryBaseInfo = ref([])
  let responseBaseInfo = ref([])
  const levelData = reactive ({
      level:''
    })
  let step = ref('1')
  let queryTableKey = ref(1)
  const router = useRoute()
  let tableParams = router.query
  const checkSqlList = ref([])
  const checkedList = ref([])
  //下一步
  // const changeStep = function (val) {
  //   if(val == 2) {
  //     if(!formData.value.case_title) {
  //       ElMessage({
  //         message: '请输入用例名称',
  //         type: 'warning',
  //       })
  //       return false
  //     }else if(!formData.value.case_desc) {
  //       ElMessage({
  //         message: '请输入用例描述',
  //         type: 'warning',
  //       })
  //       return false
  //     }
  //   }else if(val == 3) {
  //     requestJson.value = firstTrans(queryTableData.value)
  //     responseJson.value = firstTrans(backTableData.value)
  //     checkSql.itemSql = ''
  //     checkResponseTableData.value = JSON.parse(JSON.stringify(backTableData.value))
  //     getParentCode(checkResponseTableData.value,1)
  //     checkQueryTableData.value = JSON.parse(JSON.stringify(queryTableData.value))
  //     getParentCode(checkQueryTableData.value,1)
  //     getCaseVariable(queryTableData.value)
  //     getResultVariable(backTableData.value)
  //   }
  //   step.value = val
  // }
  const changeStep = function (val,from) {
    if(val == 2) {
      if(!formData.value.case_title) {
        ElMessage({
          message: '请输入用例名称',
          type: 'warning',
        })
        return false
      }
      let reg1 =  new RegExp(/^[0-9]\d*$/)
      if(formData.value.wait_time&&!reg1.test(formData.value.wait_time)) {
        ElMessage({
          message: '等待时间请输入大于或等于0的整数！',
          type: 'warning',
        })
        return false
      }
      // else if(!formData.value.case_desc) {
      //   ElMessage({
      //     message: '请输入用例描述',
      //     type: 'warning',
      //   })
      //   return false
      // }
      addBaseInfo(queryTableData.value,'query')
      addBaseInfo(backTableData.value,'response')
      if(from == 3) {
        checkSqlList.value = []
        checkedList.value = []
        let response= checkSqlTransObj(checkResponseTableData.value)
        let request= checkSqlTransObj(checkQueryTableData.value)
        getAllChecked(response)
        getRequestAllChecked(request)
      }
    }else if(val == 3) {
      requestJson.value = firstTrans(queryTableData.value)
      responseJson.value = firstTrans(backTableData.value)
      checkSql.itemSql = ''
      checkResponseTableData.value = JSON.parse(JSON.stringify(backTableData.value))
      getParentCode(checkResponseTableData.value,1)
      checkQueryTableData.value = JSON.parse(JSON.stringify(queryTableData.value))
      getParentCode(checkQueryTableData.value,1)
      getCaseVariable(queryTableData.value)
      getResultVariable(backTableData.value)
      checkSqlList.value.forEach(item => {
        setCheckSqlItem(checkResponseTableData.value,item)
      })
      checkedList.value.forEach(item => {
        setCheckedItem(checkQueryTableData.value,item)
      })
      checkResponseTableData.value.forEach(i => {
        if(i.name == 'code') {
          i.isChecked = true
          i.checkValue = i.value
        }
      })
    }
    step.value = val
  }
  function getAllChecked (val) {
    val.check_field.forEach(item => {
      checkSqlList.value.push({name:item,sql:val[item].check_sql})
      if(val[item].check_field&&val[item].check_field.length>0){
        getAllChecked(val[item])
      }
    })
  }
  function getRequestAllChecked (val) {
    val.check_field.forEach(item => {
      checkedList.value.push(item)
      if(val[item].check_field&&val[item].check_field.length>0){
        getRequestAllChecked(val[item])
      }
    })
  }
  function setCheckSqlItem (val,sqlItem) {
    val.forEach(item => {
      if(item.name == sqlItem.name) {
        item.checkValue = sqlItem.sql
        item.isChecked = true
      }else {
        if(item.children) {
          setCheckSqlItem(item.children,sqlItem)
        }
      }
    })
  }
  function setCheckedItem (val,name) {
    val.forEach(item => {
      if(item.name == name) {
        item.isChecked = true
      }else {
        if(item.children) {
          setCheckedItem(item.children,name)
        }
      }
    })
  }
  //树形表格给parentCode-childCode对应关系
  function getParentCode (val,floor,parentCode) {
    val.forEach((item,index) => {
      item.childCode =floor+index.toString() 
      if(floor == 1) {
        item.parentCode = ''
      }else {
        item.parentCode = parentCode
      }
      if(item.children) {
        getParentCode(item.children,floor+1,item.childCode)
      }
    })

  }
  //响应参数 子勾选父也勾选
  const responseSqlCheck = function(row) {
    let parentCode = row.parentCode
    if(row.isChecked) {
      setParentChecked(checkResponseTableData.value,parentCode)
    }
  }
  const requestSQLCheck = function(row) {
    let parentCode = row.parentCode
    if(row.isChecked) {
      setParentCheckedRE(checkQueryTableData.value,parentCode)
    }
  }
  function setParentChecked (val,parentCode) {
    let parentItemCode = parentChecked(val,parentCode)
    if(parentItemCode!=="" && parentItemCode!==undefined){
      setParentChecked(checkResponseTableData.value,parentItemCode)
    }
  }
  function parentChecked (val,parentCode) {
    let parentItemCode = ''
    let isGet = false
    val.forEach(item=> {
      if(item.childCode == parentCode) {
        parentItemCode = item.parentCode
        isGet = true
        item.isChecked = true
        if(parentItemCode!=="" && parentItemCode!==undefined){
          parentChecked(checkResponseTableData.value,parentItemCode)
        }
      }else {
        if(item.children){
          parentChecked(item.children,parentCode)
        }
      }
    })
  }
  function setParentCheckedRE (val,parentCode) {
    let parentItemCode = parentCheckedRE(val,parentCode)
    if(parentItemCode!=="" && parentItemCode!==undefined){
      setParentCheckedRE(checkQueryTableData.value,parentItemCode)
    }
  }
  function parentCheckedRE (val,parentCode) {
    let parentItemCode = ''
    let isGet = false
    val.forEach(item=> {
      if(item.childCode == parentCode) {
        parentItemCode = item.parentCode
        isGet = true
        item.isChecked = true
        if(parentItemCode!=="" && parentItemCode!==undefined){
          parentCheckedRE(checkQueryTableData.value,parentItemCode)
        }
      }else {
        if(item.children){
          parentCheckedRE(item.children,parentCode)
        }
      }
    })
  }
  let dbName = ref('')
  const data = reactive ({
    activeName:'0',
  })
  const change = function (row) {
      if (row.required=='0'){
        return "否";
      }else if (row.required=='1'){
        return "是";
      }
  }
  const onJsonChange = function (value) {
      console.log('更改value:', value);
      // 实时保存
      // this.onJsonSave(value)
  }
  //全景-高级切换
  const handleClick = (tab, event) => {
      data.activeName = tab.index
      if(data.activeName == '1') {
        requestJson.value = firstTrans(queryTableData.value)
        responseJson.value = firstTrans(backTableData.value)
        getCaseVariable(queryTableData.value)
        getResultVariable(backTableData.value)
        isFirstTrans = false
      }else if(data.activeName == '0' &&!isFirstTrans) {
        queryTableData.value = backTrans(requestJson.value,'query')
        backTableData.value = backTrans(responseJson.value,'response')
        addBaseInfo(queryTableData.value,'query')
        addBaseInfo(backTableData.value,'response')
        for (var key in case_variable.value) {
        addCaseVariable(queryTableData.value,key)
        }
        for (var key in result_variable.value) {
          let arr = result_variable.value[key].replace(/\[|]/g,'').replace(RegExp("0", "g"),'').split('.')
          addResultariable(backTableData.value,arr,0,key,result_variable.value[key])
        }
      }
  }
  function addCaseVariable (val,key) {
    val.forEach(item => {
      if(item.name == key) {
        item.checked = true
        item.queryName = key
        item.queryValue = '$'+key
      }else {
        if(item.children) {
          addCaseVariable(item.children,key)
        }
      }
    })
  }
  function addResultariable (val,arr,index,key,url) {
    if (arr.length == 0 ) return
    val.forEach(item => {
      if(item.name == arr[0]) {
        arr.shift()
        console.log(arr,'arr')
        if(arr.length == 0) {
          item.resonseName = key
          item.responseUrl = url
          item.checked = true
        }else {
          addResultariable(item.children,arr,index,key,url)
        }
      }
    })
  }
  //接口详情获取数据类型 和 是否必须 存值
  function addBaseInfo (val,type) {
    if(type == 'query') {
        val.forEach(item => {
        let sameItem = queryBaseInfo.value.filter(el => el.name ==item.name)
        if(sameItem.length>0) {
          item.type = sameItem[0].type
          item.required = sameItem[0].required
          item.description = sameItem[0].description
        }else {
          item.type = item.valueType
        }
        if(item.children) {
          addBaseInfo(item.children,'query')
        }
      })
    }else {
      val.forEach(item => {
        let sameItem = responseBaseInfo.value.filter(el => el.name ==item.name)
        if(sameItem.length>0) {
          item.type = sameItem[0].type
          item.required = sameItem[0].required
          item.description = sameItem[0].description
        }else {
          item.type = item.valueType
        }
        if(item.children) {
          addBaseInfo(item.children,'response')
        }
      })
    }
   

  }
  //全景转高级
  const firstTrans = function (val) {
    let obj = {}
    val.forEach(item => {
      if(isFirstTrans) {
         item.valueType = item.type
      }
      if(!item.children || item.children.length==0) {
        if(item.valueType == 'null' ){
          obj[item.name] = ''
        }else if(item.valueType == 'number') {
         if(item.value == undefined) {
          obj[item.name] = null
         }else {
          obj[item.name] = Number(item.value)
         }
        }else if(item.valueType == 'array' && (item.value==null || item.value==undefined || !item.value)) {
          obj[item.name] = []
        }else if(item.valueType == 'boolean'){
          obj[item.name] = item.value
        }else{
          obj[item.name] = item.value?item.value:''
        }
        if(typeof item.value === 'number'&&item.value == 0) {
          obj[item.name] = 0
        }
      }else if(item.valueType == 'array' && item.children && item.children.length>0) {
        obj[item.name] = [firstTrans(item.children)]
      }else if(item.valueType == 'object' && item.children){
        obj[item.name] = firstTrans(item.children)
      }
    })
    return obj
  }
  //高级转全景
  const backTrans = function (obj,type) {
    let arr = []
    for (let key in obj) {
      if(Array.isArray(obj[key])&&typeof obj[key][0] == 'object') {
        arr.push({
          name:key,
          valueType:'array',
          children:backTrans(obj[key][0],type)
        })

      }else if (Array.isArray(obj[key])&&typeof obj[key][0] !== 'object') {
        arr.push({
          name:key,
          valueType:'array',
          value:obj[key]
        })
      }else if(typeof obj[key] == 'object' && !Array.isArray(obj[key])&& obj[key] !== null) {
        arr.push({
          name:key,
          valueType:'object',
          children:backTrans(obj[key],'type')
        })
      }else if(obj[key] == null) {
        let baseInfo = type=='query'?queryBaseInfo.value:responseBaseInfo.value
        let sameItem = baseInfo.filter(el => el.name == key)
        if(sameItem.length>0 && sameItem[0].type == 'array') {
          arr.push({
            name:key,
            valueType:'array',
            value:''
          })
        }else {
          arr.push({
            name:key,
            valueType:'string',
            value:""
          })
        }
      }else if (typeof obj[key] == 'number' && obj[key] ==0) {
        arr.push({
          name:key,
          value:0,
          valueType:typeof obj[key]
        })
      }else if (typeof obj[key] == 'boolean') {
        arr.push({
          name:key,
          value:obj[key],
          valueType:typeof obj[key]
        })
      }else {
        arr.push({
          name:key,
          value:obj[key]||'',
          valueType:typeof obj[key]
        })
      }
    }
    return arr
  }
  const onJsonSave = function (value) {
        // console.log('保存value:', value);
        // this.resultInfo = value
        // this.hasJsonFlag = true
  }
  const onError = function (value) {
        // console.log("json错误了value:", value);
        // this.hasJsonFlag = false
      }
  
  // 校验json
  function jsonValidator(rule, value, cb) {
    if (!value) cb()
    try {
      if (parseInt(value, 10) > -1) throw new Error('error')
      JSON.parse(value)
      cb()
    } catch (e) {
      cb('请输入正确的json')
    }
  }
  //参数和路径
  function childrenResUrl (val,frontUrl) {
    val.forEach((item,index) => {
        let dot = frontUrl?'.':''
        let url = frontUrl + dot + item.name
        if(item.checked) {
          item.responseUrl = url
          item.resonseName = JSON.parse(JSON.stringify(item.name))
        }else {
          delete item.resonseName
          delete item.responseUrl
        }
        if(item.children && item.type == 'object') {
          childrenResUrl(item.children,url)
        }else if(item.children && item.type == 'array') {
          childrenResUrl(item.children,url)
        }
        
    })
  }
  //检查sql转成obj
  function checkSqlTransObj (val,ischildren,sql) {
    let obj = {
      check_field:[]
    }
    if(ischildren) obj.check_sql = sql || ""
    val.map((item) => {
      if(item.name == 'code') return
      if(item.isChecked) {
        obj.check_field.push(item.name)
        obj[item.name] = {}
        obj[item.name].check_sql = item.checkValue || ""
        if(item.children) {
          obj[item.name] = checkSqlTransObj(item.children,true,item.checkValue)
        }
      }
    })
    return obj
  }
  function checkSqlRequest (val,ischildren) {
    let obj = {
      check_field:[]
    }
    if(ischildren) obj.check_sql = ""
    val.map((item) => {
      if(item.checked) {
        obj.check_field.push(item.name)
        obj[item.name] = {}
        obj[item.name].check_sql = ""
        if(item.children) {
          obj[item.name] = checkSqlRequest(item.children,true)
        }
      }
    })
    return obj
  }

  let queryCheck = function () {
    childrenCheck(queryTableData.value)

  }
  function childrenCheck (val) {
    val.forEach((item,index) => {
        if(item.checked) {
          item.queryName = item.name
          item.queryValue = '$'+ item.name
        }else {
          delete item.queryName
          delete item.queryValue
        }
      if(item.children) {
        childrenCheck(item.children)
      }
    })
  }
  let responseCheck = function (val) {
    childrenResUrl(backTableData.value,'')
  }
  let getIfaceDetail = async function (iface_id) {
      let data = {id:iface_id}
      formData.name = ''
      formData.address = ''
      formData.method = ''
      applyTableData.value = []
      queryTableData.value = []
      backTableData.value = []
      const res = await axios({
        method: 'post',
        url: '/iftest/iface/iface_detail',
        data,
      })
      console.log(res,'res')
      const { req_headers, req_body, res_body, iface_name,request_url,request_method } = res.data
      formData.value.name = iface_name
      formData.value.address= request_url
      formData.method = request_method
      let req_headersJson = req_headers.replace(RegExp("[(]", "g"),'').replace(RegExp("[)]", "g"),'').replace(RegExp("ObjectId", "g"),'')
      let req_headersArr = JSON.parse('['+req_headersJson+']')
      let headerBase = [{name:'Content-Type',value:'application/json'},{name:'username',value:''},{name:'password',value:''}]
      req_headersArr.forEach(item => {
        let i = headerBase.findIndex(el => el.name == item.name)
        if(i !==-1) {
          headerBase[i].value = item.value
        }else {
          headerBase.push(item)
        }
      })
      applyTableData.value = headerBase
      if(typeof req_body == 'string' && req_body!== '') {
        if(req_body.indexOf('ObjectId') !== -1) {
          let req_bodyJson = req_body.replace(RegExp("[(]", "g"),'').replace(RegExp("[)]", "g"),'').replace(RegExp("ObjectId", "g"),'')
          queryTableData.value = JSON.parse('['+req_bodyJson+']')
          queryTableData.value.forEach(item=>item.description = item.desc)
        }else {
          let queryJson = JSON.parse(req_body.replace(/[\r|\n|\t]/g,""))
          if(queryJson.items) {
            transObj(queryJson.items)
          }else if (queryJson.properties) {
            queryTableData.value=transObj(queryJson)
          }

        }
      }else if (typeof req_body == 'object') {
        if(req_body.items) {
          queryTableData.value=transObj(req_body.items)
        }else if (req_body.properties && !req_body.$$ref) {
          queryTableData.value=transObj(req_body)
        }else if(req_body.properties && req_body.$$ref) {
          queryTableData.value=objToTree(req_body.properties)
        }
      }
      if(res_body.items) {
        backTableData.value=transObj(res_body.items)
      }else if (res_body.properties && !res_body.$$ref) {
        backTableData.value=transObj(res_body)
      }else if(res_body.properties && res_body.$$ref) {
        backTableData.value=objToTree(res_body.properties)
      }
      getQueryBaseArray(queryTableData.value,'query')
      getQueryBaseArray(backTableData.value,'response')


    }
  function getQueryBaseArray (val,type) {
    val.map(item => {
      if(type == 'query') {
        queryBaseInfo.value.push({
          name:item.name,
          type:item.type,
          required:item.required,
          description:item.description
          
        })
      }else if(type == 'response') {
        responseBaseInfo.value.push({
          name:item.name,
          type:item.type,
          required:item.required,
          description:item.description
        })
      }
      if(item.children) {
        getQueryBaseArray(item.children,type)
      }
    })
  }
  let transObj = function (obj) {
      let arr = [];
      for (let key in obj.properties) {
        let itemObj = {
          name:key,
          type:obj.properties[key].type,
          description:obj.properties[key].description || ''
        }
        if(obj.required&&obj.required.includes(key) == true) {
          itemObj.required = 1
        } else {
          itemObj.required = 0
        }
        if(itemObj.type == 'array') {
          itemObj.children = transObj(obj.properties[key].items)
        }else if(itemObj.type == 'object') {
          itemObj.children = transObj(obj.properties[key])

        }
        arr.push(itemObj)
      }
      return arr
    }
  let objToTree = function (obj) {
          let arr = [];
          for (let key in obj) {
              //判断每个值是不是一个对象
              if (typeof obj[key] === 'object') {
                if(obj[key].properties) {
                  arr.push({
                      name: key,
                      type: obj[key].type,
                      description:obj[key].description,
                      children:objToTree(obj[key].properties),
                      required:0
                  })
                }else if(obj[key].items) {
                  arr.push({
                      name: key,
                      type: obj[key].type,
                      description:obj[key].description,
                      children:objToTree(obj[key].items.properties),
                      required:0,
                      format:'item 类型:'+obj[key].items['type']
                  })
                }else {
                  let newobj = {
                      name: key,
                      type: obj[key].type,
                      description:obj[key].description,
                      required:0,
                  }
                  obj[key].format?newobj.format =obj[key].format :''
                  arr.push(newobj)

                }
                 
              } else {
                  arr.push({
                      key:obj[key]
                  })
              }
          }
          return arr;
  }
  const rules = reactive({
    case_title: [{ required: true, message: '请输入用例名称', trigger: 'change' }],
    wait_time:[{pattern:/^[0-9]\d*$/, message: '请输入大于或等于0的整数！', trigger: 'change'}],
    header: [
      // { required: true, message: '请输入请求头', trigger: 'change' },
      {
        validator: jsonValidator,
        trigger: 'blur',
      },
    ],
    request_param: [
      { required: true, message: '请输入请求参数', trigger: 'change' },
      {
        validator: jsonValidator,
        trigger: 'blur',
      },
    ],
    response: [
      { required: true, message: '请输入响应参数', trigger: 'change' },
      {
        validator: jsonValidator,
        trigger: 'blur',
      },
    ],
    result_check: [
      {
        validator: jsonValidator,
        trigger: 'blur',
      },
    ],
    case_variable: [
      {
        validator: jsonValidator,
        trigger: 'blur',
      },
    ],
    result_variable: [
      {
        validator: jsonValidator,
        trigger: 'blur',
      },
    ],
  })
  let getSqlName = async function (project_id) {
      let data = {'project_id':project_id}
      const res = await axios({
        method: 'post',
        url: '/iftest/condition/stroe/project_db',
        data,
      })
      if(res.data.datasList.length>0) {
        dbName.value = res.data.datasList[0].db_name || ""
      }
  }
  const save = async function () {
    let result_check = {
      response:{},
      request:{},
      res_code:{
        "code_name":"code",
        "code_value":''
      }
    }
    result_check.response= checkSqlTransObj(checkResponseTableData.value)
    result_check.response.check_sql =  checkSql.response||""
    result_check.request= checkSqlTransObj(checkQueryTableData.value)
    result_check.request.check_sql =  checkSql.request||""
    if(checkResponseTableData.value[0]=='number') {
      result_check.res_code.code_value= Number(checkResponseTableData.value[0].checkValue)
    }else {
      result_check.res_code.code_value= checkResponseTableData.value[0].checkValue
    }
    let headerObj = {}
    applyTableData.value.forEach(el => {
      if(el.name && el.value && el.name !== '' && el.value !== '') {
        headerObj[el.name] = el.value
      }else if (el.name == 'Content-Type' || el.name == 'username' || el.name == 'password') {
        headerObj[el.name] = el.value || ''
      }
    })
    let param = {
      iface_id:tableParams.iface_id,
      case_title:formData.value.case_title,
      case_desc:formData.value.case_desc,
      case_type:formData.value.case_type,
      version:formData.value.version,
      wait_time:formData.value.wait_time,
      header:headerObj,
      request_param:requestJson.value,
      response:responseJson.value,
      case_variable:case_variable.value,
      result_variable:result_variable.value,
      result_check:result_check,
    }
    const res = await axios({
          method: 'post',
          url: '/iftest/case/standStom/add',
          data: param,
        })
        ElMessage[res.code == 200 ? 'success' : 'error'](res.message)
        if (res.code == 200) {
          emitter.emit('custom-close')
        }
  }
  function getCaseVariable (val) {
    val.map(item => {
      if(item.checked) {
        case_variable.value[item.queryName] = item.queryValue
      }
      if(item.children) getCaseVariable(item.children)
    })

  }
  function getResultVariable (val) {
    val.map(item => {
      if(item.checked) {
        result_variable.value[item.resonseName] = item.responseUrl
      }
      if(item.children) getResultVariable(item.children)
    })

  }
  const inputFoucus = function (row) {
    itemSqlDisabled.value = false
    checkSql.itemSql = row.checkValue
    checkSql.childCode = row.childCode

  }
  const inputBlur = function () {
    // itemSqlDisabled.value = true
  }
  const inputChange = function (value) {
    checkSql.itemSql = value

  }
  const itemSqlChange = function (value) {
     setItemSqlChange(checkResponseTableData.value,checkSql.childCode,value)
  }
  function setItemSqlChange (val,childCode,itemSql) {
    val.forEach( item => {
      if(item.childCode == childCode) {
        item.checkValue = itemSql
      }else {
        if(item.children) {
          setItemSqlChange (item.children,childCode,itemSql)
        }
      }
    })



  }
  function onSubmit(formEl) {
    if (!formEl) return
    formEl.validate(async (valid, fields) => {
      if (valid) {
        const { iface_id } = unref(router.currentRoute).query
        const res = await axios({
          method: 'post',
          url: '/iftest/case/standStom/add',
          data: { ...unref(formData), iface_id },
        })

        ElMessage[res.code == 200 ? 'success' : 'error'](res.message)
        if (res.code == 200) {
          emitter.emit('custom-close')
        }
      }
    })
  }
  const addHeaderInfo = function (data) {
    let i = applyTableData.value.findIndex(item => item.name == data.name)
    let obj = {
      name:'',
      value:''
    }
    applyTableData.value.splice(i+1,0,obj)
  }
  const deleteHeaderInfo = function (data) {
    let i = applyTableData.value.findIndex(item => item.name == data.name)
    ElMessageBox.confirm(`是否确认删除该参数?`, '提示', {
        type:'warning'
      }).then(async() => {
        applyTableData.value.splice(i,1)
    })

  }
  onMounted(()=>{
    getIfaceDetail(tableParams.iface_id)
    getSqlName(tableParams.project_id)
  })
  return {
    ruleFormRef,
    formData,
    rules,
    onSubmit,
    applyTableData,
    headerTableData,
    backTableData,
    change,
    changeStep,
    step,
    data,
    requestJson,
    responseJson,
    onJsonChange,
    onJsonSave,
    onError,
    tableParams,
    getIfaceDetail,
    objToTree,
    transObj,
    applyTableData,
    queryTableData,
    backTableData,
    handleClick,
    queryCheck,
    queryTableKey,
    isFirstTrans,
    firstTrans,
    backTrans,
    responseCheck,
    checkResponseTableData,
    checkQueryTableData,
    responseSqlCheck,
    queryBaseInfo,
    responseBaseInfo,
    checkSql,
    getSqlName,
    dbName,
    save,
    requestSQLCheck,
    case_variable,
    result_variable,
    inputFoucus,
    inputChange,
    itemSqlChange,
    inputBlur,
    itemSqlDisabled,
    checkSqlList,
    checkedList,
    addHeaderInfo,
    deleteHeaderInfo
  }
  
},
}
</script>
<style lang="scss" scoped>
.atomic-cases-add {
  /* width: 50%; */
  min-width: 700px;
  padding: 20px;
  .el-form .el-select{
    width: 100%;
  }
  .steps{
    padding-left:200px
  }
  .headerTitle{
    font-size: 16px;
    font-weight: 700;
    color: #000000D8;
    margin:20px 0 20px 20px;
    position: relative;
    &::before{
      position: absolute;
      content: '';
      left: -12px;
      top: 0;
      width: 4px;
      height: 20px;
      background: #000000D8;
    }
  }
  .baseForm{
    width: 70%;

  }
  .applyTitle {
    font-size: 14px;
    padding: 10px 0 10px 30px;
    font-weight: 700;
  }
  .headerTable{
    width: 90%;
    margin-left: 20px;
  }
  .next{
    float: right;
    margin: 40px 260px 0 0 ;
  }
  .btns {
    float: right;
    margin: 40px 220px 0 0;
    .btns-next{
      margin-right: 15px;
    }
  }
  .stepThree {
    .checkTitle {
      font-size: 12px;
      float: left;
      display:inline-block;
      width:60px;
      height:32px;
      line-height:32px
    }
    .inputView {
      float: left;
      box-sizing: border-box;
      padding-left:15px;
      font-size: 12px;
      width: 250px;
      height: 32px;
      line-height: 32px;
      border:1px solid rgb(217, 217, 217);
      display:inline-block;
      background-color: rgb(255, 255, 255)
    }
    .checkName {
      float:left;
      font-size: 12px;
      margin-left: 60px;
      display:inline-block;
      width:80px;
      height:32px;
      line-height:32px
    }
    .tip {
      float: left;
      box-sizing: border-box;
      display: inline-block;
      width: 30px;
      height: 32px;
      line-height: 32px;
      border:1px solid rgb(217, 217, 217);
      background-color: rgb(238, 238, 238);
      border-left: none;
      text-align: center;

    }
    .rightPart {
      display: inline-block;
    }
    .tipInfo {
      margin: 5px 0;
    }

  }
  .sqlCheck {
    margin:10px 0;
    vertical-align: top;
  }
  .tipTwo{
      display: inline-block;
      width: 30px;
      height: 32px;
      line-height: 32px;
      border:1px solid rgb(217, 217, 217);
      background-color: rgb(238, 238, 238);
      /* border-left: none; */
      text-align: center;
      margin-bottom: 25px;
  }
  
}
::v-deep .el-table__expand-icon {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
::v-deep .el-table__expand-icon>.el-icon{
	display:none !important;
}
::v-deep .el-table__expand-icon:before {
  background: url("../../assets/image/table/open.png") no-repeat;
  content: "";
  display: block;
  width: 15px;
  height: 20px;
  font-size: 18px;
  background-size: 14px;
  margin-top: 4px;
}

::v-deep .el-table__expand-icon--expanded:before {
  background: url("../../assets/image/table/close.png") no-repeat;
  content: "";
  display: block;
  width: 15px;
  height: 20px;
  font-size: 18px;
  background-size: 14px;
  margin-top: 4px;
}
</style>
