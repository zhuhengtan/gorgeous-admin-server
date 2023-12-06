export enum ResCode {
  Unauthorized = 401,

  SmsCodeStillValid = 5000,
  PostIsGone = 5001,
  CommentIsGone = 5002,

  NeedMobile = 8000,
  NeedWechat = 8001,

  UserIsBanned = 9000,
}