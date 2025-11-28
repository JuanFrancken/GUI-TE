import React, { createContext, useContext, useState, ReactNode } from "react";
import { manejoApi } from "./ManejoApi";

export interface Category{
    name : string,
    description: string
}
export interface Product {
    id: number;
    name: string;
    description: string;
    sku: string;
    category: Category;
    category_id: number;
    price: number;
    cost_price: number;
    stock_quantity: number;
    min_stock_level: number;
    max_stock_level: number;
}

interface ProductFunctions {
    products: Product[];
    crearProducto: (nombre: string, descripcion: string, sku: string, categoria: string, precio: number, precioCoste: number, stockActual: number, stockMinimo: number, stockMaximo: number) => void;
    eliminarProducto: (id: number) => void;
    editarProducto: (editado: Product) => void;
    // Ya corregido para no esperar argumentos
    traerDeApi: () => void;
}

const ProductContext = createContext<ProductFunctions | undefined>(undefined);

const productos: Product[] = [
];

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>(productos);
    const { importProductsApi, createProductsApi, editProductsApi, eliminarDeApi} = manejoApi()

    async function crearProducto(nombre: string, descripcion: string, sku: string, categoria: string, precio: number, precioCoste: number, stockActual: number, stockMinimo: number, stockMaximo: number) {
        const newCategory: Category = {
            name: categoria,
            description :""
        }

        const newProduct: Product = {
            id: Date.now(),
            name: nombre,
            description: descripcion,
            sku,
            category: newCategory,
            category_id: 1,
            price: precio,
            cost_price: precioCoste,
            stock_quantity: stockActual,
            min_stock_level: stockMinimo,
            max_stock_level: stockMaximo,
        }
        try {
            // Se llama a la API para crear el producto y se recibe la respuesta con el ID real
            const productFromApi = await createProductsApi(newProduct);
            if (productFromApi) {

                setProducts(prevProducts => [...prevProducts, productFromApi]);
            }
        } catch {
            console.log("No se ha podido crear producto en API")
        }

    }

    async function eliminarProducto(id: number) {
        // Asume que también deberías llamar a una API de eliminación aquí
        setProducts(anterior => anterior.filter(p => p.id !== id));
        try{
            await eliminarDeApi(id);
        }catch{

        }
        
    }

    async function editarProducto(editado: Product) {
        setProducts(prev =>
            prev.map(p => p.id === editado.id ? editado : p)
        );
        try {
            await editProductsApi(editado, editado.id);
        } catch {
            console.log("No se ha podido actualizar producto en API")
        }
    }

    async function traerDeApi() {
        try {
            const importados = await importProductsApi();
            if (importados) {
                setProducts(importados);
            } else {
                console.log("No se pudo traer de la api")
            }
        } catch (error) {
            console.error("Error al cargar productos de la API:", error);
        }

    }

    const contextValue: ProductFunctions = {
        products,
        crearProducto,
        eliminarProducto,
        editarProducto,
        traerDeApi
    };

    return (
        <ProductContext.Provider value={contextValue}>
            {children}
        </ProductContext.Provider>
    );
};


export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts debe ser usado dentro de un ProductProvider');
    }
    return context;
};