import React, { useState } from "react";
import { useProducts } from "../Prodcuts";
import { useNavigate } from 'react-router-dom';

const datosInicio = {
    nombre: '', descripcion: '', sku: '', categoria: '',
    precio: 0, precioCoste: 0, stockActual: 0, stockMinimo: 0, stockMaximo: 0,
};

function Create() {
    const { crearProducto } = useProducts();
    const [datosForm, setDatosForm] = useState(datosInicio);
    const navigate = useNavigate();

    function subirProducto(e: React.FormEvent) {

        e.preventDefault();

        const precioNum = Number(datosForm.precio) || 0;
        const precioCosteNum = Number(datosForm.precioCoste) || 0;
        const stockActualNum = Number(datosForm.stockActual) || 0;
        const stockMinimoNum = Number(datosForm.stockMinimo) || 0;
        const stockMaximoNum = Number(datosForm.stockMaximo) || 0;
        
        crearProducto(
            datosForm.nombre,
            datosForm.descripcion,
            datosForm.sku,
            datosForm.categoria,
            precioNum,
            precioCosteNum,
            stockActualNum,
            stockMinimoNum,
            stockMaximoNum
        );

        setDatosForm(datosInicio);
        navigate('/Home');
    }

    return (
        <div>
            <header>
                <h3 className="title fw-bold">Crear producto:</h3>
            </header>
            <div id="createProduct" className="card p-3">
                <form onSubmit={subirProducto} className="form">
                    <label className="form-label">Nombre</label>
                    <input className="form-control" type="text" name="nombre" required onChange={(e) => setDatosForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}></input>

                    <label>Descripcion</label>
                    <input className="form-control" type="text" name="descripcion" onChange={(e) => setDatosForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}></input>

                    <label>SKU</label>
                    <input className="form-control" type="text" name="sku" required onChange={(e) => setDatosForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}></input>

                    <label>Categoria</label>
                    <input className="form-control" type="text" name="categoria" onChange={(e) => setDatosForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}></input>

                    <label>Precio</label>
                    <input className="form-control" type="number" name="precio" required onChange={(e) => setDatosForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}></input>

                    <label>Precio coste</label>
                    <input className="form-control" type="number" name="precioCoste" required onChange={(e) => setDatosForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}></input>

                    <label>Stock actual</label>
                    <input className="form-control" type="number" name="stockActual" required onChange={(e) => setDatosForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}></input>

                    <label>Stock minimo</label>
                    <input className="form-control" type="number" name="stockMinimo" onChange={(e) => setDatosForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}></input>

                    <label>Stock maximo</label>
                    <input className="form-control" type="number" name="stockMaximo" onChange={(e) => setDatosForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}></input>

                    <button className="btn btn-success m-4" type="submit">Crear Producto</button>
                    <button className="btn btn-warning m-4" type="button" onClick={() => navigate('/Home')}>Cancelar</button>
                </form> 
            </div>
        </div>
    )
}

export default Create;