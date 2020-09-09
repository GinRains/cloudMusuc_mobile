// pages/song/index.js
import request from '../../utils/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlaying: false,
    song: {},
    songUrl: ''
  },

  async changePlayState() {
    const {id, song, songUrl} = this.data

    if(!songUrl) {
      const res = await request('/song/url', {id})
      if(res.code === 200) {
        const {url} = res.data[0]
        this.setData({
          songUrl: url
        })
      }
    }
    
    // 播放及暂停播放逻辑
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    const {songUrl: url} = this.data
    // 第一次 backgroundAudioManager.paused 为undefined
    // 播放 backgroundAudioManager.paused 为false
    // 暂停 backgroundAudioManager.paused 为true
    if(backgroundAudioManager.paused === void 0 || backgroundAudioManager.paused) {
      backgroundAudioManager.title = song.name
      backgroundAudioManager.src = url
    }else {
      backgroundAudioManager.pause()
    }

    this.setData({
      isPlaying: !this.data.isPlaying,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const {id} = options
    const res = await request('/song/detail', {ids: id})
    if(res.code === 200) {
      this.setData({
        id,
        song: res.songs[0]
      })
    }

    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
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