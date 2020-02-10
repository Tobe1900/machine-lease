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
  let tmp = str.replace("月","-")
  let result = tmp.replace("日","")
  return result
}

const convertTime = time => {
  let tmp = time.replace("点",":")
  let result = tmp.replace("分","")
  return result
}

const replaceHourStr = h => {
  let tmp = h.replace("点","")
  return tmp
}

const replaceMinuteStr = m => {
  let tmp = m.replace("分","")
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

module.exports = {
  formatTime,
  handleFormat,
  convertDate,
  convertTime,
  replaceHourStr,
  replaceMinuteStr,
  handleDate
}