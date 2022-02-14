import nodemailer from 'nodemailer' //引入模块
import envConfig from '../../env'

const transporter = nodemailer.createTransport({
  service: envConfig.email.service,
  port: envConfig.email.port,
  secure: true, // true for 465, false for other ports
  auth: {
    user: envConfig.email.auth.user, // 发送方的邮箱
    pass: envConfig.email.auth.pass // smtp 的授权码
  }
});

interface Props {
  email: string
  subject: string
  text?: string
  html?: string
}

export const sendMail = async (props: Props) => {
  const { email, subject, text, html } = props
  // 发送的配置项
  let mailOptions = {
    from: envConfig.email.from, // 发送方
    to: email, //接收者邮箱，多个邮箱用逗号间隔
    subject: subject, // 标题
    text: '',
    html: '',
    // html: '<p>这里是"Express-demo"详情请点击:</p><a href="https://www.jianshu.com/u/5cdc0352bf01">点击跳转</a>', //页面内容
  };
  if (text) {
    mailOptions.text = text
  }
  if (html) {
    mailOptions.html = html
  }

  //发送函数
  const res = await transporter.sendMail(mailOptions);
  if (res.response.includes('OK')) {
    return true
  }
  return false
}