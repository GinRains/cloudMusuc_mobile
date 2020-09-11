// pages/index/index.js
import request from '../../utils/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    songList: [],
    rankingList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 请求banner数据
    request('/banner', {type: 2})
      .then(res => {
        this.setData({bannerList: res.banners})
      })

    // 请求歌单数据
    request('/personalized')
      .then(res => {
        this.setData({
          songList: res.result
        })
      })

      // 请求排行榜信息
      const musicArr = [2, 5, 6, 9]
      let index = 0
      const rankingList = []
      while(musicArr.length > index) {
        const ranking = {}
        const res = await request('/top/list', {idx: musicArr[index++]})
        if(res.code === 200) {
          ranking.id = res.playlist.id
          ranking.name = res.playlist.name
          ranking.musicList = res.playlist.tracks.slice(0, 3)
        }
        rankingList.push(ranking)
        this.setData({ rankingList })
      }
  },

  // 跳转每日推荐
  toRecommend() {
    wx.navigateTo({
      url: '/songPackage/pages/recommendSong/index',
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