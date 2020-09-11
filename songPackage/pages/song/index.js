// pages/song/index.js
import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../../utils/index'
const appInstance = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlaying: false,
    song: {},
    songUrl: '',
    id: 0,
    currentTime: '00:00',
    durationTime: '--:--',
    currentProgress: 0
  },

  // 获取歌曲播放地址
  async getSongUrl() {
    const {id} = this.data
    const {songId} = appInstance.globalData

    if(parseInt(songId) !== id) {
      const res = await request('/song/url', {id})
      if(res.code === 200) {
        const {url} = res.data[0]
        this.setData({
          songUrl: url
        })
      }
    }

    return Promise.resolve()
  },

  // 获取歌曲详情
  async getSongDetail (id) {
    const {songId, isPlaying} = appInstance.globalData
    const res = await request('/song/detail', {ids: id})
    if(res.code === 200) {
      this.setData({
        id,
        song: res.songs[0],
        // durationTime: moment(res.songs[0].dt).format('mm:ss')
        durationTime: res.songs[0].dt
      })
    }

    if(isPlaying && songId === id) {
      this.setData({
        isPlaying: true
      })
    }

    this.handleBackgroundAudio()
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },

  // 处理页面播放及暂停逻辑
  async changePlayState() {
    // 获取songUrl
    await this.getSongUrl()

    this.setData({
      isPlaying: !this.data.isPlaying
    })
    
    this.changeAudioPlay()
  },

  // 处理切换音频逻辑
  changeAudioPlay() {
    // 播放及暂停播放逻辑
    const {songUrl: url, isPlaying, song, id} = this.data

    // 第一次 backgroundAudioManager.paused 为undefined
    // 播放 backgroundAudioManager.paused 为false
    // 暂停 backgroundAudioManager.paused 为true
    if(isPlaying) {
      this.backgroundAudioManager.title = song.name
      this.backgroundAudioManager.src = url

      // 存储状态及id
      appInstance.globalData.songId = id
      appInstance.globalData.isPlaying = true
    }else {
      this.backgroundAudioManager.pause()

      appInstance.globalData.isPlaying = false
    }
  },

  // 处理背景音乐播放逻辑
  handleBackgroundAudio() {
    this.backgroundAudioManager.onPlay(async () => {
      const {songId: prevId} = appInstance.globalData
      const {id: currId} = this.data

      if(prevId !== currId) {
        await this.getSongUrl()

        this.backgroundAudioManager.title = this.data.song.name
        this.backgroundAudioManager.src = this.data.songUrl
      }

      this.setData({
        isPlaying: true
      })
      appInstance.globalData.isPlaying = true
    })

    this.backgroundAudioManager.onPause(() => {
      const {songId: prevId} = appInstance.globalData
      const {id: currId} = this.data

      if(prevId === currId) {
        this.setData({
          isPlaying: false
        })
      }

      appInstance.globalData.isPlaying = false
    })

    this.backgroundAudioManager.onStop(() => {
      const {songId: prevId} = appInstance.globalData
      const {id: currId} = this.data
      if(prevId === currId) {
        this.setData({
          isPlaying: false
        })
      }

      appInstance.globalData.isPlaying = false
    })

    // 读取当前播放时间
    this.backgroundAudioManager.onTimeUpdate(() => {
      const time = this.backgroundAudioManager.currentTime * 1000
      const {song} = this.data
      const progress = time * 100 / song.dt

      this.setData({
        // currentTime: moment(time).format('mm:ss'),
        currentTime: time,
        currentProgress: progress
      })
    })

    // 自然播放结束
    this.backgroundAudioManager.onEnded(() => {
      PubSub.publish('switchSong', 'next')
    })
  },

  // 切换歌曲
  switchSong(event) {
    const {type} = event.currentTarget.dataset
    // 发布消息
    PubSub.publish('switchSong', type)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    const {id} = options

    // 订阅传送过来的歌曲id
    PubSub.subscribe('switchedSong', async (msg, data) => {
      this.setData({
        id: data
      })

      await this.getSongDetail(data)
      await this.getSongUrl()
      this.changeAudioPlay()
    })
    // 获取音频详情
    await this.getSongDetail(id)
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