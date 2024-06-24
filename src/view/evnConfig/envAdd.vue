<template>
  <div class="env-add">
    <el-tabs v-model="activeName" disabled>
      <el-tab-pane label="基本信息" name="baseInfo">
        <el-form :model="addParams" label-width="auto" ref="refBaseInfo" :rules="rulesBaseInfo">
          <el-form-item label="环境编码" prop="branch" style="max-width: 600px">
            <el-input v-model="addParams.branch" placeholder="请选择环境编码" :maxlength="64" />
          </el-form-item>
          <el-form-item label="环境名称" prop="env_name" style="max-width: 600px">
            <el-input v-model="addParams.env_name" placeholder="请选择环境名称" />
          </el-form-item>
          <el-form-item label="环境地址" prop="env_host" style="max-width: 600px">
            <el-input v-model="addParams.env_host" placeholder="请选择环境地址" />
          </el-form-item>
          <el-row style="max-width: 600px">
            <el-col :span="11">
              <el-form-item label="请求方式" prop="request_mode">
                <el-select v-model="addParams.request_mode" placeholder="请选择请求方式" style="width: 100%">
                  <el-option label="网关转发" value="gw" />
                  <el-option label="微服务" value="micro" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="2" />
            <!-- <el-col :span="11">
              <el-form-item label="转发端口" prop="gw_port">
                <el-input
                  v-model.number="addParams.gw_port"
                  :disabled="computedRequestMode === 'gw'"
                  placeholder="请输入转发端口"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-form-item label="接口请求方式" style="max-width: 1000px">
            <el-table :data="productData" style="width: 100%">
              <el-table-column prop="pro_name" label="产品名称" />
              <el-table-column prop="micro_host" label="请求地址">
                <template #default="scope">
                  <el-input v-model="scope.row.micro_host" placeholder="请输入请求地址" />
                </template>
              </el-table-column>
              <el-table-column prop="pro_port" label="产品端口">
                <template #default="scope">
                  <span :style="{ color: scope.row.ifRed ? 'red' : '' }">{{ scope.row.pro_port }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="请求头配置" name="headerInfo">
        <env-add-header :tableData="headerInfo"></env-add-header>
      </el-tab-pane>
      <el-tab-pane label="鉴权配置" name="authInfo">
        <el-form :model="authInfo" ref="refAuthInfo" label-width="auto" :rules="rulesAuthInfo">
          <el-form-item label="鉴权方式" prop="oauth_type">
            <el-select v-model="authInfo.oauth_type" @change="changeOauthType">
              <el-option label="不鉴权" value="no_auth"></el-option>
              <el-option label="固定Cookie" value="Cookie"></el-option>
              <el-option label="固定Token" value="fix_token"></el-option>
              <el-option label="动态Token" value="dynamics_token"></el-option>
            </el-select>
          </el-form-item>

          <template v-if="['Cookie', 'fix_token', 'dynamics_token'].indexOf(authInfo.oauth_type) > -1">
            <el-form-item label="参数名称" prop="oauth_value.auth_name" style="max-width: 600px">
              <el-input v-model="authInfo.oauth_value.auth_name" placeholder="请输入参数名称"></el-input>
            </el-form-item>

            <el-row style="max-width: 600px">
              <el-col :span="authInfo.oauth_type === 'dynamics_token' ? 12 : 24">
                <el-form-item label="参数值" prop="oauth_value.auth_value">
                  <el-input v-model="authInfo.oauth_value.auth_value" placeholder="请输入参数值"></el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="10" v-if="authInfo.oauth_type === 'dynamics_token'">
                <span style="line-height: 32px">${access_token}</span>
              </el-col> -->
            </el-row>

            <!-- 动态token -->
            <template v-if="authInfo.oauth_type === 'dynamics_token'">
              <el-row style="max-width: 600px">
                <el-col :span="12">
                  <el-form-item label="URL" prop="oauth_value.url">
                    <el-input v-model="authInfo.oauth_value.url" placeholder="请输入URL"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"></el-col>
                <el-col :span="10">
                  <el-form-item label="请求方式" prop="oauth_value.request_method">
                    <el-select v-model="authInfo.oauth_value.request_method">
                      <el-option label="GET" value="GET"></el-option>
                      <el-option label="POST" value="POST"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="请求头">
                <env-add-header
                  :disabledContentType="false"
                  :tableData="authInfo.oauth_value.request_header"
                ></env-add-header>
              </el-form-item>
              <el-form-item label="鉴权参数">
                <env-add-auth :tableData="authInfo.oauth_value.request_param" />
              </el-form-item>
              <el-form-item label="参数类型" required>
                <el-select v-model="authInfo.oauth_value.param_type">
                  <el-option label="json" value="json"></el-option>
                  <el-option label="form-data" value="form-data"></el-option>
                  <el-option label="form-urlencoded" value="form-urlencoded"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="token名称" style="max-width: 600px" prop="oauth_value.token_name">
                <el-input v-model="authInfo.oauth_value.token_name" placeholder="请输入token名称"></el-input>
              </el-form-item>
            </template>
          </template>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="存储信息" name="storeInfo">
        <el-table :data="storeProductData">
          <el-table-column label="产品名称" prop="pro_name"></el-table-column>
          <el-table-column label="数据库类型" prop="db_type">
            <template #default="scope">
              <el-select v-model="scope.row.db_type" @change="val => handleChanged('db_type', scope)">
                <el-option label="mysql" value="mysql"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="数据库IP">
            <template #default="scope">
              <el-input
                v-model="scope.row.db_host"
                :placeholder="scope.$index > 0 ? '请输入' : '127.0.0.1'"
                @change="val => handleChanged('db_host', scope)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="数据端口">
            <template #default="scope">
              <el-input
                v-model.number="scope.row.db_port"
                :placeholder="scope.$index > 0 ? '请输入' : '15800'"
                @change="val => handleChanged('db_port', scope)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="数据库名称">
            <template #default="scope">
              <el-input
                v-model="scope.row.db_name"
                :placeholder="scope.$index > 0 ? '请输入' : 'data_mate'"
                @change="val => handleChanged('db_name', scope)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="用户名">
            <template #default="scope">
              <el-input
                v-model="scope.row.db_username"
                :placeholder="scope.$index > 0 ? '请输入' : 'root'"
                @change="val => handleChanged('db_username', scope)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="密码">
            <template #default="scope">
              <el-input
                v-model="scope.row.db_password"
                :placeholder="scope.$index > 0 ? '请输入' : 'Tong#1234'"
                @change="val => handleChanged('db_password', scope)"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-row style="margin-top: 20px">
      <el-col :span="18"></el-col>
      <el-col :span="6" style="display: flex; justify-content: flex-end">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">提交</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, unref, watch, watchEffect } from 'vue'
import EnvAddHeader from './envAddHeader.vue'
import EnvAddAuth from './envAddAuth.vue'
import axios from '@/lin/plugin/axios'
import emitter from 'lin/util/emitter'
import { getProductData } from './api'
import store from '@/store'
import { ElMessage } from 'element-plus'
import router from '../../router'
let activeName = ref('baseInfo')
let rulesBaseInfo = {
  branch: [
    {
      required: true,
      message: '请输入环境编码',
      trigger: 'change',
    },
    {
      validator(_, val, cb) {
        if (/^[a-zA-Z0-9]{5,}$/.test(val)) {
          cb()
        } else {
          cb('环境编码仅支持英文和数字，长度>4')
        }
      },
      trigger: 'change',
    },
  ],
  env_name: [
    {
      required: true,
      message: '请输入环境名称',
      trigger: 'change',
    },
  ],
  request_mode: [
    {
      required: true,
      message: '请选择请求方式',
      trigger: 'change',
    },
  ],
  gw_port: [
    {
      required: true,
      message: '请输入转发端口',
      trigger: 'change',
    },
  ],
  env_host: [
    {
      required: true,
      message: '请输入环境地址',
      trigger: 'change',
    },
    {
      validator(rule, value, cb) {
        if (/^http[s]?:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/\~\+#]*[\w\-\@?^=%&/\~\+#])?/i.test(value)) {
          cb()
        } else {
          cb('请输入合法的http地址')
        }
      },
      tregger: 'change',
    },
  ],
}

let refBaseInfo = ref()

let computedRequestMode = computed(() => {
  return addParams.value.request_mode
})
/**
 * 修改请求方式
 */
async function changeRequestMode(val) {
  if (val === 'gw') {
    addParams.value.gw_port = 80
  }
}

// 基本信息
let addParams = ref({
  branch: '', //编码
  env_name: '',
  env_host: '',
  request_mode: 'gw',
  gw_port: '',
})

// 请求头配置
let headerInfo = ref([
  {
    key: 'Content-Type',
    value: 'application/json',
  },
])

// 鉴权配置
let authInfo = ref({
  oauth_type: 'no_auth',
  oauth_value: {
    auth_name: 'Authorization',
    auth_value: 'Bear ${access_token}',
    url: '',
    request_method: 'POST', //POST
    request_header: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
    ],
    request_param: [
      {
        key: '',
        value: '',
      },
    ],
    param_type: 'json',
    token_name: 'access_token',
  },
})

let canChange = ref(false)
let productData = ref([])
watch(
  () => ({ env_host: addParams.value.env_host, request_mode: addParams.value.request_mode }),
  newV => {
    let env_host = newV.env_host
    let request_mode = newV.request_mode
    productData.value.forEach(ele => {
      let newPort = ele.pro_port
      if (ele.origin_micro_host) {
        // 修改时请求地址和环境地址没有关系
      } else if (newPort && env_host && request_mode === 'micro') {
        if (/:\d+/.test(env_host)) {
          ele.micro_host = env_host.replace(/(?<=:)\d+/, newPort)
        } else if (/(?<=\.\w+)(\/.*?)$/.test(env_host)) {
          ele.micro_host = env_host.replace(/(?<=\.\w+)(\/.*?)$/g, function (path) {
            return `:${newPort}${path}`
          })
        } else {
          ele.micro_host = `${env_host}:${newPort}`
        }
      } else {
        ele.micro_host = env_host
      }
    })
  },
)
watchEffect(() => {
  productData.value.forEach(ele => {
    ele.ifRed = !new RegExp(`:${ele.pro_port}\\b`).test(ele.micro_host)
  })
})

let storeProductData = computed(() => {
  return unref(isEdit)
    ? unref(productData)
    : [
        {
          pro_name: '通用配置',
          id: '-1',
        },
        ...unref(productData),
      ]
})

async function saveStoreInfo() {
  let { branch } = unref(addParams)
  let res = await axios({
    method: 'post',
    url: '/iftest/condition/stroe/proStoreAdd',
    data: {
      branch,
      store_list: unref(productData).map(
        ({
          pro_name,
          db_type,
          db_host,
          db_port,
          db_name,
          db_username,
          db_password,
          pro_port,
          micro_host,
          id: project_id,
        }) => ({
          pro_name: pro_name || undefined,
          db_type: db_type || undefined,
          db_host: db_host || undefined,
          db_port: db_port || undefined,
          db_name: db_name || undefined,
          db_username: db_username || undefined,
          db_password: db_password || undefined,
          micro_host: micro_host || undefined,
          branch: branch || undefined,
          project_id: project_id || undefined,
          edit_uid: store.getters.user?.username,
        }),
      ),
    },
  })
}

function arrayToObject(array = []) {
  return JSON.parse(JSON.stringify(array)).reduce(
    (a, b) => ({
      ...a,
      [b.key]: b.value,
    }),
    {},
  )
}

// 鉴权
let refAuthInfo = ref()
let rulesAuthInfo = {
  'oauth_value.auth_name': [
    {
      required: true,
      message: '请输入参数名称',
      trigger: 'change',
    },
  ],
  'oauth_value.auth_value': [
    {
      required: true,
      message: '请输入参数值',
      trigger: 'change',
    },
    {
      validator(rule, value, cb) {
        let { oauth_type } = unref(authInfo)
        if (oauth_type === 'dynamics_token') {
          if (/\$\{access_token\}/.test(value)) {
            cb()
          } else {
            cb('参数值必须有${access_token}')
          }
        } else if (oauth_type === 'fix_token' || 'Cookie' === oauth_type) {
          if (/[a-zA-Z]/.test(value)) {
            cb()
          } else {
            cb('参数值必须存在字母')
          }
        } else {
          cb()
        }
      },
      trigger: 'change',
    },
  ],
  'oauth_value.url': [
    {
      required: true,
      message: '请输入URL',
      trigger: 'change',
    },
    {
      validator(rule, value, cb) {
        if (/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/i.test(value)) {
          cb()
        } else {
          cb('请输入合法的URL地址')
        }
      },
      tregger: 'change',
    },
  ],
  'oauth_value.request_method': [
    {
      required: true,
      message: '请输入请求方式',
      trigger: 'change',
    },
  ],
  'oauth_value.token_name': [
    {
      required: true,
      message: '请输入token名称',
      trigger: 'change',
    },
  ],
}

function changeOauthType(val) {
  if (val === 'dynamics_token') {
    authInfo.value.oauth_value.auth_name = 'Authorization'
    authInfo.value.oauth_value.auth_value = 'Bear ${access_token}'
  } else if (['Cookie', 'fix_token'].indexOf(val) > -1) {
    authInfo.value.oauth_value.auth_name = 'Authorization'
  } else {
    authInfo.value.oauth_value.auth_value = ''
  }
}

function cancel() {
  emitter.emit('custom-close')
}
async function save() {
  await unref(refBaseInfo)
    .validate()
    .catch(() => {
      activeName.value = 'baseInfo'
      throw new Error('baseinfo校验不通过')
    })

  await unref(refAuthInfo)
    .validate()
    .catch(() => {
      activeName.value = 'authInfo'
      throw new Error('authInfo校验不通过')
    })

  let { group_id } = router.currentRoute.value.query
  let authParams = JSON.parse(JSON.stringify(unref(authInfo)))
  authParams.oauth_value.request_header = arrayToObject(authParams.oauth_value.request_header.filter(v => v.key))
  authParams.oauth_value.request_param = arrayToObject(authParams.oauth_value.request_param.filter(v => v.key))

  // 如果动态token自动校验
  if (authParams.oauth_type === 'dynamics_token') {
    let authValidate = await axios({
      method: 'POST',
      url: '/iftest/condition/auth/check',
      data: authParams.oauth_value,
    })
    if (authValidate.code !== 200) {
      ElMessage[authValidate.code == 200 ? 'success' : 'error'](authValidate.message)
      return
    }
  }

  let copyAddParams = JSON.parse(JSON.stringify(unref(addParams)))
  if (!copyAddParams.group_id) {
    copyAddParams.group_id = group_id || undefined
  }
  let res = await axios({
    method: 'post',
    url: unref(isEdit) ? '/iftest/condition/env/modify' : '/iftest/condition/env/add',
    data: {
      ...unref(copyAddParams),
      edit_uid: store.getters.user?.username,
      com_header: arrayToObject(unref(headerInfo)),
      ...authParams,
    },
  })
  saveStoreInfo()
  ElMessage[res.code == 200 ? 'success' : 'error'](res.message)
  if (res.code == 200) {
    emitter.emit('custom-close')
  }
}

// 处理编辑信息
let isEdit = ref(false)
onMounted(() => {
  isEdit.value = unref(router.currentRoute).path === '/evnConfig/edit'
  if (unref(isEdit)) {
    let {
      com_header,
      com_header_string,
      oauth_type,
      oauth_value,
      oauth_value_string,
      remark1,
      remark2,
      num,
      update_time,
      ...addParamsOld
    } = JSON.parse(unref(router.currentRoute).query.info)

    axios({
      method: 'post',
      url: '/iftest/condition/stroe/project_db',
      data: {
        branch: addParamsOld.branch,
      },
    }).then(async res => {
      let productAll = await getProductData().then(res => {
        return res.data.datasList
      })
      productData.value = productAll.map(v => {
        let findProduct = res.data.datasList.find(e => e.pro_name === v.pro_name)
        if (findProduct) {
          return {
            ...findProduct,
            pro_port: v.pro_port,
            origin_micro_host: findProduct.micro_host,
            id: findProduct.project_id,
          }
        } else {
          return v
        }
      })
      canChange.value = true
    })

    // 赋值addParams
    delete addParamsOld.gw_port
    delete addParamsOld.env_desc
    addParams.value = addParamsOld

    // 赋值请求头
    if (com_header)
      headerInfo.value = Object.keys(com_header)
        .map(key => ({
          key,
          value: com_header[key],
        }))
        .sort((a, b) => (b.key === 'Content-Type' ? 1 : -1))

    // 赋值鉴权配置
    authInfo.value.oauth_type = oauth_type
    if (oauth_value) {
      authInfo.value.oauth_value = {
        ...oauth_value,
        request_header:
          oauth_value.request_header && Object.keys(oauth_value.request_header).length > 0
            ? Object.keys(oauth_value.request_header).map(key => ({
                key,
                value: oauth_value.request_header[key],
              }))
            : [{}],
        request_param:
          oauth_value.request_param && Object.keys(oauth_value.request_param).length > 0
            ? Object.keys(oauth_value.request_param).map(key => ({
                key,
                value: oauth_value.request_param[key],
              }))
            : [{}],
      }
    }
  } else {
    canChange.value = true
    getProductData().then(res => {
      productData.value = res.data.datasList.map(v => ({
        ...v,
      }))
    })
  }
})

function handleChanged(key, scope) {
  if (scope.$index === 0) {
    productData.value.forEach(ele => {
      ele[key] = scope.row[key]
    })
  }
}
</script>
<style lang="scss" scoped>
.env-add {
  padding: 10px;
}
</style>
