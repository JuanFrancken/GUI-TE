import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Create from './pages/Create';
import Home from './pages/Home';
import Editar from './pages/Editar';
import { ProductProvider, useProducts } from './Prodcuts';
import { ApiProvider, manejoApi } from './ManejoApi';


function RootContent() {
    const location = useLocation();
    const isLoginPage = location.pathname === '/'; 

    return (
        <>
            {!isLoginPage && (
            <header className='bg-secondary rounded shadow p-2 mb-4'>
                <nav className='navbar justify-content-center '>
                    <h3 className='title text-white mx-5 font-strong'>App Productos</h3>
                    <Link className="nav-link bg-primary rounded shadow text-white p-2" to="/Home">Inicio</Link>
                    <Link className="nav-link bg-primary rounded shadow text-white p-2 mx-3" to="/Create">Crear Producto</Link>
                    <Link className="nav-link bg-primary rounded shadow text-white p-2" to="/Edit">Editar Producto</Link>
                </nav>
            </header>
                
            )}

            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Create" element={<Create />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/Edit" element={<Editar />} />
            </Routes>
        </>
    );
}

function InitialLoader() {
    const { traerDeApi, products } = useProducts();
    const { token } = manejoApi(); 
    const [_isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {

            if (!token || products.length > 0) {
                setIsLoading(false); 
                return
            }

            try {
                await traerDeApi();
            } catch (error) {
                console.error("Error al cargar productos iniciales:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();

    }, [traerDeApi, products.length, token]);

    return (
        <BrowserRouter basename="/GUI-TE">
            <RootContent /> 
        </BrowserRouter>
    );
}

function App() {
    return (
        <ApiProvider>
            <ProductProvider>
                <InitialLoader />
            </ProductProvider>
        </ApiProvider>
    );
}

export default App;