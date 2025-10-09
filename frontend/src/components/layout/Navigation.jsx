import React from 'react';
import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav style={{
      display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ddd'
    }}>
      <Link to="/">Eventos</Link>
      <Link to="/create">Crear Evento</Link>
      <Link to="/register">Registrar Usuario</Link>
    </nav>
  );
}
