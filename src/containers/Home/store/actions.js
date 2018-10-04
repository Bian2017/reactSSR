/**
 * actions
 */

import axios from 'axios'
import { CHANGE_LIST } from './constants'

const changeList = (list) => ({
  type: CHANGE_LIST,
  payload: list
})

// 使用redux-thunk进行异步请求的时候，返回的函数可以接收到dispatch方法
export const getHomeList = (server) => {
  let url = ''
  if (server) {
    url = 'http://47.95.113.63/ssr/api/news.json?secret=D37msjPeC3'
  } else {
    url = '/api/news.json?secret=D37msjPeC3'
  }

  return (dispatch) => {
    // 返回Promise
    return axios.get(url)
      .then((res) => {
        const list = res.data.data
        dispatch(changeList(list))
      })
  }
}