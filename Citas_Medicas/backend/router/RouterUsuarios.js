const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/models_usuarios');
const router = express.Router();

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un usuario específico por ID
router.get('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un nuevo usuario (Registro)
router.post('/', async (req, res) => {
    const { username, password, email, role } = req.body;

    try {
        // Generar un hash para la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Crear el usuario con la contraseña encriptada
        const usuario = await Usuario.create({
            username,
            password: hashedPassword, // Guardar la contraseña encriptada
            email,
            role
        });

        res.status(201).json(usuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar un usuario existente por ID
router.put('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (usuario) {
            await usuario.update(req.body);
            res.json(usuario);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar un usuario por ID
router.delete('/:id', async (req, res) => {
    try {
        const rowsDeleted = await Usuario.destroy({ where: { id: req.params.id } });
        if (rowsDeleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para iniciar sesión (Login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar al usuario por el email
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        // Verificar la contraseña encriptada
        const isMatch = await bcrypt.compare(password, usuario.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Autenticación exitosa, devolver todos los datos relevantes del usuario
        res.status(200).json({
            id: usuario.id,
            username: usuario.username,
            email: usuario.email,
            role: usuario.role,
            fecha_creacion: usuario.fecha_creacion
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

module.exports = router;
