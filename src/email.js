import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, //configurar esto
    pass: process.env.EMAIL_PASSWORD //configurar esto
  }
})

export const sendVerificationEmail = (email, verificationToken) => {
  const verifyUrl = `http://localhost:3000/users/verify-email?token=${verificationToken}`

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Verificación de correo electrónico',
    html: `<p>Haz clic en el siguiente enlace para verificar tu correo electrónico:</p><a href="${verifyUrl}">${verifyUrl}</a>`
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar correo:', error)
    } else {
      console.log('Correo enviado:', info.response)
    }
  })
}

export const sendPasswordEmail = (email, Token) => {  
  const verifyUrlPassword = `http://localhost:3000/users/change-password?token=${Token}`;

  const mailOptionsPassword = {
    from: process.env.EMAIL,
    to: email,
    subject: 'estas seguro que quieres cambiar tu password?',
    html: `<p>Haz clic en el siguiente enlace para cambiar tu password:</p><a href="${verifyUrlPassword}">${verifyUrlPassword}</a>`
  }

  transporter.sendMail(mailOptionsPassword, (error, info) => {
    if (error) {
      console.error('Error al enviar correo:', error)
    } else {
      console.log('Correo enviado:', info.response)
    }
  })

}