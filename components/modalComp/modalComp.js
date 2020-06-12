Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  options:{
    multipleSlots: true
  },
  /**
   * 组件的初始数据
   */
  data: {
   isShow:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hide() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    show() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
  }
})
