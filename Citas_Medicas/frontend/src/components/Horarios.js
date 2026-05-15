import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './Horarios.css';

const Horarios = () => {
  const [horarios, setHorarios] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [nuevoHorario, setNuevoHorario] = useState({
    doctor_name: '',
    dia_de_semana: '',
    horario_inicio: '',
    horario_final: '',
  });
  const [currentPage, setCurrentPage] = useState(0);
  const horariosPerPage = 5;

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/disponibilidad');
        setHorarios(response.data);
      } catch (error) {
        console.error('Error al obtener los horarios:', error);
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

    fetchHorarios();
    fetchDoctores();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredHorarios = horarios.filter(horario => {
    const doctor = doctores.find(doc => doc.id === horario.doctor_id);
    const doctorName = doctor ? `${doctor.first_name} ${doctor.last_name}`.toLowerCase() : '';
    const diaDeSemana = horario.dia_de_semana.toLowerCase();
  
    // Se busca tanto por el día de la semana como por el nombre del doctor
    return diaDeSemana.includes(searchTerm) || doctorName.includes(searchTerm);
  });

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const startIndex = currentPage * horariosPerPage;
  const endIndex = startIndex + horariosPerPage;
  const currentHorarios = filteredHorarios.slice(startIndex, endIndex);

  const handleChange = (e) => {
    setNuevoHorario({ ...nuevoHorario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const doctor = doctores.find(doc => `${doc.first_name} ${doc.last_name}` === nuevoHorario.doctor_name);
        if (doctor) {
            const horario = {
                doctor_id: doctor.id,
                dia_de_semana: nuevoHorario.dia_de_semana,
                horario_inicio: nuevoHorario.horario_inicio,
                horario_final: nuevoHorario.horario_final,
                fecha_creacion: new Date().toISOString()
            };
            const response = await axios.post('http://localhost:5001/api/disponibilidad', horario);
            if (response.status === 201) {
                setHorarios([...horarios, response.data]);
                setModalOpen(false);
                setNuevoHorario({
                    doctor_name: '',
                    dia_de_semana: '',
                    horario_inicio: '',
                    horario_final: '',
                });
            } else {
                alert('Error al agregar el horario.');
            }
        } else {
            alert('Doctor no encontrado.');
        }
    } catch (error) {
        console.error('Error al agregar el horario:', error);
        alert('Error al agregar el horario. Por favor, revisa la consola para más detalles.');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este horario?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5001/api/disponibilidad/${id}`);
        setHorarios(horarios.filter(horario => horario.id !== id));
      } catch (error) {
        console.error('Error al eliminar el horario:', error);
      }
    }
  };

  const handleEditClick = (horario) => {
    setHorarioSeleccionado(horario);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const doctor = doctores.find(doc => `${doc.first_name} ${doc.last_name}` === horarioSeleccionado.doctor_name);
      if (doctor) {
        await axios.put(`http://localhost:5001/api/disponibilidad/${horarioSeleccionado.id}`, {
          ...horarioSeleccionado,
          doctor_id: doctor.id
        });
        setHorarios(horarios.map(horario =>
          (horario.id === horarioSeleccionado.id ? horarioSeleccionado : horario)
        ));
        setEditModalOpen(false);
        setHorarioSeleccionado(null);
      } else {
        alert('Doctor no encontrado.');
      }
    } catch (error) {
      console.error('Error al editar el horario:', error);
    }
  };

  const handleEditChange = (e) => {
    setHorarioSeleccionado({ ...horarioSeleccionado, [e.target.name]: e.target.value });
  };

  return (
    <div className="horarios-container">
      <h1>Nuestros Horarios</h1>
      <button className="agregar-horario" onClick={() => setModalOpen(true)}>Agregar Horario</button>
      <div className="buscador">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <table className="horarios-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Doctor</th>
            <th>Día de Semana</th>
            <th>Horario Inicio</th>
            <th>Horario Final</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentHorarios.map((horario) => (
            <tr key={horario.id}>
              <td>{horario.id}</td>
              <td>{doctores.find(doc => doc.id === horario.doctor_id) ? `${doctores.find(doc => doc.id === horario.doctor_id).first_name} ${doctores.find(doc => doc.id === horario.doctor_id).last_name}` : 'Desconocido'}</td>
              <td>{horario.dia_de_semana}</td>
              <td>{horario.horario_inicio}</td>
              <td>{horario.horario_final}</td>
              <td>{new Date(horario.fecha_creacion).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEditClick(horario)}>Editar</button>
                <button onClick={() => handleDelete(horario.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={'Anterior'}
        nextLabel={'Siguiente'}
        breakLabel={'...'}
        pageCount={Math.ceil(filteredHorarios.length / horariosPerPage)}
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
            <h2>Agregar Horario</h2>
            <form onSubmit={handleSubmit}>
              <select name="doctor_name" value={nuevoHorario.doctor_name} onChange={handleChange} required>
                <option value="">Seleccionar Doctor</option>
                {doctores.map((doctor) => (
                  <option key={doctor.id} value={`${doctor.first_name} ${doctor.last_name}`}>{`${doctor.first_name} ${doctor.last_name}`}</option>
                ))}
              </select>
              <input type="text" name="dia_de_semana" placeholder="Día de Semana" value={nuevoHorario.dia_de_semana} onChange={handleChange} required />
              <input type="time" name="horario_inicio" placeholder="Horario Inicio" value={nuevoHorario.horario_inicio} onChange={handleChange} required />
              <input type="time" name="horario_final" placeholder="Horario Final" value={nuevoHorario.horario_final} onChange={handleChange} required />
              <button type="submit">Agregar</button>
            </form>
          </div>
        </div>
      )}

      {editModalOpen && horarioSeleccionado && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setEditModalOpen(false)}>&times;</span>
            <h2>Editar Horario</h2>
            <form onSubmit={handleEditSubmit}>
              <select name="doctor_name" value={horarioSeleccionado.doctor_name} onChange={handleEditChange} required>
                <option value="">Seleccionar Doctor</option>
                {doctores.map((doctor) => (
                  <option key={doctor.id} value={`${doctor.first_name} ${doctor.last_name}`}>{`${doctor.first_name} ${doctor.last_name}`}</option>
                ))}
              </select>
              <input type="text" name="dia_de_semana" placeholder="Día de Semana" value={horarioSeleccionado.dia_de_semana} onChange={handleEditChange} required />
              <input type="time" name="horario_inicio" placeholder="Horario Inicio" value={horarioSeleccionado.horario_inicio} onChange={handleEditChange} required />
              <input type="time" name="horario_final" placeholder="Horario Final" value={horarioSeleccionado.horario_final} onChange={handleEditChange} required />
              <button type="submit">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Horarios;
