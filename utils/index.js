import {base_url} from './config'

export default function request (url, data={}, method="GET") {
  return new Promise((resolve, reject) => {
    wx.request({
      url: base_url + url,
      data,
      method,
      success: res => {
        if(res.data.code === 200) {
          resolve(res.data)
        }else reject("数据获取失败！")
      }
    })
  })
}