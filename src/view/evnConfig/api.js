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
