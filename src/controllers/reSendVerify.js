import { PrismaClient } from '@prisma/client';
import { generateToken } from '../jwt.js';
import { sendVerificationEmail } from '../email.js';

const prisma = new PrismaClient();

export const reSendVerify = async (req, res) => {
  const { email } = req.body;

  try {
    // Buscar usuario por correo electrónico
    const existingUser = await prisma.user.findFirst({
      where: {
        email, // Filtramos por correo electrónico, MongoDB manejará el ObjectId automáticamente
      },
    });

    if (existingUser) {
      // Generar el token con id y rol del usuario
      const token = generateToken({ id: existingUser.id, rol: existingUser.rol }, '1h');
      
      // Enviar correo de verificación
      await sendVerificationEmail(email, token);
      console.log('Verificación enviada');

      return res.status(200).json({ message: 'Se envió el correo de verificación.' });
    } else {
      return res.status(400).json({ error: 'No se encontró el correo electrónico.' });
    }
  } catch (error) {
    console.error('Error al reenviar correo de verificación:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  } finally {
    await prisma.$disconnect();
  }
};
