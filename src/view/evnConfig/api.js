import axios from '@/lin/plugin/axios'
export async function getProductData() {
  return await axios({
    method: 'post',
    url: '/iftest/product/proList',
  })
}

export async function getProjectData() {
  return axios({
    method: 'post',
    url: '/iftest/product/proLinList',
  })
}

export async function getUserProjectData(uid) {
  return await axios({
    method: 'POST',
    url: '/iftest/product/userProLine',
    data: {
      user_id: uid,
    },
  })
}
