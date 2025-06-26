import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { getProductoById, updateProducto } from "../../../services/producto.service";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ActualizarProductoPageAdm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombreProducto: "",
        descripcion: "",
        stockActual: 0,
        stockMinimo: 0,
        unidadMedida: ""
    });

    const [errors, setErrors] = useState({
        stockValidation: "",
        formErrors: {}
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [initialData, setInitialData] = useState(null);

    // Cargar datos del producto
    useEffect(() => {
        if (!id || isNaN(id)) {
            toast.error("ID de producto inválido");
            navigate("/productos", { replace: true });
            return;
        }

        let isMounted = true;

        const cargarProducto = async () => {
            try {
                const producto = await getProductoById(id);
                
                if (!isMounted) return;
                
                if (!producto) {
                    throw new Error("Producto no encontrado");
                }

                setInitialData(producto);
                setForm({
                    nombreProducto: producto.nombreProducto || "",
                    descripcion: producto.descripcion || "",
                    stockActual: producto.stockActual || 0,
                    stockMinimo: producto.stockMinimo || 0,
                    unidadMedida: producto.unidadMedida || ""
                });
                
                toast.success("Producto cargado correctamente");
            } catch (error) {
                console.error("Error al cargar producto:", error);
                toast.error(error.message || "Error al cargar el producto");
                navigate("/productos", { replace: true });
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        cargarProducto();

        return () => {
            isMounted = false;
        };
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const newValue = type === "number" ? Number(value) : value;

        setForm(prev => ({
            ...prev,
            [name]: newValue,
        }));

        // Validación en tiempo real para stock
        if (name === "stockActual" || name === "stockMinimo") {
            const stockActual = name === "stockActual" ? newValue : form.stockActual;
            const stockMinimo = name === "stockMinimo" ? newValue : form.stockMinimo;

            setErrors(prev => ({
                ...prev,
                stockValidation: stockMinimo > stockActual
                    ? "El stock mínimo no puede ser mayor que el stock actual"
                    : ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!form.nombreProducto.trim()) {
            newErrors.nombreProducto = "El nombre del producto es requerido";
            isValid = false;
        } else if (form.nombreProducto.trim().length > 100) {
            newErrors.nombreProducto = "El nombre no puede exceder 100 caracteres";
            isValid = false;
        }

        if (!form.descripcion.trim()) {
            newErrors.descripcion = "La descripción es requerida";
            isValid = false;
        }

        if (form.stockActual < 0) {
            newErrors.stockActual = "El stock no puede ser negativo";
            isValid = false;
        }

        if (form.stockMinimo < 0) {
            newErrors.stockMinimo = "El stock mínimo no puede ser negativo";
            isValid = false;
        }

        if (form.stockMinimo > form.stockActual) {
            newErrors.stockValidation = "El stock mínimo no puede ser mayor que el actual";
            isValid = false;
        }

        if (!form.unidadMedida.trim()) {
            newErrors.unidadMedida = "La unidad de medida es requerida";
            isValid = false;
        } else if (form.unidadMedida.trim().length > 20) {
            newErrors.unidadMedida = "La unidad no puede exceder 20 caracteres";
            isValid = false;
        }

        setErrors(prev => ({
            ...prev,
            formErrors: newErrors
        }));

        return isValid;
    };

    const hasChanges = () => {
        if (!initialData) return false;
        
        return (
            form.nombreProducto !== initialData.nombreProducto ||
            form.descripcion !== initialData.descripcion ||
            form.stockActual !== initialData.stockActual ||
            form.stockMinimo !== initialData.stockMinimo ||
            form.unidadMedida !== initialData.unidadMedida
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        if (errors.stockValidation) return;
        if (!hasChanges()) {
            toast.info("No hay cambios para guardar");
            return;
        }

        setIsSubmitting(true);

        try {
            const productoData = {
                nombreProducto: form.nombreProducto.trim(),
                descripcion: form.descripcion.trim(),
                stockActual: form.stockActual,
                stockMinimo: form.stockMinimo,
                unidadMedida: form.unidadMedida.trim()
            };

            await updateProducto(id, productoData);
            toast.success("Producto actualizado exitosamente");
            navigate("/productos");
        } catch (error) {
            console.error("Error al actualizar producto:", error);

            if (error.response) {
                if (error.response.data?.errors) {
                    const errorMessages = error.response.data.errors
                        .map(err => Object.values(err.constraints).join(", "))
                        .join("\n");
                    toast.error(`Errores de validación:\n${errorMessages}`);
                } else {
                    toast.error(error.response.data?.message || "Error al actualizar el producto");
                }
            } else {
                toast.error("Error de conexión: " + (error.message || "Por favor revise su conexión"));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="w-full px-4 py-6 sm:px-8 md:px-16 bg-gray-50 min-h-screen flex justify-center items-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p>Cargando producto...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="w-full px-4 py-6 sm:px-8 md:px-16 bg-gray-50 min-h-screen">
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
                    <h2 className="text-3xl font-bold text-blue-900 mb-6">Editar Producto</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre del Producto *</label>
                            <input
                                type="text"
                                name="nombreProducto"
                                value={form.nombreProducto}
                                onChange={handleChange}
                                className={`mt-1 block w-full border ${errors.formErrors.nombreProducto ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500`}
                                required
                                maxLength={100}
                            />
                            {errors.formErrors.nombreProducto && (
                                <p className="text-red-500 text-xs mt-1">{errors.formErrors.nombreProducto}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Máximo 100 caracteres</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción *</label>
                            <textarea
                                name="descripcion"
                                value={form.descripcion}
                                onChange={handleChange}
                                className={`mt-1 block w-full border ${errors.formErrors.descripcion ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500`}
                                rows="4"
                                required
                            />
                            {errors.formErrors.descripcion && (
                                <p className="text-red-500 text-xs mt-1">{errors.formErrors.descripcion}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Stock Actual *</label>
                                <input
                                    type="number"
                                    name="stockActual"
                                    value={form.stockActual}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full border ${errors.formErrors.stockActual ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500`}
                                    required
                                    min={0}
                                    step="1"
                                />
                                {errors.formErrors.stockActual && (
                                    <p className="text-red-500 text-xs mt-1">{errors.formErrors.stockActual}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Stock Mínimo *</label>
                                <input
                                    type="number"
                                    name="stockMinimo"
                                    value={form.stockMinimo}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full border ${errors.formErrors.stockMinimo ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500`}
                                    required
                                    min={0}
                                    step="1"
                                />
                                {(errors.formErrors.stockMinimo || errors.stockValidation) && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.formErrors.stockMinimo || errors.stockValidation}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Unidad de Medida *</label>
                            <input
                                type="text"
                                name="unidadMedida"
                                value={form.unidadMedida}
                                onChange={handleChange}
                                className={`mt-1 block w-full border ${errors.formErrors.unidadMedida ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500`}
                                required
                                maxLength={20}
                            />
                            {errors.formErrors.unidadMedida && (
                                <p className="text-red-500 text-xs mt-1">{errors.formErrors.unidadMedida}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Máximo 20 caracteres</p>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/productos")}
                                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className={`px-4 py-2 rounded-lg text-white shadow transition ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                                disabled={!!errors.stockValidation || isSubmitting || !hasChanges()}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="inline-block animate-spin mr-2">↻</span>
                                        Actualizando...
                                    </>
                                ) : 'Actualizar Producto'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};