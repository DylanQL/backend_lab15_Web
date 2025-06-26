'use client'; // Indica que este componente se ejecuta en el cliente (necesario para usar hooks como useState, useEffect)

// Importa hooks de Next.js y React
import { useRouter, useParams } from 'next/navigation'; // useRouter para redireccionar, useParams para obtener el ID desde la URL
import { useEffect, useState } from 'react'; // useEffect para cargar el producto, useState para manejar el formulario

// Importa las funciones para obtener y actualizar un producto desde la API
import { getProducto, updateProducto } from '@/lib/api';

export default function EditarProducto() {
  const router = useRouter(); // Para redireccionar después de guardar
  const { codProducto } = useParams(); // Extrae el ID del producto desde la URL

  // Estado para los datos del formulario
  const [form, setForm] = useState({
    nomPro: '',
    precioProducto: '',
    stockProducto: ''
  });

  // Al cargar el componente, obtener los datos del producto y llenar el formulario
  useEffect(() => {
    getProducto(codProducto).then(data => setForm(data));
  }, [codProducto]);

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del form (recarga)

    // Envía los datos actualizados al backend
    await updateProducto(codProducto, {
      ...form,
      precioProducto: parseFloat(form.precioProducto), // Asegura que sea número decimal
      stockProducto: parseInt(form.stockProducto)       // Asegura que sea número entero
    });

    // Redirige a la lista de productos
    router.push('/productos');
  };

  return (
    // Formulario estilizado con Tailwind
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-4">

      {/* Campo nombre */}
      <input
        className="border p-2 w-full"
        placeholder="Nombre"
        value={form.nomPro}
        onChange={e => setForm({ ...form, nomPro: e.target.value })}
      />

      {/* Campo precio */}
      <input
        className="border p-2 w-full"
        placeholder="Precio"
        type="number"
        step="0.01"
        value={form.precioProducto}
        onChange={e => setForm({ ...form, precioProducto: e.target.value })}
      />

      {/* Campo stock */}
      <input
        className="border p-2 w-full"
        placeholder="Stock"
        type="number"
        value={form.stockProducto}
        onChange={e => setForm({ ...form, stockProducto: e.target.value })}
      />

      {/* Botón para guardar */}
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Guardar Cambios
      </button>
    </form>
  );
}