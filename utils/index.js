import {base_url} from './config'

export default function request (url, data={}, method="GET") {
  return new Promise((resolve, reject) => {
    wx.request({
      url: base_url + url,
      data,
      method,
      header: {
        cookie: JSON.parse(wx.getStorageSync('COOKIE_KEY') || '[]').toString()
      },
      success: res => {
        const {isLogin} = data
        if(isLogin) {
          wx.setStorageSync('COOKIE_KEY', JSON.stringify(res.cookies))
        }

        if(res.data.code === 200) {
          resolve(res.data)
        }else reject(res)
      }
    })
  })
}