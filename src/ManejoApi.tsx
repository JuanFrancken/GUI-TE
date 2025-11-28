import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from "./Prodcuts";


const URL = "https://minierp.rbnetto.dev";

export interface User {
    email: string,
    password: string
}


interface ManejoApiFunctions {
    importProductsApi: () => Promise<Product[]>;
    createProductsApi: (producto: Product) => Promise<Product>;
    autenticar: (user: User) => Promise<string>;
    editProductsApi: (editar: Product, id: number) => void
    eliminarDeApi: (id: number) => void
    token: string;
}

const ApiContext = createContext<ManejoApiFunctions | undefined>(undefined);


export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [token, setToken] = useState<string>(
        localStorage.getItem('tokenAut') || ""
    );

    async function autenticar(user: User): Promise<string> {
        try {
            const response = await fetch(URL + "/api/users/users/login/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.message || `Error ${response.status} al autenticar.`);
            }

            const data = await response.json();
            const newToken = data.access_token || data.token;

            if (newToken) {
                setToken(newToken);
                localStorage.setItem('tokenAut', newToken);
                return newToken;
            }

            throw new Error("No se pudo autenticar");

        } catch (error: any) {
            console.error("API Auth Error:", error.message);
            throw error;
        }
    }

    async function importProductsApi(): Promise<Product[]> {
        if (!token) throw new Error("Autenticación requerida: Token no disponible.");

        try {
            const response = await fetch(URL + "/api/inventory/products/", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: No se pudieron cargar los datos.`);
            }

            const data = await response.json();
            console.log("Respuesta Exitosa de Productos:", response);
            console.log("Respuesta Exitosa de Productos:", data);
            const dataArray: any[] = data.results || data; 
            const mappedProducts: Product[] = dataArray.map((item: any) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                sku: item.sku,
                category: item.category,
                category_id: item.category_id,
                price: item.price,
                cost_price: item.cost_price,
                stock_quantity: item.stock_quantity,
                min_stock_level: item.min_stock_level,
                max_stock_level: item.max_stock_level
            }));

            return mappedProducts;

        } catch (error: any) {
            console.error("API GET Error:", error.message);
            throw error;
        }
    }

    async function createProductsApi(producto: Product): Promise<Product> {
        if (!token) throw new Error("Autenticación requerida: Token no disponible.");
        const mandarProducto = {
            name: producto.name,              
            description: producto.description,  
            sku: producto.sku,                  
            category_id: producto.category_id,    
            price: producto.price.toFixed(2),            
            cost_price: producto.cost_price.toFixed(2),   
            stock_quantity: producto.stock_quantity, 
            min_stock_level: producto.min_stock_level, 
            max_stock_level: producto.max_stock_level, 
            is_active: true
        }
        try {
            const response = await fetch(URL + "/api/inventory/products/", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mandarProducto)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error ${response.status} al crear producto.`);
            }

            const data: Product = await response.json();
            return data;

        } catch (error: any) {
            console.error("API POST Error:", error.message);
            throw error;
        }
    }

    async function editProductsApi(producto: Product, id: number): Promise<Product> {
        if (!token) throw new Error("Autenticación requerida: Token no disponible.");
        console.log(URL + `/api/inventory/products/${id}/`)
        const mandarProducto = {
            name: producto.name,              
            description: producto.description ? producto.description || "":"",  
            sku: producto.sku ? producto.sku || null:null,                  
            //category: null,   
            category_id:1,  
            price: producto.price.toFixed(2),            
            cost_price: producto.cost_price.toFixed(2),   
            stock_quantity: producto.stock_quantity, 
            min_stock_level: producto.min_stock_level, 
            max_stock_level: producto.max_stock_level, 
        }
        try {
            const response = await fetch(URL + `/api/inventory/products/${id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mandarProducto)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error ${response.status} al crear producto.`);
            }

            const data: Product = await response.json();
            return data;

        } catch (error: any) {
            console.error("API POST Error:", error.message);
            throw error;
        }
    }

    async function eliminarDeApi(id:number) {
        try {
            const response = await fetch(URL + `/api/inventory/products/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error ${response.status} al eliminar producto.`);
            }

        } catch (error: any) {
            console.error("API DELETE Error:", error.message);
            throw error;
        }
        
    }

    const contextValue: ManejoApiFunctions = {
        importProductsApi,
        createProductsApi,
        editProductsApi,
        eliminarDeApi,
        autenticar,
        token,
    };

    return (
        <ApiContext.Provider value={contextValue}>
            {children}
        </ApiContext.Provider>
    );
};


export const manejoApi = () => {
    const context = useContext(ApiContext);
    if (context === undefined) {
        throw new Error('manejoApi debe ser usado dentro de ApiProvider');
    }
    return context;
}
