
import { sendPasswordEmail } from "../email.js"
import { generateToken } from "../jwt.js"

export const sendEmailChangePassword = async (req, res) => {
    const {newPassword , email } = req.body

    if(!email || !newPassword){ return res.status(400).json({ error: 'se nesecita email y password para seguir' }) }

    const token = generateToken({password: newPassword , email: email }, '1h')
    console.log('generamos token');
    
    sendPasswordEmail(email , token)
    return res.status(200).json({ message: `Se envio el cambio de password al email ${email}`})
}
  