const express = require('express');
const Especialidad = require('../models/models_especialidades');
const router = express.Router();

// Obtener todas las especialidades
router.get('/', async (req, res) => {
    try {
        const especialidades = await Especialidad.findAll();
        res.json(especialidades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear una nueva especialidad
router.post('/', async (req, res) => {
    try {
        const especialidad = await Especialidad.create(req.body);
        res.status(201).json(especialidad);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar una especialidad
router.put('/:id', async (req, res) => {
    try {
        const especialidad = await Especialidad.findByPk(req.params.id);
        if (especialidad) {
            await especialidad.update(req.body);
            res.json(especialidad);
        } else {
            res.status(404).json({ error: 'Especialidad no encontrada' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar una especialidad
router.delete('/:id', async (req, res) => {
    try {
        const rowsDeleted = await Especialidad.destroy({ where: { id: req.params.id } });
        if (rowsDeleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Especialidad no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
