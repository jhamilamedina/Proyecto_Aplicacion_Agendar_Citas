const express = require('express');
const Paciente = require('../models/models_pacientes');
const router = express.Router();

// Obtener todos los pacientes
router.get('/', async (req, res) => {
    try {
        const pacientes = await Paciente.findAll();
        res.json(pacientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pacientes: ' + error.message });
    }
});

// Crear un nuevo paciente
router.post('/', async (req, res) => {
    try {
        if (!req.body.nombre || !req.body.edad) {  // Ejemplo de validación básica
            return res.status(400).json({ error: 'El nombre y la edad son requeridos.' });
        }
        const paciente = await Paciente.create(req.body);
        res.status(201).json(paciente);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el paciente: ' + error.message });
    }
});

// Actualizar un paciente
router.put('/:id', async (req, res) => {
    try {
        const paciente = await Paciente.findByPk(req.params.id);
        if (paciente) {
            await paciente.update(req.body);
            res.json(paciente);
        } else {
            res.status(404).json({ error: 'Paciente no encontrado.' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el paciente: ' + error.message });
    }
});

// Eliminar un paciente
router.delete('/:id', async (req, res) => {
    console.log(`ID recibido para eliminar: ${req.params.id}`);  // Imprimir el ID recibido
    try {
        // Verificar si el paciente existe antes de intentar eliminarlo
        const paciente = await Paciente.findByPk(req.params.id);
        if (!paciente) {
            return res.status(404).json({ error: 'Paciente no encontrado.' });
        }

        // Intentar eliminar el paciente
        const rowsDeleted = await Paciente.destroy({ where: { id: req.params.id } });
        if (rowsDeleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Paciente no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el paciente: ' + error.message });
    }
});


module.exports = router;
