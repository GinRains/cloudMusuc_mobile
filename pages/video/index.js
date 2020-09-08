// pages/video/index.js
import request from '../../utils/index'
import newVideoList from '../../utils/video'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    barList: [],
    videoList: [],
    currentId: 0,
    isRefresh: false
  },

  // 切换navbar
  changeId(event) {
    const {id} = event.target.dataset
    
    this.setData({
      currentId: id
    })

    this.getVideoList(id)
  },

  // 获取video列表
  async getVideoList(id) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    try {
      const res = await request('/video/group', {id})
    
      if(res.code === 200) {
        this.setData({
          videoList: res.datas,
          isRefresh: false
        })
        wx.hideLoading()
      }
    }catch(err) {
       if(err.data.code === 301) {
        wx.showToast({
          title: '请登录，跳转中',
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/login/index'
              })
            }, 1000)
          }
        })
      }
    }
  },

  // 下拉刷新逻辑
  handleRefresh() {
    const {currentId} = this.data
    this.getVideoList(currentId)
  },

  // 触底加载更多
  handleScrollToLower() {
    const {videoList} = this.data
    wx.showToast({
      title: '加载中...',
      icon: 'none',
      success: () => {
        this.setData({
          videoList: [...videoList, ...newVideoList]
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    request('/video/group/list')
      .then(res => {
        if(res.code === 200) {
          const barList = res.data.slice(0, 15)
          this.setData({
            barList,
            currentId: barList[0].id
          })
          this.getVideoList(barList[0].id)
        }
      })

    // try {
    //   const res = await request('/video/group/list')

    //   if(res.code === 200) {
    //     const barList = res.data.slice(0, 15)
    //     this.setData({
    //       barList,
    //       currentId: barList[0].id
    //     })
    //     this.getVideoList(barList[0].id)
    //   }
    // }catch(err) {
    //   wx.showToast({
    //     title: err.data.msg,
    //     icon: 'none'
    //   })
    // }
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