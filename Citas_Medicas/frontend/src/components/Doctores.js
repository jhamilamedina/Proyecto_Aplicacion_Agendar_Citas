import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './Doctores.css';

const Doctores = () => {
  const [doctores, setDoctores] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [doctorSeleccionado, setDoctorSeleccionado] = useState(null);
  const [nuevoDoctor, setNuevoDoctor] = useState({
    first_name: '',
    last_name: '',
    telefono: '',
    email: '',
    specialty_id: '',
    user_id: '',
  });
  const [currentPage, setCurrentPage] = useState(0);
  const doctoresPerPage = 5;

  useEffect(() => {
    const fetchDoctores = async () => {
      try {
        const [doctoresResponse, especialidadesResponse, usuariosResponse] = await Promise.all([
          axios.get('http://localhost:5001/api/doctores'),
          axios.get('http://localhost:5001/api/especialidades'), // Asegúrate de que esta ruta esté definida en tu backend
          axios.get('http://localhost:5001/api/usuarios') // Asegúrate de que esta ruta esté definida en tu backend
        ]);

        setDoctores(doctoresResponse.data);
        setEspecialidades(especialidadesResponse.data);
        setUsuarios(usuariosResponse.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchDoctores();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredDoctores = doctores.filter(doctor =>
    doctor.first_name && doctor.first_name.toLowerCase().includes(searchTerm)
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const startIndex = currentPage * doctoresPerPage;
  const endIndex = startIndex + doctoresPerPage;
  const currentDoctores = filteredDoctores.slice(startIndex, endIndex);

  const handleChange = (e) => {
    setNuevoDoctor({ ...nuevoDoctor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/doctores', nuevoDoctor);
      setDoctores([...doctores, response.data]);
      setModalOpen(false);
      setNuevoDoctor({
        first_name: '',
        last_name: '',
        telefono: '',
        email: '',
        specialty_id: '',
        user_id: '',
      });
    } catch (error) {
      console.error('Error al agregar el doctor:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este doctor?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5001/api/doctores/${id}`);
        setDoctores(doctores.filter(doctor => doctor.id !== id));
      } catch (error) {
        console.error('Error al eliminar el doctor:', error);
      }
    }
  };

  const handleEditClick = (doctor) => {
    setDoctorSeleccionado(doctor);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/api/doctores/${doctorSeleccionado.id}`, doctorSeleccionado);
      setDoctores(doctores.map(doctor =>
        (doctor.id === doctorSeleccionado.id ? doctorSeleccionado : doctor)
      ));
      setEditModalOpen(false);
      setDoctorSeleccionado(null);
    } catch (error) {
      console.error('Error al editar el doctor:', error);
    }
  };

  const handleEditChange = (e) => {
    setDoctorSeleccionado({ ...doctorSeleccionado, [e.target.name]: e.target.value });
  };

  // Funciones para obtener el nombre de la especialidad y el usuario basado en el ID
  const getSpecialtyName = (id) => {
    const specialty = especialidades.find(sp => sp.id === id);
    return specialty ? specialty.name : 'Desconocida';
  };

  const getUserName = (id) => {
    const user = usuarios.find(u => u.id === id);
    return user ? user.username : 'Desconocido';
  };

  return (
    <div className="doctores-container">
      <h1>Doctores</h1>
      <button className="agregar-doctor" onClick={() => setModalOpen(true)}>Agregar Doctor</button>
      <div className="buscador">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <table className="doctores-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Especialidad</th>
            <th>Usuario</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentDoctores.map((doctor) => (
            <tr key={doctor.id}>
              <td>{doctor.id}</td>
              <td>{doctor.first_name}</td>
              <td>{doctor.last_name}</td>
              <td>{doctor.telefono}</td>
              <td>{doctor.email}</td>
              <td>{getSpecialtyName(doctor.specialty_id)}</td>
              <td>{getUserName(doctor.user_id)}</td>
              <td>{new Date(doctor.fecha_creacion).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEditClick(doctor)}>Editar</button>
                <button onClick={() => handleDelete(doctor.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={'Anterior'}
        nextLabel={'Siguiente'}
        breakLabel={'...'}
        pageCount={Math.ceil(filteredDoctores.length / doctoresPerPage)}
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
            <h2>Agregar Doctor</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="first_name" placeholder="Nombre" value={nuevoDoctor.first_name} onChange={handleChange} required />
              <input type="text" name="last_name" placeholder="Apellido" value={nuevoDoctor.last_name} onChange={handleChange} required />
              <input type="text" name="telefono" placeholder="Teléfono" value={nuevoDoctor.telefono} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" value={nuevoDoctor.email} onChange={handleChange} required />
              <input type="text" name="specialty_id" placeholder="ID de Especialidad" value={nuevoDoctor.specialty_id} onChange={handleChange} required />
              <input type="text" name="user_id" placeholder="ID de Usuario" value={nuevoDoctor.user_id} onChange={handleChange} required />
              <button type="submit">Agregar</button>
            </form>
          </div>
        </div>
      )}

      {editModalOpen && doctorSeleccionado && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setEditModalOpen(false)}>&times;</span>
            <h2>Editar Doctor</h2>
            <form onSubmit={handleEditSubmit}>
              <input type="text" name="first_name" placeholder="Nombre" value={doctorSeleccionado.first_name} onChange={handleEditChange} required />
              <input type="text" name="last_name" placeholder="Apellido" value={doctorSeleccionado.last_name} onChange={handleEditChange} required />
              <input type="text" name="telefono" placeholder="Teléfono" value={doctorSeleccionado.telefono} onChange={handleEditChange} required />
              <input type="email" name="email" placeholder="Email" value={doctorSeleccionado.email} onChange={handleEditChange} required />
              <input type="text" name="specialty_id" placeholder="ID de Especialidad" value={doctorSeleccionado.specialty_id} onChange={handleEditChange} required />
              <input type="text" name="user_id" placeholder="ID de Usuario" value={doctorSeleccionado.user_id} onChange={handleEditChange} required />
              <button type="submit">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctores;
