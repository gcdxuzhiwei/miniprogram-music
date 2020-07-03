// pages/player/player.js
let musiclist=[]
let nowPlayingIndex=0
const backgroundAudioManager=wx.getBackgroundAudioManager()
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl:'',
    isPlaying:false,
    isLyricShow:false,
    lyric:"",
    isSame:false //是否为同一首歌曲
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    nowPlayingIndex=options.index
    musiclist=wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicId)
  },
  _loadMusicDetail(musicId){
    if(musicId==app.getPlayingMusicId()){
      this.setData({
        isSame:true
      })
    }else{
      this.setData({
        isSame:false
      })
    }
    if(!this.data.isSame){
      backgroundAudioManager.stop()
    }
    let music=musiclist[nowPlayingIndex]
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl:music.al.picUrl,
      isPlaying:false
    })
    app.setPlayingMusicId(musicId)
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        $url:'musicUrl',
        musicId:musicId
      }
    }).then((res)=>{
      let result=JSON.parse(res.result)
      if(result.data[0].url==null){
        wx.showToast({
          title: '无权限播放',
        })
        return
      }
      if(!this.data.isSame){
      backgroundAudioManager.src=result.data[0].url
      backgroundAudioManager.title=music.name
      backgroundAudioManager.coverImgUrl=music.al.picUrl
      backgroundAudioManager.singer=music.ar[0].name
      backgroundAudioManager.epname=music.al.name
      }
      backgroundAudioManager.play()
      this.setData({
        isPlaying:true
      })
      wx.hideLoading()
      //加载歌词
      wx.cloud.callFunction({
        name:'music',
        data:{
          $url:'lyric',
          musicId:musicId
        }
      }).then((res)=>{
        let lyric='暂无歌词'
        const lrc=JSON.parse(res.result).lrc
        if(lrc){
          lyric=lrc.lyric
        }
        this.setData({
          lyric
        })
      })
    })
  },
  togglePlaying(){
    if(this.data.isPlaying){
      backgroundAudioManager.pause()
    }else{
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying:!this.data.isPlaying
    })
  },
  onPrev(){
    nowPlayingIndex--
    if(nowPlayingIndex<0){
      nowPlayingIndex=musiclist.length-1
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  onNext(){
    nowPlayingIndex++
    if(nowPlayingIndex===musiclist.length){
      nowPlayingIndex=0
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  onChangeLyricShow(){
    this.setData({
      isLyricShow:!this.data.isLyricShow
    })
  },
  timeUpdate(event){
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  onPlay() {
    this.setData({
      isPlaying: true
    })
  },
  onPause() {
    this.setData({
      isPlaying: false
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