// 通用 URL 解析函数
// export * as default from './location'

export function getParam(name, url) {
  url = url || location.href
  const reg = new RegExp('(^|&|\\?|#)' + name + '=([^&]*?)(&|#|$)')
  const tempHash = url.match(/#.*/) ? url.match(/#.*/)[0] : ''
  url = url.replace(/#.*/, '')

  if (reg.test(tempHash)) {
    return decodeURIComponent(tempHash.match(reg)[2])
  } else if (reg.test(url)) {
    return decodeURIComponent(url.match(reg)[2])
  } else {
    return ''
  }
}

export function setParam(name, value, url, isHashMode) {
  if (typeof name === 'undefined' || typeof value === 'undefined' || typeof url === 'undefined') {
    return url
  }

  const reg = new RegExp('(^|&|\\?|#)' + name + '=([^&]*?)(&|#|$)')
  let tempHash = url.match(/#.*/) ? url.match(/#.*/)[0] : ''
  let separator

  url = url.replace(/#.*/, '')
  if (isHashMode) {
    if (reg.test(tempHash)) {
      tempHash = tempHash.replace(reg, function(m, r1, r2, r3) {
        return r1 + name + '=' + encodeURIComponent(value) + r3
      })
    } else {
      separator = tempHash.indexOf('#') === -1 ? '#' : '&'
      tempHash = tempHash + separator + name + '=' + encodeURIComponent(value)
    }
    tempHash = tempHash.replace(reg, function(m, r1, r2, r3) {
      return r1 + name + '=' + encodeURIComponent(value) + r3
    })
    return tempHash + url
  } else if (reg.test(url)) {
    url = url.replace(reg, function(m, r1, r2, r3) {
      return r1 + name + '=' + encodeURIComponent(value) + r3
    })
  } else {
    separator = url.indexOf('?') === -1 ? '?' : '&'
    url = url + separator + name + '=' + encodeURIComponent(value)
  }
  return url + tempHash
}

// 删除指定参数
export function delParam(name, url) {
  const reg = new RegExp('[\\?&]' + name + '=[^&#]*&?', 'g')

  // 提供了 url 参数则返回替换结果，否则替换地址栏路径
  if (url) {
    return url.replace(reg, '')
  } else {
    history.replaceState(null, '', location.href.replace(reg, ''))
  }
}

// 将 url 中的参数全部提取到一个对象
export function getQuery(url) {
  const { query } = parseUrl(url)
  return query
}

export function parseUrl(url) {
  const urlArr = decodeURIComponent(url).split('?')
  const path = urlArr[0]
  const search = urlArr[1] || ''
  const query = {}

  if (search) {
    const searchArr = search.split('&')
    let arr

    for (const item of searchArr) {
      if (!item) continue
      arr = item.split('=')
      query[arr[0]] = arr[1]
    }
  }

  return {
    url,
    path,
    query,
  }
}

export function setParams(url, obj) {
  for (const key in obj) {
    url = setParam(key, obj[key], url)
  }
  return url
}
