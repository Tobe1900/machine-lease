// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const handleFormat = d => {
  if (d.indexOf('-') >= 0) {
    let tmp = d.split('-')
    return {
      date: tmp[0],
      day: tmp[1]
    }
  }
}

const convertDate = str => {
  let tmp = str.replace("月", "-")
  let result = tmp.replace("日", "")
  return result
}

const convertTime = time => {
  let tmp = time.replace("点", ":")
  let result = tmp.replace("分", "")
  return result
}

const replaceHourStr = h => {
  let tmp = h.replace("点", "")
  return tmp
}

const replaceMinuteStr = m => {
  let tmp = m.replace("分", "")
  return tmp
}


const formatDate = (date, fmt) => {
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}

const formatTime = (date, match) => {
  let tmp = Date.parse(date)
  let result = formatDate(new Date(tmp), match)
  return result
}
// 获取 *月*日 格式数据
const handleDate = date => {
  let tmpDate = new Date(date)
  return `${tmpDate.getMonth() + 1}月${tmpDate.getDate()}日`
}

//防止多次重复点击  （函数节流）
const throttle = (fn, gapTime) => {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1000
  }
  let _lastTime = null
  // 返回新的函数
  return function(e) {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      // fn.apply(this, arguments)   //将this和参数传给原函数
      fn(this, e) //上方法不可行的解决办法 改变this和e
      _lastTime = _nowTime
    }
  }
}

const debounce = (fn, interval) => {
  var timer;
  var gapTime = interval || 1000; //间隔时间，如果interval不传，则默认1000ms
  return function(e) {
    clearTimeout(timer);
    var context = this;
    // var args = arguments;//保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function() {
      fn(context, e);
    }, gapTime);
  };
}


module.exports = {
  formatTime,
  handleFormat,
  convertDate,
  convertTime,
  replaceHourStr,
  replaceMinuteStr,
  handleDate,
  throttle,
  debounce
}