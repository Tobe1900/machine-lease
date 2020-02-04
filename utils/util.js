const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

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

const replaceMonth = str => {
  let tmp = str.replace("月","-")
  let result = tmp.replace("日","")
  return result
}

const replacePonit = time => {
  let tmp = time.replace("点",":")
  let result = tmp.replace("分","")
  return result
}

module.exports = {
  formatTime,
  handleFormat,
  replaceMonth,
  replacePonit
}