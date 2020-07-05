let userInfo={}
const db=wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId:String,
    blog:Object
  },
  options:{
    styleIsolation:"apply-shared"
  },
  /**
   * 组件的初始数据
   */
  data: {
    loginShow:false,
    modalShow:false,
    content:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment(){
      wx.getSetting({
        success:(res)=>{
          if(res.authSetting['scope.userInfo']){
            wx.getUserInfo({
              success: (res) => {
                userInfo=res.userInfo
                this.setData({
                  modalShow:true
                })
              },
            })
          }else{
            this.setData({
              loginShow:true
            })
          }
        }
      })
    },
    onLoginsuccess(event){
      userInfo=event.detail
      this.setData({
        loginShow:false
      },()=>{
        this.setData({
          modalShow:true
        })
      })
    },
    onLoginfail(){
      wx.showModal({
        title:"授权用户才能进行评论",
        content:""
      })
    },
    onSend(event){
      let form=event.detail.formId
      let content=event.detail.value.content
      if(content.trim()==''){
        wx.showModal({
          title:'评论内容不能为空',
          content:""
        })
        return
      }
      wx.showLoading({
        title: '评价中',
        mask:true
      })
      db.collection('blog-comment').add({
        data:{
          content,
          createTime:db.serverDate(),
          blogId:this.properties.blogId,
          nickName:userInfo.nickName,
          avatarUrl:userInfo.avatarUrl
        }
      }).then((res)=>{
        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
        })
        this.setData({
          modalShow:false,
          content:''
        })
        this.triggerEvent('refreshCommentList')
      })
    }
  }
})
