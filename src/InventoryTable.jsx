import React, { useEffect, useState } from 'react';
import api from './api';
import { Link } from 'react-router-dom';

export default function InventoryTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 

  // --- ESTADOS PARA LA EDICIÓN ---
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    codigop: '',
    nombre: '',
    precio_venta: '',
    precio_compra: '',
    stock_minimo: '',
    fecha_vencimiento: ''
  });

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const empresaId = localStorage.getItem('empresa_id') || '1';
      const res = await api.get(`products/?empresa=${empresaId}`);
      const data = Array.isArray(res.data) ? res.data : (res.data.results || res.data);
      setProducts(data || []);
    } catch (err) {
      console.error(err);
      alert('Error al cargar productos.');
    } finally {
      setLoading(false);
    }
  }

  // --- ELIMINAR ---
  async function handleDelete(id) {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await api.delete(`products/${id}/`);
      setProducts(p => p.filter(x => x.codigop !== id));
    } catch (err) { alert('No se pudo eliminar'); }
  }

  // --- EDITAR ---
  const handleEditClick = (product) => {
    setEditData({
      codigop: product.codigop,
      nombre: product.nombre,
      precio_venta: product.precio_venta,
      precio_compra: product.precio_compra,
      stock_minimo: product.stock_minimo,
      fecha_vencimiento: product.fecha_vencimiento || ''
    });
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    try {
      await api.patch(`products/${editData.codigop}/`, {
        nombre: editData.nombre,
        precio_venta: editData.precio_venta,
        precio_compra: editData.precio_compra,
        stock_minimo: editData.stock_minimo,
        fecha_vencimiento: editData.fecha_vencimiento || null
      });
      
      alert("¡Producto actualizado!");
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar.");
    }
  };

  const filteredProducts = products.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.codigop.toString().includes(searchTerm)
  );

  const getStatusBadge = (product) => {
    if (product.fecha_vencimiento) {
        const hoy = new Date();
        const vencimiento = new Date(product.fecha_vencimiento);
        const diferenciaDias = (vencimiento - hoy) / (1000 * 3600 * 24);
        if (diferenciaDias < 0) return <span className="status-expired">VENCIDO</span>;
        if (diferenciaDias <= 7) return <span className="status-warning">POR VENCER</span>;
    }
    if (product.stock_actual <= 0) return <span className="status-out">SIN STOCK</span>;
    if (product.stock_actual <= (product.stock_minimo || 5)) return <span className="status-low">BAJO</span>;
    return <span className="status-ok">OK</span>;
  };

  const formatDate = (dateString) => {
      if (!dateString) return "-";
      const date = new Date(dateString);
      if(isNaN(date)) return dateString; 
      return date.toLocaleDateString(); 
  }

  return (
    <div className="table-container"> 
      
      {/* BARRA SUPERIOR */}
      <div className="toolbar">
        <div style={{display:'flex', gap: 10, alignItems:'center'}}>
          <h3 style={{margin:0, color:'#444'}}>Inventario Actual</h3>
          <input 
            type="text" placeholder="Buscar..." className="search-box"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{display:'flex', gap: 10}}>
           <button className="btn-secondary" style={{background:'#eee', color:'#333', border:'1px solid #ccc'}}>Exportar</button>
           <Link to="/categorias/nueva">
             <button className="btn-secondary" style={{background:'#34495e', color:'white', border:'none', padding:'8px 15px', borderRadius:'4px', cursor:'pointer', fontWeight:'bold'}}>+ Nueva Categoría</button>
           </Link>
           <Link to="/productos/nuevo">
             <button className="btn-primary" style={{background:'#0b5cff', color:'white', border:'none', padding:'8px 15px', borderRadius:'4px', cursor:'pointer', fontWeight:'bold'}}>+ Nuevo Producto</button>
           </Link>
        </div>
      </div>

      {/* TABLA */}
      {loading ? (
        <div style={{padding: 20, textAlign:'center'}}>Cargando inventario...</div>
      ) : (
        <div style={{overflowX: 'auto'}}>
          <table className="professional-table">
            <thead>
              <tr>
                <th style={{width: '50px'}}>SKU</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Vencimiento</th>
                <th>Stock</th>
                <th>Precio Venta</th>
                <th>Estado</th>
                <th style={{textAlign:'center'}}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 && (
                <tr><td colSpan="8" style={{textAlign:'center', padding: 20}}>Sin resultados.</td></tr>
              )}
              
              {filteredProducts.map(p => (
                <tr key={p.codigop}>
                  <td><strong>{p.codigop}</strong></td>
                  <td>{p.nombre}</td>
                  <td style={{color: '#666'}}>{p.tipo || '-'}</td>
                  <td style={{fontSize: '13px'}}>{formatDate(p.fecha_vencimiento)}</td>
                  <td style={{fontWeight:'bold'}}>{p.stock_actual}</td>
                  <td>${Number(p.precio_venta).toLocaleString()}</td>
                  <td>{getStatusBadge(p)}</td>
                  <td style={{textAlign:'center'}}>
                    <button className="action-btn" title="Editar" onClick={() => handleEditClick(p)}>✏️</button>
                    <button className="action-btn" onClick={() => handleDelete(p.codigop)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================= */}
      {/* 👇 VENTANA EMERGENTE PERSONALIZADA (ESTILO MODERNO) 👇 */}
      {/* ======================================================= */}
      
      {showModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            
            {/* Encabezado Azul */}
            <div style={modalStyles.header}>
              <h3 style={{margin:0}}>Editar Producto</h3>
              <button onClick={() => setShowModal(false)} style={modalStyles.closeBtn}>&times;</button>
            </div>

            {/* Cuerpo del Formulario */}
            <div style={modalStyles.body}>
              
              <div style={modalStyles.formGroup}>
                <label style={modalStyles.label}>Nombre del Producto</label>
                <input 
                  type="text" name="nombre" 
                  value={editData.nombre} onChange={handleModalChange} 
                  style={modalStyles.input}
                />
              </div>

              <div style={{display:'flex', gap:'15px'}}>
                <div style={{flex:1}}>
                  <label style={modalStyles.label}>Precio Venta</label>
                  <input 
                    type="number" name="precio_venta" 
                    value={editData.precio_venta} onChange={handleModalChange} 
                    style={modalStyles.input}
                  />
                </div>
                <div style={{flex:1}}>
                  <label style={modalStyles.label}>Precio Compra</label>
                  <input 
                    type="number" name="precio_compra" 
                    value={editData.precio_compra} onChange={handleModalChange} 
                    style={modalStyles.input}
                  />
                </div>
              </div>

              <div style={{display:'flex', gap:'15px', marginTop:'15px'}}>
                <div style={{flex:1}}>
                  <label style={modalStyles.label}>Stock Mínimo</label>
                  <input 
                    type="number" name="stock_minimo" 
                    value={editData.stock_minimo} onChange={handleModalChange} 
                    style={modalStyles.input}
                  />
                </div>
                <div style={{flex:1}}>
                  <label style={modalStyles.label}>Vencimiento</label>
                  <input 
                    type="date" name="fecha_vencimiento" 
                    value={editData.fecha_vencimiento} onChange={handleModalChange} 
                    style={modalStyles.input}
                  />
                </div>
              </div>

              <div style={{marginTop:'20px', padding:'10px', background:'#eef6fc', color:'#1d4e89', borderRadius:'5px', fontSize:'0.9em'}}>
                ℹ️ <strong>Nota:</strong> El stock actual no se edita aquí. Usa "Movimientos" para ajustarlo.
              </div>

            </div>

            {/* Pie de página (Botones) */}
            <div style={modalStyles.footer}>
              <button onClick={() => setShowModal(false)} style={modalStyles.cancelBtn}>Cancelar</button>
              <button onClick={handleSaveChanges} style={modalStyles.saveBtn}>Guardar Cambios</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// ================= ESTILOS CSS EN JAVASCRIPT =================
const modalStyles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscuro semitransparente
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(3px)' // Efecto borroso de fondo (opcional)
  },
  modal: {
    background: 'white',
    width: '500px',
    maxWidth: '90%',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    overflow: 'hidden',
    animation: 'fadeIn 0.3s ease-out'
  },
  header: {
    background: '#0b5cff', // Azul corporativo
    color: 'white',
    padding: '15px 20px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    borderBottom: '1px solid #eee'
  },
  closeBtn: {
    background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', fontWeight:'bold'
  },
  body: {
    padding: '20px'
  },
  footer: {
    padding: '15px 20px',
    background: '#f9f9f9',
    display: 'flex', justifyContent: 'flex-end', gap: '10px',
    borderTop: '1px solid #eee'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block', marginBottom: '5px', fontWeight: '600', color: '#555', fontSize: '0.9em'
  },
  input: {
    width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1em', outline:'none'
  },
  saveBtn: {
    background: '#0b5cff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
  },
  cancelBtn: {
    background: '#eee', color: '#333', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'
  }
};