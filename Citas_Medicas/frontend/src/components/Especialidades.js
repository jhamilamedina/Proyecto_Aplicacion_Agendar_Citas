import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './Especialidades.css';

const Especialidades = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState(null);
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState({
    name: '',
    description: ''
  });
  const [currentPage, setCurrentPage] = useState(0);
  const especialidadesPerPage = 5;

  // Obtener las especialidades desde el backend
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/especialidades');
        setEspecialidades(response.data);
      } catch (error) {
        console.error('Error al obtener las especialidades:', error);
      }
    };

    fetchEspecialidades();
  }, []);

  // Filtrar especialidades basadas en el término de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredEspecialidades = especialidades.filter(especialidad => 
    especialidad.name && especialidad.name.toLowerCase().includes(searchTerm)
  );

  // Manejar la paginación
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const startIndex = currentPage * especialidadesPerPage;
  const endIndex = startIndex + especialidadesPerPage;
  const currentEspecialidades = filteredEspecialidades.slice(startIndex, endIndex);

  // Manejar los cambios de nueva especialidad
  const handleChange = (e) => {
    setNuevaEspecialidad({ ...nuevaEspecialidad, [e.target.name]: e.target.value });
  };

  // Enviar una nueva especialidad al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/especialidades', nuevaEspecialidad);
      setEspecialidades([...especialidades, response.data]);
      setModalOpen(false);
      setNuevaEspecialidad({
        name: '',
        description: ''
      });
    } catch (error) {
      console.error('Error al agregar la especialidad:', error);
    }
  };

  // Eliminar una especialidad
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta especialidad?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5001/api/especialidades/${id}`);
        setEspecialidades(especialidades.filter(especialidad => especialidad.id !== id));
      } catch (error) {
        console.error('Error al eliminar la especialidad:', error);
      }
    }
  };

  // Manejar clic en editar especialidad
  const handleEditClick = (especialidad) => {
    setEspecialidadSeleccionada(especialidad);
    setEditModalOpen(true);
  };

  // Manejar envío del formulario de edición
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/api/especialidades/${especialidadSeleccionada.id}`, especialidadSeleccionada);
      setEspecialidades(especialidades.map(especialidad => 
        (especialidad.id === especialidadSeleccionada.id ? especialidadSeleccionada : especialidad)
      ));
      setEditModalOpen(false);
      setEspecialidadSeleccionada(null);
    } catch (error) {
      console.error('Error al editar la especialidad:', error);
    }
  };

  // Manejar cambios en el formulario de edición
  const handleEditChange = (e) => {
    setEspecialidadSeleccionada({ ...especialidadSeleccionada, [e.target.name]: e.target.value });
  };

  return (
    <div className="especialidades-container">
      <h1>Especialidades Médicas</h1>
      <button className="agregar-especialidad" onClick={() => setModalOpen(true)}>Agregar Especialidad</button>
      <div className="buscador">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <table className="especialidades-table">
        <thead>
          <tr>
            <th>N°</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentEspecialidades.map((especialidad) => (
            <tr key={especialidad.id}>
              <td>{especialidad.id}</td>
              <td>{especialidad.name}</td>
              <td>{especialidad.description || 'No especificado'}</td>
              <td>{new Date(especialidad.fecha_creacion).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEditClick(especialidad)}>Editar</button>
                <button onClick={() => handleDelete(especialidad.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={'Anterior'}
        nextLabel={'Siguiente'}
        breakLabel={'...'}
        pageCount={Math.ceil(filteredEspecialidades.length / especialidadesPerPage)}
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
            <h2>Agregar Especialidad</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Nombre:
                <input
                  type="text"
                  name="name"
                  value={nuevaEspecialidad.name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Descripción:
                <textarea
                  name="description"
                  value={nuevaEspecialidad.description}
                  onChange={handleChange}
                />
              </label>
              <button type="submit">Agregar</button>
            </form>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setEditModalOpen(false)}>&times;</span>
            <h2>Editar Especialidad</h2>
            <form onSubmit={handleEditSubmit}>
              <label>
                Nombre:
                <input
                  type="text"
                  name="name"
                  value={especialidadSeleccionada.name}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Descripción:
                <textarea
                  name="description"
                  value={especialidadSeleccionada.description}
                  onChange={handleEditChange}
                />
              </label>
              <button type="submit">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Especialidades;
