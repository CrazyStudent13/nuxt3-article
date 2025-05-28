/**
 * 判断url是否是http或https
 */
export function isHttp(url: string | string[]) {
  return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
}

/**
 * 判断path是否为外链
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 判断是否为url地址
 */
export function validURL(url: string) {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * 判断是否为邮箱
 */
export function validEmail(email: string) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * 判断是否为字符串
 */
export function isString(str: any) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * 判断是否为数组
 */
export function isArray(arg: any) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 判断一个字符串是否全部由中文组成。
 */
export function isChinese(str: string) {
  const reg = /^[\u4e00-\u9fa5]+$/ // 匹配所有中文字符的正则表达式
  return reg.test(str)
}

/**
 * 判断字符串是否包含中文字符
 * @param {string} str - 要检查的字符串
 * @returns {boolean} - 如果包含中文返回 true，否则返回 false
 */
export function isHasChinese(str: string): boolean {
  const reg = /[\u4e00-\u9fa5]/
  return reg.test(str)
}

/**
 * 判断字符串是否完全由英文字符构成
 * @param {string} str
 * @returns {Boolean}
 */
export function isEnglish(str: string): boolean {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * 判断一个字符串是否为大写字母组成。
 */
export function validUpperCase(str: string) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * 判断一个字符串是否为小写字母组成。
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str: string) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * 判断字符串是否包含空格
 * @param {string} str
 * @returns {Boolean}
 */
export function hasWhiteSpace(str: string): boolean {
  const reg = /\s/
  return reg.test(str)
}

/**
 * 判断字符串是否全部为允许的字符串（仅允许输入字母、数字）
 * @param {string} str
 * @returns {Boolean} 如果包含禁止字符则返回 true
 */
export function isLegalChars(str: string): boolean {
  const reg = /^[a-zA-Z0-9]+$/
  return reg.test(str)
}

/**
 * 验证是否为数字
 * @param {string} str
 * @returns {Boolean} 如果为空则返回 true
 */
export function isNumeric(value: string | number): boolean {
  if (typeof value === 'number') {
    return !isNaN(value) && isFinite(value)
  }
  if (typeof value === 'string') {
    const num = Number(value)
    return !isNaN(num) && isFinite(num)
  }
  return false
}

/**
 * 验证是否为空值
 * @param {any} val
 * @returns {Boolean} 如果为空则返回 true
 */
export function isEmpty(val: any): boolean {
  if (val === null || typeof val === 'undefined' || val === '') {
    return true
  }
  return false
}
