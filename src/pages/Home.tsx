import { useProducts } from "../Prodcuts";

function Home() {
    const { products, eliminarProducto } = useProducts();

    return (
        <div>
            <header>
                <h3 className="title fw-bold">Lista de productos:</h3>
            </header>
            <div>
                <table id="listaProducto" className="table shadow">
                    <thead className="table-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>SKU</th>
                            <th>Categoria</th>
                            <th>Precio</th>
                            <th>Costo</th>
                            <th>Stock</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>{p.sku}</td>
                                <td>{p.category?.name || "N/A"}</td>
                                <td>{p.price}</td>
                                <td>{p.cost_price}</td>
                                <td>{p.stock_quantity}</td>
                                <td><button className="btn btn-danger"onClick={() => eliminarProducto(p.id)}>X</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

}

export default Home