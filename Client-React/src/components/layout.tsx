import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './navbar';

const Layout = () => {
  return (
    <>
      <NavBar />
      <div style={{ padding: '20px' }}>
        <Outlet /> {/* זהו המקום שבו התוכן של הקומפוננטות השונות יוצג */}
      </div>
    </>
  );
};

export default Layout;
