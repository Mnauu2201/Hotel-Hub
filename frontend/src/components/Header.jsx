import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
    <header style={{
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }}>
        <Link Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
        🏨 HotelHub
        </Link>
        <nav nav style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Trang chủ</Link>
        <Link to="/rooms" style={{ color: 'white', textDecoration: 'none' }}>Phòng</Link>
        <Link to="/booking" style={{ color: 'white', textDecoration: 'none' }}>Đặt phòng</Link>
        </nav>
    </header>
    );
};

export default Header;