const MAX_WORDS_NUM=140
const MAX_IMG_NUM=9
const db=wx.cloud.database()
let content=''
let userInfo={}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum:0,
    footerBottom:0,
    images:[],
    selectPhoto:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo=options
  },
  onInput(event){
    let wordsNum=event.detail.value.length
    if(wordsNum>=MAX_WORDS_NUM){
      wordsNum=`最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
    content=event.detail.value
  },
  onFocus(event){
    this.setData({
      footerBottom:event.detail.height
    })
  },
  onBlur(){
    this.setData({
      footerBottom:0
    })
  },
  onChooseImage(){
    let max=MAX_IMG_NUM-this.data.images.length
    wx.chooseImage({
      count:max,
      sizeType:['original',"compressed"],
      sourceType:["album","camera"],
      success: (res) => {
        this.setData({
          images:this.data.images.concat(res.tempFilePaths)
        })
        max=MAX_IMG_NUM-this.data.images.length
        this.setData({
          selectPhoto:max<=0?false:true
        })
      },
    })
  },
  onDelImage(event){
    this.data.images.splice(event.target.dataset.index,1)
    this.setData({
      images:this.data.images
    })
    if(this.data.images.length==MAX_IMG_NUM-1){
      this.setData({
        selectPhoto:true
      })
    }
  },
  onPreviewImage(event){
    wx.previewImage({
      urls: this.data.images,
      current:event.target.dataset.imgsrc
    })
  },
  send(){
    if(content.trim()===''){
      wx.showModal({
        title:"请输入内容",
        content:""
      })
      return
    }
    wx.showLoading({
      title: '发布中',
      mask:true
    })
    //图片上传
    let promiseArr=[]
    let fileIds=[]
    for(let i=0,len=this.data.images.length;i<len;i++){
      let p=new Promise((resolve,reject)=>{
        let item=this.data.images[i]
        let suffix=/\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath:'blog/'+Date.now()+'-'+Math.random()*1000000+suffix,
          filePath:item,
          success:(res)=>{
            fileIds=fileIds.concat([i,res.fileID])
            resolve()
          },
          fail:(res)=>{
            reject()
          }
        })
      })
      promiseArr.push(p)
    }
    Promise.all(promiseArr).then((res)=>{
      let num=fileIds.length/2
      let newFileIds=[]
      for(let j=0;j<num;j++){
        let x=fileIds.indexOf(j)
        newFileIds.push(fileIds[x+1])
      }
      db.collection('blog').add({
        data:{
          ...userInfo,
          content,
          img:newFileIds,
          createTime:db.serverDate()
        }
      }).then((res)=>{
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })
        wx.navigateBack()
        const pages=getCurrentPages()
        const prevPage=pages[pages.length-2]
        prevPage.onPullDownRefresh()
      })
    }).catch((res)=>{
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
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