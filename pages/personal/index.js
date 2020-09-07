// pages/personal/index.js
import request from '../../utils/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    changeDistance: 0,
    transition: 'none',
    playList: [],
    profile: {}
  },

  // 处理 cover-container 区域点击事件
  handleStart(event) {
    this.setData({
      transition: 'none'
    })

    this.startY = event.touches[0].clientY;
  },

  // 处理 cover-container 区域移动事件
  handleMove(event) {
    this.moveY = event.touches[0].clientY;
    const changeDistance = Math.floor(this.moveY - this.startY)

    if(changeDistance >= 100 || changeDistance <= 0) return void 0

    this.setData({
      changeDistance
    })
  },

  // 处理 cover-container 区域离开事件
  handleEnd() {
    this.setData({
      changeDistance: 0,
      transition: 'transform 1.5s ease'
    })
  },

  // 去登陆界面
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/index'
    })
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
  onShow: function() {
    wx.getStorage({
      key: 'TOKEN_KEY',
      success: async ({data}) => {
        const profile = JSON.parse(data)

        this.setData({
          profile
        })
        const {userId: uid} = profile
        const res = await request('/user/record', {uid, type: 1})
    
        if(res.code === 200) {
          const playList = res.weekData.slice(0, 20).reduce((arr, curr) => {
            const songObj = {}
            songObj.id = curr.song.id
            songObj.picUrl = curr.song.al.picUrl

            return arr.concat(songObj)
          }, [])
          
          this.setData({
            playList
          })
        }
      }
    })
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