export const generateTmpPwd = (length: number) => {
  if (length <= 0) {
    throw new Error('请输入正确密码长度')
  }
  const charString = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890'
  let res = ''
  for(let i = 0; i<length; i++){
    res += charString.charAt(Math.floor(Math.random() * 61))
  }
  return res
}

export const getRandomCode = (length: number):string => {
  let str = ''
  for (let i = 0; i<length; i++){
    str += Math.floor(Math.random() * 10)
  }
  return str
}