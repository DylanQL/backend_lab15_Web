'use client'; // Indica que este componente se renderiza del lado del cliente (necesario para usar hooks)

// Importa el hook useRouter para redireccionar al usuario después de crear el producto
import { useRouter } from 'next/navigation';

// Importa useState para manejar el estado del formulario
import { useState } from 'react';

// Importa la función que envía la solicitud POST al backend
import { createProducto } from '@/lib/api';

export default function CrearProducto() {
  const router = useRouter(); // Permite redireccionar a otra página
  // Estado inicial del formulario con campos vacíos
  const [form, setForm] = useState({ nomPro: '', precioProducto: '', stockProducto: '' });

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que se recargue la página al enviar el formulario

    // Crea el producto llamando a la función de la API (conversión de tipos incluida)
    await createProducto({ 
      ...form, 
      precioProducto: parseFloat(form.precioProducto),  // Convierte a decimal
      stockProducto: parseInt(form.stockProducto)       // Convierte a entero
    });

    // Redirecciona a la página de listado de productos
    router.push('/productos');
  };

  return (
    // Formulario con estilos de Tailwind y evento onSubmit
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-4">

      {/* Campo para el nombre del producto */}
      <input 
        className="border p-2 w-full" 
        placeholder="Nombre"
        value={form.nomPro}
        onChange={e => setForm({ ...form, nomPro: e.target.value })}
      />

      {/* Campo para el precio del producto */}
      <input 
        className="border p-2 w-full" 
        placeholder="Precio"
        type="number" 
        step="0.01"
        value={form.precioProducto}
        onChange={e => setForm({ ...form, precioProducto: e.target.value })}
      />

      {/* Campo para el stock del producto */}
      <input 
        className="border p-2 w-full" 
        placeholder="Stock"
        type="number"
        value={form.stockProducto}
        onChange={e => setForm({ ...form, stockProducto: e.target.value })}
      />

      {/* Botón para enviar el formulario */}
      <button 
        type="submit" 
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Crear
      </button>
    </form>
  );
}