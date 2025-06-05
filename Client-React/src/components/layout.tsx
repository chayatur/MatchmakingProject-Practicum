
import { Outlet } from 'react-router-dom';
import NavBar from './navbar';
import Footer from './footer';
const Layout = () => {
  return (
    <>
      <NavBar />
      <div style={{ padding: '20px' }}>
        <Outlet /> {/* זהו המקום שבו התוכן של הקומפוננטות השונות יוצג */}
      </div>
<     Footer/>
    </>
  );
};

export default Layout;
