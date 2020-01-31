// components/cartCountCom/cartCountCom.js
Component({
  /**
   * 
   * 组件的属性列表
   */
  properties: {
    numProp: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    num: 0
  },
  pageLifetimes: {
    show: function() {
      // 页面被展示
      console.log('hhh11')
      this.setData({
        num: this.properties.numProp
      })
    }
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      console.log('hhh')
      this.setData({
        num: this.properties.numProp
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindMinus() {
      console.log('min', this.properties.numProp)
      if (this.properties.numProp > 1) {
        this.properties.numProp--
          this.setData({
            num: this.properties.numProp
          })
      }
      this.trigger('changeTotalNum')
    },
    bindPlus() {
      console.log('max', this.properties.numProp)
      this.properties.numProp++
        this.setData({
          num: this.properties.numProp
        })
    }
  }
})