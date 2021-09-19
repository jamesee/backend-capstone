const nodemailer = require('nodemailer')

module.exports = (username, password) => {
  const service = {}

  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: username,
      pass: password
    }
  })

  service.sendEmail = async (to, subject, text) => {
    return transport.sendMail({
      to: to,
      subject: subject,
      text: text
    })
  }

  return service
}