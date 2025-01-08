
import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) { return res.status(403).json({ error: 'Token no proporcionado' }) }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded 
    next() 
  } catch (err) {
    console.error('Error al verificar el token:', err.message)
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}
