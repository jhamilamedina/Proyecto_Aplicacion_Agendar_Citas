import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './Pacientes.css';

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [nuevoPaciente, setNuevoPaciente] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    genero: '',
    telefono: '',
    direccion: '',
    historial_medico: '',
    dni: '',
    user_id: ''
  });
  const [currentPage, setCurrentPage] = useState(0);
  const pacientesPerPage = 5;

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/pacientes');
        setPacientes(response.data);
      } catch (error) {
        console.error('Error al obtener los pacientes:', error);
      }
    };

    fetchPacientes();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Fitro de busqueda por nombre y dni
  const filteredPacientes = pacientes.filter(paciente =>
    (paciente.nombre && paciente.nombre.toLowerCase().includes(searchTerm)) ||
    (paciente.dni && paciente.dni.toLowerCase().includes(searchTerm))
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const startIndex = currentPage * pacientesPerPage;
  const endIndex = startIndex + pacientesPerPage;
  const currentPacientes = filteredPacientes.slice(startIndex, endIndex);

  const handleChange = (e) => {
    setNuevoPaciente({ ...nuevoPaciente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/pacientes', nuevoPaciente);
      setPacientes([...pacientes, response.data]);
      setModalOpen(false);
      setNuevoPaciente({
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        genero: '',
        telefono: '',
        direccion: '',
        historial_medico: '',
        dni: '',
        user_id: '' // Reseteo del campo user_id
      });
    } catch (error) {
      console.error('Error al agregar el paciente:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este paciente?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5001/api/pacientes/${id}`);
        setPacientes(pacientes.filter(paciente => paciente.id !== id));
      } catch (error) {
        console.error('Error al eliminar el paciente:', error);
      }
    }
  };

  const handleEditClick = (paciente) => {
    setPacienteSeleccionado(paciente);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/api/pacientes/${pacienteSeleccionado.id}`, pacienteSeleccionado);
      setPacientes(pacientes.map(paciente =>
        (paciente.id === pacienteSeleccionado.id ? pacienteSeleccionado : paciente)
      ));
      setEditModalOpen(false);
      setPacienteSeleccionado(null);
    } catch (error) {
      console.error('Error al editar el paciente:', error);
    }
  };

  const handleEditChange = (e) => {
    setPacienteSeleccionado({ ...pacienteSeleccionado, [e.target.name]: e.target.value });
  };

  return (
    <div className="pacientes-container">
      <h1>Pacientes</h1>
      <button className="agregar-paciente" onClick={() => setModalOpen(true)}>Agregar Paciente</button>
      <div className="buscador">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <table className="pacientes-table">
        <thead>
          <tr>
            <th>N°</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Género</th>
            <th>Fecha de Nacimiento</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Historial Médico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentPacientes.map((paciente) => (
            <tr key={paciente.id}>
              <td>{paciente.id}</td>
              <td>{paciente.nombre}</td>
              <td>{paciente.apellido}</td>
              <td>{paciente.genero}</td>
              <td>{new Date(paciente.fecha_nacimiento).toLocaleDateString()}</td>
              <td>{paciente.dni}</td>
              <td>{paciente.telefono}</td>
              <td>{paciente.direccion}</td>
              <td>{paciente.historial_medico}</td>
              <td>
                <button onClick={() => handleEditClick(paciente)}>Editar</button>
                <button onClick={() => handleDelete(paciente.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={'Anterior'}
        nextLabel={'Siguiente'}
        breakLabel={'...'}
        pageCount={Math.ceil(filteredPacientes.length / pacientesPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
            <h2>Agregar Paciente</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="nombre" placeholder="Nombre" value={nuevoPaciente.nombre} onChange={handleChange} required />
              <input type="text" name="apellido" placeholder="Apellido" value={nuevoPaciente.apellido} onChange={handleChange} required />
              <input type="date" name="fecha_nacimiento" placeholder="Fecha de Nacimiento" value={nuevoPaciente.fecha_nacimiento} onChange={handleChange} required />
              <input type="text" name="genero" placeholder="Género" value={nuevoPaciente.genero} onChange={handleChange} required />
              <input type="text" name="telefono" placeholder="Teléfono" value={nuevoPaciente.telefono} onChange={handleChange} required />
              <input type="text" name="direccion" placeholder="Dirección" value={nuevoPaciente.direccion} onChange={handleChange} required />
              <textarea name="historial_medico" placeholder="Historial Médico" value={nuevoPaciente.historial_medico} onChange={handleChange} required></textarea>
              <input type="text" name="dni" placeholder="DNI" value={nuevoPaciente.dni} onChange={handleChange} required />
              <input type="text" name="user_id" placeholder="User ID" value={nuevoPaciente.user_id} onChange={handleChange} required /> {/* Añadir este campo */}
              <button type="submit">Agregar</button>
            </form>
          </div>
        </div>
      )}

      {editModalOpen && pacienteSeleccionado && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setEditModalOpen(false)}>&times;</span>
            <h2>Editar Paciente</h2>
            <form onSubmit={handleEditSubmit}>
              <input type="text" name="nombre" placeholder="Nombre" value={pacienteSeleccionado.nombre} onChange={handleEditChange} required />
              <input type="text" name="apellido" placeholder="Apellido" value={pacienteSeleccionado.apellido} onChange={handleEditChange} required />
              <input type="date" name="fecha_nacimiento" placeholder="Fecha de Nacimiento" value={pacienteSeleccionado.fecha_nacimiento} onChange={handleEditChange} required />
              <input type="text" name="genero" placeholder="Género" value={pacienteSeleccionado.genero} onChange={handleEditChange} required />
              <input type="text" name="telefono" placeholder="Teléfono" value={pacienteSeleccionado.telefono} onChange={handleEditChange} required />
              <input type="text" name="direccion" placeholder="Dirección" value={pacienteSeleccionado.direccion} onChange={handleEditChange} required />
              <textarea name="historial_medico" placeholder="Historial Médico" value={pacienteSeleccionado.historial_medico} onChange={handleEditChange} required></textarea>
              <input type="text" name="dni" placeholder="DNI" value={pacienteSeleccionado.dni} onChange={handleEditChange} required />
              <button type="submit">Guardar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pacientes;