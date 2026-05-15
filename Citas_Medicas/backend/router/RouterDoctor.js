const express = require('express');
const Doctor = require('../models/models_doctors');  // Asegúrate de que el modelo Doctor está definido correctamente
const router = express.Router();

// Obtener todos los doctores
router.get('/', async (req, res) => {
    try {
        const doctores = await Doctor.findAll();
        res.json(doctores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un nuevo doctor
router.post('/', async (req, res) => {
    try {
        const nuevoDoctor = await Doctor.create(req.body);
        res.status(201).json(nuevoDoctor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar la información de un doctor
router.put('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findByPk(req.params.id);
        if (doctor) {
            await doctor.update(req.body);
            res.json(doctor);
        } else {
            res.status(404).json({ error: 'Doctor no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar un doctor
router.delete('/:id', async (req, res) => {
    try {
        const rowsDeleted = await Doctor.destroy({ where: { id: req.params.id } });
        if (rowsDeleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Doctor no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
