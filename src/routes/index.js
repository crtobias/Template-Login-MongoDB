import express from 'express'
import userRoutes from './userRoutes.js'


const routes = express.Router()

routes.get('/', (req, res) => {
  res.json({ message: 'Bienvenido' })
})

routes.use('/users', userRoutes)



export default routes
