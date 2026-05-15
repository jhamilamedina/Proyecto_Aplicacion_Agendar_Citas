const bcrypt = require('bcryptjs');
const Usuario = require('./models/models_usuarios');

async function actualizarContraseña() {
    const saltRounds = 10;
    const plainPassword = 'user2'; // La contraseña actual en texto plano que necesita ser encriptada

    // Generar el hash para la contraseña
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // Actualizar la contraseña en la base de datos
    await Usuario.update(
        { password: hashedPassword },
        { where: { username: 'Lorena Gutierres' } }
    );

    console.log('Contraseña actualizada exitosamente');
}

actualizarContraseña();
