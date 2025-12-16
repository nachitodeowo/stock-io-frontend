// src/Configuration.jsx
import React, { useState, useEffect } from 'react';
import api from './api';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

export default function Configuration() {
    const [empresaData, setEmpresaData] = useState({
        id: '',
        razon_social: '',
        rut_empresa: '',
        direccion: '',  // Asegúrate de tener este campo en tu modelo o quítalo
        telefono: ''    // Asegúrate de tener este campo en tu modelo o quítalo
    });
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState(null);

    // 1. Cargar los datos actuales de la empresa
    useEffect(() => {
        const fetchEmpresa = async () => {
            try {
                // Como tu backend ya filtra por usuario, esto traerá SOLO tu empresa
                const res = await api.get('empresas/');
                if (res.data.length > 0) {
                    // Tomamos la primera (y única) empresa que devuelve
                    setEmpresaData(res.data[0]);
                }
            } catch (error) {
                console.error("Error cargando empresa", error);
            }
        };
        fetchEmpresa();
    }, []);

    // 2. Manejar cambios en los inputs
    const handleChange = (e) => {
        setEmpresaData({ ...empresaData, [e.target.name]: e.target.value });
    };

    // 3. Guardar cambios (PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje(null);
        
        try {
            await api.patch(`empresas/${empresaData.id_empresa}/`, empresaData);
            setMensaje({ tipo: 'success', texto: '¡Datos actualizados correctamente!' });
            
            // Actualizamos el nombre en el navegador por si cambió
            localStorage.setItem('empresa_nombre', empresaData.razon_social);
            
        } catch (error) {
            console.error(error);
            setMensaje({ tipo: 'danger', texto: 'Error al guardar cambios.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="p-4">
            <h2 className="mb-4 text-dark">⚙️ Configuración de la Empresa</h2>
            
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white border-bottom">
                    <h5 className="mb-0 text-primary">Datos del Negocio</h5>
                </Card.Header>
                <Card.Body>
                    {mensaje && <Alert variant={mensaje.tipo}>{mensaje.texto}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre de la Empresa (Razón Social)</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="razon_social" 
                                value={empresaData.razon_social} 
                                onChange={handleChange} 
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>RUT Empresa</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="rut_empresa" 
                                value={empresaData.rut_empresa} 
                                onChange={handleChange} 
                            />
                        </Form.Group>

                        {/* Puedes agregar más campos si tu modelo los tiene */}
                        
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            
            {/* Sección visual extra para rellenar */}
            <Card className="mt-4 shadow-sm border-0">
                <Card.Body>
                    <h5 className="text-danger">Zona de Peligro</h5>
                    <p className="text-muted">Acciones sensibles para la cuenta.</p>
                    <Button variant="outline-danger" disabled>🗑️ Eliminar Cuenta de Empresa</Button>
                </Card.Body>
            </Card>

        </Container>
    );
}