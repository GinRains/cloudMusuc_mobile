// pages/login/indexx.js
import request from '../../utils/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },

  // 处理表单value改变事件
  handleChange(event) {
    const {type} = event.target.dataset
    const {value} = event.detail

    if(!value.trim()) return void 0;

    if(type === 'phone') {
      if(!/^1\d{10}$/.test(value)) {
        wx.showToast({
          title: '手机号格式不正确！',
          icon: 'none'
        })

        return void 0;
      }

      this.setData({
        phone: value
      })
    }

    if(type === 'password') {
      if(!/^\w{6,}$/.test(value)) {
        wx.showToast({
          title: '密码最短为6位！',
          icon: 'none'
        })

        return void 0;
      }

      this.setData({
        password: value
      })
    }
  },

  // 处理登录逻辑
  async handleLogin() {
    const {phone, password} = this.data

    try {
      const res = await request('/login/cellphone', {phone, password})
      if(res.code === 200) {
        const {profile} = res
        wx.showToast({
          title: '即将跳转首页！',
          icon: 'success',
          success: () => {
            wx.setStorage({
              key: 'TOKEN_KEY',
              data: JSON.stringify(profile)
            })
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }, 1000) 
          }
        })
      }
    }catch(err) {
      // 501 手机号不存在
      // 502 手机密码错误
      const {code, message} = err.data
      
      if(code !== 200) {
        wx.showToast({
          title: `${message}！`,
          icon: 'none'
        })

        return void 0;
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})