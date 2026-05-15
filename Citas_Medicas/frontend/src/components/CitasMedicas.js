import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate'; // Importar el componente de paginación
import './CitasMedicas.css';

const CitasMedicas = () => {
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); // Modal para editar
  const [detailModalOpen, setDetailModalOpen] = useState(false); // Controlar el modal de detalles
  const [citaSeleccionada, setCitaSeleccionada] = useState(null); // Cita a editar o ver detalles

  const [nuevaCita, setNuevaCita] = useState({
    fecha_cita: '',
    hora_cita: '',
    patient_id: '',
    doctor_id: '',
    status: '',
    razon: ''
  });
  const [currentPage, setCurrentPage] = useState(0);
  const citasPerPage = 5;

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/citas');
        setCitas(response.data);
      } catch (error) {
        console.error('Error al obtener las citas:', error);
      }
    };

    const fetchPacientes = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/pacientes');
        setPacientes(response.data);
      } catch (error) {
        console.error('Error al obtener los pacientes:', error);
      }
    };

    const fetchDoctores = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/doctores');
        setDoctores(response.data);
      } catch (error) {
        console.error('Error al obtener los doctores:', error);
      }
    };

    fetchCitas();
    fetchPacientes();
    fetchDoctores();
  }, []);

  const pacienteMap = pacientes.reduce((map, paciente) => {
    map[paciente.id] = `${paciente.nombre} ${paciente.apellido}`; // Cambiar comillas simples por backticks para concatenación
    return map;
  }, {});
  
  const doctorMap = doctores.reduce((map, doctor) => {
    map[doctor.id] = `${doctor.first_name} ${doctor.last_name}`; // Usar backticks aquí también
    return map;
  }, {});

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredCitas = citas.filter(cita => {
    const pacienteNombre = pacienteMap[cita.patient_id]?.toLowerCase() || '';
    const doctorNombre = doctorMap[cita.doctor_id]?.toLowerCase() || '';
    return pacienteNombre.includes(searchTerm) || doctorNombre.includes(searchTerm);
  });

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const startIndex = currentPage * citasPerPage;
  const endIndex = startIndex + citasPerPage;
  const currentCitas = filteredCitas.slice(startIndex, endIndex);

  const handleChange = (e) => {
    setNuevaCita({ ...nuevaCita, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Datos de la nueva cita:', nuevaCita); // Verifica los datos a enviar
    try {
      const response = await axios.post('http://localhost:5001/api/citas', nuevaCita);
      console.log('Cita agregada:', response.data); // Verifica la respuesta
      setCitas([...citas, response.data]); // Usa response.data para actualizar la lista
      setModalOpen(false);
      setNuevaCita({
        fecha_cita: '',
        hora_cita: '',
        patient_id: '',
        doctor_id: '',
        status: '',
        razon: ''
      });
    } catch (error) {
      console.error('Error al agregar la cita:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta cita?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5001/api/citas/${id}`);
        setCitas(citas.filter(cita => cita.id !== id));
      } catch (error) {
        console.error('Error al eliminar la cita:', error);
      }
    }
  };

  const handleEditClick = (cita) => {
    setCitaSeleccionada(cita);
    setEditModalOpen(true);
  };

  const handleDetailClick = (cita) => {
    setCitaSeleccionada(cita); // Se establece la cita seleccionada
    setDetailModalOpen(true); // Abre el modal
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/api/citas/${citaSeleccionada.id}`, citaSeleccionada);
      setCitas(citas.map(cita => (cita.id === citaSeleccionada.id ? citaSeleccionada : cita)));
      setEditModalOpen(false);
      setCitaSeleccionada(null);
    } catch (error) {
      console.error('Error al editar la cita:', error);
    }
  };

  const handleEditChange = (e) => {
    setCitaSeleccionada({ ...citaSeleccionada, [e.target.name]: e.target.value });
  };

  return (
    <div className="citas-container">
      <h1>Citas Médicas</h1>
      <button className="agregar-cita" onClick={() => setModalOpen(true)}>Agregar cita</button>
      <div className="buscador">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <table className="citas-table">
        <thead>
          <tr>
            <th>N° Cita</th>
            <th>Fecha Cita</th>
            <th>Hora</th>
            <th>Paciente</th>
            <th>Doctor</th>
            <th>Estado</th>
            <th>Razón</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {currentCitas.map((cita) => (
            <tr key={cita.id}>
              <td>{cita.id}</td>
              <td>{cita.fecha_cita}</td>
              <td>{cita.hora_cita}</td>
              <td>{pacienteMap[cita.patient_id] || 'Desconocido'}</td>
              <td>{doctorMap[cita.doctor_id] || 'Desconocido'}</td>
              <td>{cita.status}</td>
              <td>{cita.razon || 'No especificado'}</td>
              <td>
              <div className="action-buttons">
                  <button className="editar-btn" onClick={() => handleEditClick(cita)}>Editar</button>
                  <button className="eliminar-btn" onClick={() => handleDelete(cita.id)}>Eliminar</button>
                  <button className="ver-detalles-btn" onClick={() => handleDetailClick(cita)}>Ver detalles</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={'Anterior'}
        nextLabel={'Siguiente'}
        breakLabel={'...'}
        pageCount={Math.ceil(filteredCitas.length / citasPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />

      {/* Modal para Agregar Cita */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
            <h2>Agregar Cita</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Fecha Cita:
                <input
                  type="date"
                  name="fecha_cita"
                  value={nuevaCita.fecha_cita}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Hora:
                <input
                  type="time"
                  name="hora_cita"
                  value={nuevaCita.hora_cita}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Paciente:
                <select
                  name="patient_id"
                  value={nuevaCita.patient_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un paciente</option>
                  {pacientes.map((paciente) => (
                    <option key={paciente.id} value={paciente.id}>
                      {paciente.nombre} {paciente.apellido}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Doctor:
                <select
                  name="doctor_id"
                  value={nuevaCita.doctor_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un doctor</option>
                  {doctores.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.first_name} {doctor.last_name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Estado:
                <input
                  type="text"
                  name="status"
                  value={nuevaCita.status}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Razón:
                <input
                  type="text"
                  name="razon"
                  value={nuevaCita.razon}
                  onChange={handleChange}
                  required
                />
              </label>
              <button type="submit">Agregar</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Editar Cita */}
      {editModalOpen && citaSeleccionada && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setEditModalOpen(false)}>&times;</span>
            <h2>Editar Cita</h2>
            <form onSubmit={handleEditSubmit}>
              <label>
                Fecha Cita:
                <input
                  type="date"
                  name="fecha_cita"
                  value={citaSeleccionada.fecha_cita}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Hora:
                <input
                  type="time"
                  name="hora_cita"
                  value={citaSeleccionada.hora_cita}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Paciente:
                <select
                  name="patient_id"
                  value={citaSeleccionada.patient_id}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Selecciona un paciente</option>
                  {pacientes.map((paciente) => (
                    <option key={paciente.id} value={paciente.id}>
                      {paciente.nombre} {paciente.apellido}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Doctor:
                <select
                  name="doctor_id"
                  value={citaSeleccionada.doctor_id}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Selecciona un doctor</option>
                  {doctores.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.first_name} {doctor.last_name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Estado:
                <input
                  type="text"
                  name="status"
                  value={citaSeleccionada.status}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Razón:
                <input
                  type="text"
                  name="razon"
                  value={citaSeleccionada.razon}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <button type="submit">Guardar cambios</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Ver Detalles de la Cita */}
      {detailModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setDetailModalOpen(false)}>&times;</span>
            <h2>Detalles de la Cita</h2>
            {citaSeleccionada && (
              <div>
                <p><strong>Fecha Cita:</strong> {citaSeleccionada.fecha_cita}</p>
                <p><strong>Hora:</strong> {citaSeleccionada.hora_cita}</p>
                <p><strong>Paciente:</strong> {pacienteMap[citaSeleccionada.patient_id]}</p>
                <p><strong>Doctor:</strong> {doctorMap[citaSeleccionada.doctor_id]}</p>
                <p><strong>Estado:</strong> {citaSeleccionada.status}</p>
                <p><strong>Razón:</strong> {citaSeleccionada.razon || 'No especificado'}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitasMedicas;