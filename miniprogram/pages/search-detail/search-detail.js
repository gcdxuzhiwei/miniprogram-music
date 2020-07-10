// pages/search-detail/search-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '搜索中',
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        keyword:encodeURI(options.keyword),
        $url:'search'
      }
    }).then((res)=>{
      let req=res.result.result.songs
      let det=[]
      for(let i=0;i<req.length;i++){
        det.push(req[i].id)
      }
      det=det.join(',')
      wx.cloud.callFunction({
        name:'music',
        data:{
          musicDetailId:det,
          $url:'musicDetail'
        }
      }).then((res)=>{
        console.log(res.result.songs);
        this.setData({
          musiclist:res.result.songs
        })
        wx.setStorageSync('musiclist',res.result.songs)
        wx.hideLoading()
      })
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