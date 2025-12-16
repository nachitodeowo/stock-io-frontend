// src/Configuration.jsx
import React, { useState, useEffect } from 'react';
import api from './api';
import { Container, Card, Row, Col, Badge, Spinner, ListGroup } from 'react-bootstrap';

export default function Configuration() {
    const [empresa, setEmpresa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDatosEmpresa = async () => {
            try {
                // 1. Pedimos la lista de empresas (Django filtrará la tuya)
                const res = await api.get('empresas/');
                
                if (res.data.length > 0) {
                    // Tomamos la primera que llegue (que será la tuya)
                    setEmpresa(res.data[0]);
                } else {
                    setError("No se encontraron datos de la empresa.");
                }
            } catch (err) {
                console.error("Error cargando empresa:", err);
                setError("Error al cargar los datos desde el servidor.");
            } finally {
                setLoading(false);
            }
        };

        fetchDatosEmpresa();
    }, []);

    if (loading) {
        return (
            <Container className="p-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Cargando información de la empresa...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="p-4">
            <h2 className="mb-4 text-dark">🏢 Información Corporativa</h2>
            
            {error ? (
                <div className="alert alert-warning">{error}</div>
            ) : (
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="shadow border-0">
                            <Card.Header className="bg-primary text-white py-3">
                                <h4 className="mb-0">Ficha de la Empresa</h4>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <div className="text-center mb-4">
                                    <div style={{ 
                                        width: '80px', height: '80px', background: '#f0f2f5', color: '#333',
                                        borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '30px', border: '2px solid #ddd'
                                    }}>
                                        🏢
                                    </div>
                                    <h2 className="mt-3">{empresa.razon_social}</h2>
                                    <Badge bg="success">Cuenta Activa</Badge>
                                </div>

                                <ListGroup variant="flush">
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                                        <strong>🆔 RUT / NIT:</strong>
                                        <span className="text-muted">{empresa.rut_empresa || 'No registrado'}</span>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                                        <strong>📍 Dirección Comercial:</strong>
                                        <span className="text-muted">{empresa.direccion || 'Sin dirección registrada'}</span>
                                    </ListGroup.Item>

                                    <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                                        <strong>📞 Teléfono de Contacto:</strong>
                                        <span className="text-muted">{empresa.telefono || 'No registrado'}</span>
                                    </ListGroup.Item>

                                    <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                                        <strong>📧 Correo Electrónico:</strong>
                                        <span className="text-muted">{empresa.correo || 'contacto@empresa.com'}</span>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                                        <strong>📅 Fecha de Registro:</strong>
                                        {/* Si tienes fecha de creación, úsala, si no, fecha de hoy simulada */}
                                        <span className="text-muted">{new Date().toLocaleDateString()}</span>
                                    </ListGroup.Item>
                                </ListGroup>

                                <div className="mt-4 text-center">
                                    <small className="text-muted">
                                        * Estos datos son administrados por el soporte de Stock.IO. 
                                        Para cambios, contacte a su administrador.
                                    </small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
}