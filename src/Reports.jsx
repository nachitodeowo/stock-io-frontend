// src/Reports.jsx
import React, { useState } from 'react';
import api from './api';
import { Table, Button, Container, Row, Col, Form } from 'react-bootstrap'; 

export default function Reports() {
    const [ventas, setVentas] = useState([]);
    const [filtros, setFiltros] = useState({ 
        fecha_inicio: '', 
        fecha_fin: '' 
    });
    const [loading, setLoading] = useState(false);
    const [buscado, setBuscado] = useState(false);

    const fetchReporteVentas = async () => {
        setLoading(true);
        try {
            // 👇 CAMBIO CLAVE: Usamos el endpoint de "reporte_ventas_producto"
            // Asegúrate de que en urls.py tengas r'movimientos'
            const url = `movimientos/reporte_ventas_producto/?fecha_inicio=${filtros.fecha_inicio}&fecha_fin=${filtros.fecha_fin}`;
            
            const res = await api.get(url);
            setVentas(res.data);
            setBuscado(true);
            
        } catch (error) {
            console.error("Error al cargar el reporte:", error);
            alert("Error al cargar los datos. Revisa si seleccionaste las fechas.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleChange = (e) => {
        setFiltros({ ...filtros, [e.target.name]: e.target.value });
    };

    return (
        <Container fluid>
            <h2 className="my-4">🏆 Productos Más Vendidos</h2>
            <p>Descubre qué productos tienen mayor salida en un periodo de tiempo.</p>

            {/* FORMULARIO DE FILTROS */}
            <Form onSubmit={(e) => { e.preventDefault(); fetchReporteVentas(); }} className="p-3 mb-4 border rounded bg-light">
                <Row className="align-items-center">
                    <Col md={5}>
                        <Form.Group>
                            <Form.Label>Desde:</Form.Label>
                            <Form.Control type="date" name="fecha_inicio" value={filtros.fecha_inicio} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                    <Col md={5}>
                        <Form.Group>
                            <Form.Label>Hasta:</Form.Label>
                            <Form.Control type="date" name="fecha_fin" value={filtros.fecha_fin} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                    <Col md={2} className="mt-md-4">
                        <Button type="submit" variant="success" disabled={loading} style={{ width: '100%' }}>
                            {loading ? 'Buscando...' : 'Buscar'}
                        </Button>
                    </Col>
                </Row>
            </Form>
            
            {/* TABLA DE RESULTADOS POR PRODUCTO */}
            {buscado && (
                <div className="card shadow">
                    <div className="card-body">
                        {ventas.length > 0 ? (
                            <Table striped bordered hover responsive>
                                <thead className="bg-dark text-white">
                                    <tr>
                                        <th>Producto</th>
                                        <th>Código (SKU)</th>
                                        <th>Total Vendido (Unidades)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ventas.map((item, index) => (
                                        <tr key={index}>
                                            <td style={{fontWeight: 'bold'}}>{item.nombre_producto}</td>
                                            <td>{item.codigo}</td>
                                            <td>
                                                <span className="badge bg-success" style={{fontSize: '1em'}}>
                                                    {item.total_vendido}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <div className="alert alert-warning text-center">
                                No se encontraron ventas en este rango de fechas.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Container>
    );
}