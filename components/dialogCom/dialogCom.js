Component({
  options:{
    multipleSlots: true
  },
  properties:{
    title:{
      type:String,
      value:'标题'
    },
    content:{
      type:String,
      value:'弹窗内容'
    },
    isPhone:{
      type:Boolean,
      value: false
    },
    confirmText:{
      type: String,
      value: '确定'
    }
  },
  data:{
    isShow:false
  },
  
  methods:{
    hideDialog(){
      this.setData({
        isShow:!this.data.isShow
      })
    },
    showDialog(){
      this.setData({
        isShow:!this.data.isShow
      })
    },
    confirmEvent(){
      this.triggerEvent("confirmEvent")
    },
    bindGetUserInfo(){
      this.triggerEvent("bindGetUserInfo")
    },
    getPhoneNumber(event){
      let detail = event.detail
      this.triggerEvent("getPhoneNumber",{code:detail})
    }
  }
})