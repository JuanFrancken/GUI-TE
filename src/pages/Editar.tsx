import React, { useState } from "react";
import { useProducts, Product } from "../Prodcuts";
import { useNavigate } from 'react-router-dom';

const productoInicial: string = "";

const datosInicio = {
    nombre: '', descripcion: '', sku: '', categoria: '',
    precio: 0, precioCoste: 0, stockActual: 0, stockMinimo: 0, stockMaximo: 0,
};

function Editar() {
    const { products, editarProducto } = useProducts();
    const [datosForm, setDatosForm] = useState(datosInicio);
    const [filtro, setFiltro] = useState(productoInicial);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (filtro) {
            const prdTemp: Product | undefined = products.find(p => p.id === Number(filtro));
            if (prdTemp) {
                setDatosForm({
                    nombre: prdTemp.name,
                    descripcion: prdTemp.description,
                    sku: prdTemp.sku,
                    categoria: prdTemp.category?.name || "N/A",
                    precio: prdTemp.price,
                    precioCoste: prdTemp.cost_price,
                    stockActual: prdTemp.stock_quantity,
                    stockMinimo: prdTemp.min_stock_level,
                    stockMaximo: prdTemp.max_stock_level,
                });

            }
        } else {
            setDatosForm(datosInicio);
        }
    }, [filtro, products]);

    function subirEdicion(e: React.FormEvent) {
        e.preventDefault();
        const prdEdit: Product | undefined = products.find(p => p.id === Number(filtro)); 
        if (prdEdit) {
            
            prdEdit.name = datosForm.nombre
            prdEdit.description = datosForm.descripcion
            prdEdit.sku = datosForm.sku || "";
            if(prdEdit.category){
                prdEdit.category.name = datosForm.categoria || ""
            }
            prdEdit.category_id = 0
            prdEdit.price = datosForm.precio || 0
            prdEdit.cost_price = datosForm.precioCoste
            prdEdit.stock_quantity = datosForm.stockActual
            prdEdit.min_stock_level = datosForm.stockMinimo
            prdEdit.max_stock_level = datosForm.stockMaximo

            editarProducto(prdEdit);
            setDatosForm(datosInicio);
        }else{
            console.log("error");
        }
    }

    return (
        <div>
            <header>
                <h3 className="title fw-bold">Editar Producto:</h3>
            </header>

            <div>
                <h4>Productos:</h4>
                <select name="selectProducto" className= "form-select m-3" value={filtro} onChange={e => setFiltro(e.target.value)}>
                    <option value={""}>Ninguno</option>
                    {products.map(p => (
                        <option key={p.id} value={String(p.id)}>{p.name}</option>
                    ))}
                </select>
            </div>

            <div id="editProduct" className="card p-3">
                <form onSubmit={(e) => subirEdicion(e)}>

                    <label>Nombre</label>
                    <input className="form-control" type="text" name="nombre" value={datosForm.nombre} required onChange={(e) => setDatosForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}></input>

                    <label>Descripcion</label>
                    <input className="form-control" type="text" name="descripcion" value={datosForm.descripcion} onChange={(e) => setDatosForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}></input>

                    <label>SKU</label>
                    <input className="form-control" type="text" name="sku" value={datosForm.sku} required onChange={(e) => setDatosForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}></input>

                    <label>Categoria</label>
                    <input className="form-control" type="text" name="categoria" value={datosForm.categoria} onChange={(e) => setDatosForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}></input>

                    <label>Precio</label>
                    <input className="form-control" type="number" name="precio" value={datosForm.precio} required onChange={(e) => setDatosForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}></input>

                    <label>Precio coste</label>
                    <input className="form-control" type="number" name="precioCoste" value={datosForm.precioCoste} required onChange={(e) => setDatosForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}></input>

                    <label>Stock actual</label>
                    <input className="form-control" type="number" name="stockActual" value={datosForm.stockActual} required onChange={(e) => setDatosForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}></input>

                    <label>Stock minimo</label>
                    <input className="form-control" type="number" name="stockMinimo" value={datosForm.stockMinimo} onChange={(e) => setDatosForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}></input>

                    <label>Stock maximo</label>
                    <input className="form-control" type="number" name="stockMaximo" value={datosForm.stockMaximo} onChange={(e) => setDatosForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}></input>

                    <button className="btn btn-success m-4"type="submit">Guardar Cambios</button>
                    <button className="btn btn-warning m-4"type="button" onClick={() => navigate('/Home')}>Cancelar</button>
                </form>
            </div>
        </div>
    )
}

export default Editar;