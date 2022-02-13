export default function () {
  return async function (ctx: any, next: any) {
    ctx.success = async function (message: string = "success", data: any) {
      ctx.body = {
        code: 200,
        message,
        data,
      }
    }
    ctx.fail = async function (message: string, code: number) {
      ctx.body = {
        code: code || 500,
        message: message || 'fail',
      }
    }
    await next()
  }
}