import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './Usuarios.css'; 

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
 // const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); // Modal para editar
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null); // Usuario a editar
  const [nuevoUsuario, setNuevoUsuario] = useState({
    username: '',
    password: '',
    email: '',
    role: '',
    fecha_creacion: ''
  });
  const [currentPage, setCurrentPage] = useState(0);
  const usuariosPerPage = 5;

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/usuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredUsuarios = usuarios.filter(usuario => 
    usuario.username.toLowerCase().includes(searchTerm) || 
    usuario.email.toLowerCase().includes(searchTerm)
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const startIndex = currentPage * usuariosPerPage;
  const endIndex = startIndex + usuariosPerPage;
  const currentUsuarios = filteredUsuarios.slice(startIndex, endIndex);

  //const handleChange = (e) => {
    //setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  //};

  //const handleSubmit = async (e) => {
    //e.preventDefault();
    //try {
      //await axios.post('http://localhost:5001/api/usuarios', nuevoUsuario);
      //setUsuarios([...usuarios, nuevoUsuario]);
      //setModalOpen(false);
      //setNuevoUsuario({
        //username: '',
        //password: '',
        //email: '',
        //role: '',
        //fecha_creacion: ''
      //});
    //} catch (error) {
     // console.error('Error al agregar el usuario:', error);
    //}
  //};

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5001/api/usuarios/${id}`);
        setUsuarios(usuarios.filter(usuario => usuario.id !== id));
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
      }
    }
  };

  const handleEditClick = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/api/usuarios/${usuarioSeleccionado.id}`, usuarioSeleccionado);
      setUsuarios(usuarios.map(usuario => (usuario.id === usuarioSeleccionado.id ? usuarioSeleccionado : usuario)));
      setEditModalOpen(false);
      setUsuarioSeleccionado(null);
    } catch (error) {
      console.error('Error al editar el usuario:', error);
    }
  };

  const handleEditChange = (e) => {
    setUsuarioSeleccionado({ ...usuarioSeleccionado, [e.target.name]: e.target.value });
  };

  return (
    <div className="usuarios-container">
      <h1>Usuarios</h1>
      
      <div className="buscador">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Fecha de Creación</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {currentUsuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.username}</td>
              <td>{usuario.email}</td>
              <td>{usuario.role}</td>
              <td>{usuario.fecha_creacion}</td>
              <td>
                <div className="action-buttons">
                  <button className="editar-btn" onClick={() => handleEditClick(usuario)}>Editar</button>
                  <button className="eliminar-btn" onClick={() => handleDelete(usuario.id)}>Eliminar</button>
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
        pageCount={Math.ceil(filteredUsuarios.length / usuariosPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />

      
      {/* Modal para Editar Usuario */}
      {editModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setEditModalOpen(false)}>&times;</span>
            <h2>Editar Usuario</h2>
            <form onSubmit={handleEditSubmit}>
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  value={usuarioSeleccionado.username}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={usuarioSeleccionado.password}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={usuarioSeleccionado.email}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Role:
                <input
                  type="text"
                  name="role"
                  value={usuarioSeleccionado.role}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Fecha de Creación:
                <input
                  type="date"
                  name="fecha_creacion"
                  value={usuarioSeleccionado.fecha_creacion}
                  onChange={handleEditChange}
                  required
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

export default Usuarios;
