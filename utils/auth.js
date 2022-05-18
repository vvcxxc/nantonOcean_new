const TokenKey = ''

export function getToken () {
  return uni.getStorageSync(TokenKey)
}

export function setToken (accessToken) {
    uni.setStorage({
        key: TokenKey,
        data: accessToken
    })
}

export function removeToken () {
  uni.clearStorageSync()
}
