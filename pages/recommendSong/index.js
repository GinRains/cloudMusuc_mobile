// pages/recommendSong/index.js
import request from '../../utils/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendList: [],
    day: 0,
    month: 0
  },

  // 跳转song页面
  toSong(event) {
    const {id} = event.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/song/index?id=' + id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })

    if(!wx.getStorageSync('COOKIE_KEY')) {
      wx.showModal({
        title: '请注意!',
        content: '该页面的功能需要登录后才能访问',
        cancelText: '返回首页',
        confirmText: '去登陆',
        success(res) {
          if(res.confirm) {
            wx.navigateTo({
              url: '/pages/login/index'
            })
          }else {
            wx.navigateBack()
          }
        }
      })
    }
    const res = await request('/recommend/songs')

    if(res.code === 200) {
      this.setData({
        recommendList: res.recommend
      })
    }
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