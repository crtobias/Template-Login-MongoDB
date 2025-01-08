import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const changePassword = async (req, res) => {
    try {
        const { token } = req.query;

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const email = decoded.email;
        const newPassword = decoded.password;

        // Buscar usuario por email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña en la base de datos
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        console.log(`Se cambió la contraseña para el usuario: ${email}`);
        return res.status(200).json({ message: 'Contraseña cambiada exitosamente.' });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ error: 'Token inválido o expirado.' });
        }
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};
