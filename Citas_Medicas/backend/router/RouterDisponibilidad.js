const express = require('express');
const Disponibilidad = require('../models/models_disponibilidad');
const router = express.Router();

// Obtener todas las disponibilidades
router.get('/', async (req, res) => {
    try {
        const disponibilidades = await Disponibilidad.findAll();
        res.json(disponibilidades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear una nueva disponibilidad
router.post('/', async (req, res) => {
    const { doctor_id, dia_de_semana, horario_inicio, horario_final } = req.body;
  
    // Verificar los datos que llegan al backend
    console.log('Datos recibidos:', req.body);
  
    // Validar que todos los campos necesarios estén presentes
    if (!doctor_id || !dia_de_semana || !horario_inicio || !horario_final) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
  
    try {
        const newDisponibilidad = await Disponibilidad.create({
            doctor_id,
            dia_de_semana,
            horario_inicio,
            horario_final,
            fecha_creacion: new Date()
        });
  
        // Verificar la creación de la nueva disponibilidad
        console.log('Nueva disponibilidad creada:', newDisponibilidad);
  
        res.status(201).json(newDisponibilidad);
    } catch (error) {
        console.error('Error al crear disponibilidad:', error);
        res.status(500).json({ error: 'Error al agregar el horario' });
    }
});  

// Obtener una disponibilidad específica por ID
router.get('/:id', async (req, res) => {
    try {
        const disponibilidad = await Disponibilidad.findByPk(req.params.id);
        if (disponibilidad) {
            res.json(disponibilidad);
        } else {
            res.status(404).json({ error: 'Disponibilidad no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar una disponibilidad específica por ID
router.put('/:id', async (req, res) => {
    try {
        const disponibilidad = await Disponibilidad.findByPk(req.params.id);
        if (disponibilidad) {
            await disponibilidad.update(req.body);
            res.json(disponibilidad);
        } else {
            res.status(404).json({ error: 'Disponibilidad no encontrada' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar una disponibilidad específica por ID
router.delete('/:id', async (req, res) => {
    try {
        const rowsDeleted = await Disponibilidad.destroy({ where: { id: req.params.id } });
        if (rowsDeleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Disponibilidad no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
