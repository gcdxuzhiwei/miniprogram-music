// pages/musiclist/musiclist.js
let allMusic=[]
let show=10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist:[],
    listInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        playlistId:options.playlistId,
        $url:'musiclist'
      }
    }).then((res)=>{
      const pl=res.result.playlist
      allMusic=pl.trackIds
      this.setData({
        musiclist:pl.tracks,
        listInfo:{
          coverImgUrl:pl.coverImgUrl,
          name:pl.name
        }
      })
      this._setMusiclist()
      wx.hideLoading()
    })
  },
  _setMusiclist(){
    wx.setStorageSync('musiclist', this.data.musiclist)
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
    show=10
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
    if(show>=allMusic.length){
      wx.showToast({
        title: '没有更多了...',
      })
      return
    }
    wx.showLoading({
      title:"加载中"
    })
    let nex=(allMusic.length-show)>=50?50:allMusic.length-show
    let newAr=allMusic.slice(show,show+nex)
    let str=[]
    for(let i=0;i<newAr.length;i++){
      str.push(newAr[i].id)
    }
    str=str.join(',')
    wx.cloud.callFunction({
      name:'music',
      data:{
        musicDetailId:str,
        $url:'musicDetail'
      }
    }).then((res)=>{
      let songs=res.result.songs
      this.setData({
        musiclist:this.data.musiclist.concat(songs)
      })
      this._setMusiclist()
      show+=nex
      wx.hideLoading()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})