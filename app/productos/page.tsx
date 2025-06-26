'use client'; // Indica que este componente se ejecuta en el cliente (obligatorio para usar hooks como useState, useRouter)

// Importa hooks y herramientas necesarias
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Hook para navegación programática

export default function ProductosPage() {
  // Estado para almacenar la lista de productos
  const [productos, setProductos] = useState([]);
  const router = useRouter(); // Permite redirigir a otras rutas

  // Función para obtener productos del backend
  const fetchProductos = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/productos'); // Solicitud GET
      const data = await res.json(); // Parseo de respuesta
      setProductos(data); // Actualiza el estado
    } catch (error) {
      console.error('Error al obtener productos:', error); // Manejo de errores
    }
  };

  // Función para eliminar un producto por su código
  const eliminarProducto = async (codProducto) => {
    const confirmar = confirm('¿Estás seguro de eliminar este producto?');
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:3001/api/productos/${codProducto}`, {
        method: 'DELETE',
      });

      if (res.status === 204) {
        alert('Producto eliminado');
        fetchProductos(); // Refresca la lista
      } else {
        const data = await res.json();
        alert('Error al eliminar: ' + data.message);
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  // Carga los productos al montar el componente
  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Productos</h1>

      {/* Botón para ir al formulario de nuevo producto */}
      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={() => router.push('/productos/new')}
      >
        + Agregar Producto
      </button>

      {/* Tabla de productos */}
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Código</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Precio</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Recorre los productos y los muestra en la tabla */}
          {productos.map((prod) => (
            <tr key={prod.codProducto} className="text-center">
              <td className="p-2 border">{prod.codProducto}</td>
              <td className="p-2 border">{prod.nomPro}</td>
              <td className="p-2 border">{prod.precioProducto}</td>
              <td className="p-2 border">{prod.stockProducto}</td>
              <td className="p-2 border space-x-2">
                {/* Botón para editar el producto */}
                <button
                  onClick={() => router.push(`/productos/${prod.codProducto}/edit`)}
                  className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                >
                  Editar
                </button>

                {/* Botón para eliminar el producto */}
                <button
                  onClick={() => eliminarProducto(prod.codProducto)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}

          {/* Mensaje si no hay productos */}
          {productos.length === 0 && (
            <tr>
              <td colSpan="5" className="p-4 text-center">
                No hay productos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}