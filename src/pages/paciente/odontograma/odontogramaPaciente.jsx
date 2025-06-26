import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  getOdontogramaById,
  getOdontogramasByHistorial,
  createOdontograma,
  updateOdontograma
} from "../../../../services/odontograma.service";
import { PacienteLayout } from "../../../../components/layouts/PacienteLayout";
import { Eye, Edit, Info } from "lucide-react";

export const OdontogramaPacientePage = () => {
  const { idPaciente, idHistorial, idOdontograma } = useParams();
  const navigate = useNavigate();
  const [odontograma, setOdontograma] = useState(null);
  const [odontogramas, setOdontogramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [formData, setFormData] = useState({
    tipo: "",
    descripcion: "",
    dientes: {},
    observaciones: {}
  });

  // Estructura completa de dientes adultos con posición
  const dientesAdultos = [
    // Superior derecha (1x)
    { numero: 18, nombre: "Molar Tercero", posicion: "superior-derecha" },
    { numero: 17, nombre: "Molar Segundo", posicion: "superior-derecha" },
    { numero: 16, nombre: "Molar Primero", posicion: "superior-derecha" },
    { numero: 15, nombre: "Premolar Segundo", posicion: "superior-derecha" },
    { numero: 14, nombre: "Premolar Primero", posicion: "superior-derecha" },
    { numero: 13, nombre: "Canino", posicion: "superior-derecha" },
    { numero: 12, nombre: "Incisivo Lateral", posicion: "superior-derecha" },
    { numero: 11, nombre: "Incisivo Central", posicion: "superior-derecha" },
    // Superior izquierda (2x)
    { numero: 21, nombre: "Incisivo Central", posicion: "superior-izquierda" },
    { numero: 22, nombre: "Incisivo Lateral", posicion: "superior-izquierda" },
    { numero: 23, nombre: "Canino", posicion: "superior-izquierda" },
    { numero: 24, nombre: "Premolar Primero", posicion: "superior-izquierda" },
    { numero: 25, nombre: "Premolar Segundo", posicion: "superior-izquierda" },
    { numero: 26, nombre: "Molar Primero", posicion: "superior-izquierda" },
    { numero: 27, nombre: "Molar Segundo", posicion: "superior-izquierda" },
    { numero: 28, nombre: "Molar Tercero", posicion: "superior-izquierda" },
    // Inferior izquierda (3x)
    { numero: 38, nombre: "Molar Tercero", posicion: "inferior-izquierda" },
    { numero: 37, nombre: "Molar Segundo", posicion: "inferior-izquierda" },
    { numero: 36, nombre: "Molar Primero", posicion: "inferior-izquierda" },
    { numero: 35, nombre: "Premolar Segundo", posicion: "inferior-izquierda" },
    { numero: 34, nombre: "Premolar Primero", posicion: "inferior-izquierda" },
    { numero: 33, nombre: "Canino", posicion: "inferior-izquierda" },
    { numero: 32, nombre: "Incisivo Lateral", posicion: "inferior-izquierda" },
    { numero: 31, nombre: "Incisivo Central", posicion: "inferior-izquierda" },
    // Inferior derecha (4x)
    { numero: 41, nombre: "Incisivo Central", posicion: "inferior-derecha" },
    { numero: 42, nombre: "Incisivo Lateral", posicion: "inferior-derecha" },
    { numero: 43, nombre: "Canino", posicion: "inferior-derecha" },
    { numero: 44, nombre: "Premolar Primero", posicion: "inferior-derecha" },
    { numero: 45, nombre: "Premolar Segundo", posicion: "inferior-derecha" },
    { numero: 46, nombre: "Molar Primero", posicion: "inferior-derecha" },
    { numero: 47, nombre: "Molar Segundo", posicion: "inferior-derecha" },
    { numero: 48, nombre: "Molar Tercero", posicion: "inferior-derecha" }
  ];

  // Estados posibles para cada diente
  const estadosDiente = {
    sano: { color: "bg-green-100 border-green-300", label: "Sano", descripcion: "Diente en buen estado" },
    caries: { color: "bg-red-100 border-red-300", label: "Caries", descripcion: "Presencia de caries dental" },
    restaurado: { color: "bg-blue-100 border-blue-300", label: "Restaurado", descripcion: "Diente con restauración" },
    ausente: { color: "bg-gray-200 border-gray-400", label: "Ausente", descripcion: "Diente no presente" },
    tratamiento: { color: "bg-yellow-100 border-yellow-300", label: "Tratamiento", descripcion: "En proceso de tratamiento" },
    protesis: { color: "bg-purple-100 border-purple-300", label: "Prótesis", descripcion: "Diente protésico" },
    endodoncia: { color: "bg-orange-100 border-orange-300", label: "Endodoncia", descripcion: "Tratamiento de conducto" },
    fractura: { color: "bg-pink-100 border-pink-300", label: "Fractura", descripcion: "Diente fracturado" }
  };

  // Cargar datos del odontograma
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        if (idOdontograma) {
          const odontogramaData = await getOdontogramaById(idOdontograma);
          setOdontograma(odontogramaData);
          setFormData({
            tipo: odontogramaData.tipo,
            descripcion: odontogramaData.descripcion,
            dientes: odontogramaData.dientes || {},
            observaciones: odontogramaData.observaciones || {}
          });
        }
        
        const odontogramasData = await getOdontogramasByHistorial(idHistorial);
        setOdontogramas(odontogramasData);
        
      } catch (err) {
        setError("Error al cargar el odontograma");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [idHistorial, idOdontograma]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Cambiar estado de un diente
  const handleDienteChange = (dienteNumero, estado) => {
    setFormData(prev => ({
      ...prev,
      dientes: {
        ...prev.dientes,
        [dienteNumero]: estado
      }
    }));
    setSelectedTooth(dienteNumero);
  };

  // Cambiar observación de un diente
  const handleObservacionChange = (e) => {
    if (!selectedTooth) return;
    
    setFormData(prev => ({
      ...prev,
      observaciones: {
        ...prev.observaciones,
        [selectedTooth]: e.target.value
      }
    }));
  };

  // Guardar odontograma
  const handleSave = async () => {
    try {
      setLoading(true);
      
      if (odontograma) {
        // Actualizar odontograma existente
        const updated = await updateOdontograma(odontograma.idOdontograma, formData);
        setOdontograma(updated);
      } else {
        // Crear nuevo odontograma
        const nuevoOdontograma = await createOdontograma({
          ...formData,
          idHistorial: parseInt(idHistorial)
        });
        setOdontograma(nuevoOdontograma);
        setOdontogramas([...odontogramas, nuevoOdontograma]);
        navigate(`/pacientes/${idPaciente}/historial/${idHistorial}/odontograma/${nuevoOdontograma.idOdontograma}`);
      }
      
      setEditMode(false);
    } catch (err) {
      setError("Error al guardar el odontograma");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !odontograma) {
    return (
      <PacienteLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PacienteLayout>
    );
  }

  return (
    <PacienteLayout>
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Odontograma {odontograma ? `#${odontograma.idOdontograma}` : "Nuevo"}
          </h2>
          
          {odontograma && (
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editMode ? (
                <>
                  <Eye size={18} /> Ver Modo
                </>
              ) : (
                <>
                  <Edit size={18} /> Editar
                </>
              )}
            </button>
          )}
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Formulario de odontograma */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Odontograma
                </label>
                <input
                  type="text"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Ej: Odontograma inicial"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción General
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  rows="3"
                  placeholder="Observaciones generales..."
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => editMode && odontograma ? setEditMode(false) : navigate(-1)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400"
                >
                  {loading ? "Guardando..." : "Guardar Odontograma"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                {odontograma?.tipo || "Nuevo Odontograma"}
              </h3>
              <p className="text-gray-600 mb-2">
                {odontograma?.descripcion || "Sin descripción adicional"}
              </p>
              <p className="text-sm text-gray-500">
                {odontograma ? `Creado el: ${new Date(odontograma.fechaCreacion).toLocaleDateString()}` : ""}
              </p>
            </>
          )}
        </div>

        {/* Contenedor principal del odontograma */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Paleta de colores/estados */}
          <div className="lg:w-1/4 bg-white rounded-lg shadow-md p-4 h-fit">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Estados Dentales</h3>
            <div className="space-y-3">
              {Object.entries(estadosDiente).map(([key, { color, label, descripcion }]) => (
                <div 
                  key={key} 
                  className={`p-3 rounded-lg border ${color} flex items-start gap-3`}
                >
                  <div className={`w-4 h-4 mt-1 rounded-full ${color.replace('bg-', 'bg-').replace('border-', 'border-')}`}></div>
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-xs text-gray-600">{descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visualización del odontograma */}
          <div className="lg:w-3/4 bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {editMode ? "Editar Odontograma" : "Visualización Odontológica"}
            </h3>
            
            {/* Representación gráfica de la boca */}
            <div className="relative mb-8">
              {/* Arco superior */}
              <div className="flex justify-center mb-2">
                <div className="w-3/4 h-16 border-2 border-b-0 border-gray-300 rounded-t-full flex justify-between px-8">
                  {dientesAdultos
                    .filter(d => d.posicion.includes("superior"))
                    .sort((a, b) => a.numero - b.numero)
                    .map(diente => {
                      const estadoActual = editMode 
                        ? formData.dientes[diente.numero] || "sano"
                        : odontograma?.dientes?.[diente.numero] || "sano";
                      const estadoInfo = estadosDiente[estadoActual] || estadosDiente.sano;
                      
                      return (
                        <div 
                          key={diente.numero}
                          className={`w-8 h-8 -mt-4 rounded-full border ${estadoInfo.color} flex items-center justify-center cursor-pointer relative
                            ${selectedTooth === diente.numero ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
                          onClick={() => {
                            if (editMode) {
                              handleDienteChange(diente.numero, 
                                estadoActual === "sano" ? "caries" : 
                                estadoActual === "caries" ? "restaurado" : 
                                estadoActual === "restaurado" ? "ausente" : 
                                estadoActual === "ausente" ? "tratamiento" : 
                                estadoActual === "tratamiento" ? "protesis" : 
                                estadoActual === "protesis" ? "endodoncia" :
                                estadoActual === "endodoncia" ? "fractura" : "sano"
                              );
                            } else {
                              setSelectedTooth(diente.numero);
                            }
                          }}
                        >
                          <span className="text-xs font-bold">{diente.numero}</span>
                          {editMode && (
                            <span className="absolute -bottom-5 text-xs whitespace-nowrap">
                              {estadoInfo.label}
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
              
              {/* Espacio central */}
              <div className="h-16 flex items-center justify-center">
                <div className="w-3/4 h-full border-x-2 border-gray-300"></div>
              </div>
              
              {/* Arco inferior */}
              <div className="flex justify-center mt-2">
                <div className="w-3/4 h-16 border-2 border-t-0 border-gray-300 rounded-b-full flex justify-between px-8">
                  {dientesAdultos
                    .filter(d => d.posicion.includes("inferior"))
                    .sort((a, b) => a.numero - b.numero)
                    .map(diente => {
                      const estadoActual = editMode 
                        ? formData.dientes[diente.numero] || "sano"
                        : odontograma?.dientes?.[diente.numero] || "sano";
                      const estadoInfo = estadosDiente[estadoActual] || estadosDiente.sano;
                      
                      return (
                        <div 
                          key={diente.numero}
                          className={`w-8 h-8 -mb-4 rounded-full border ${estadoInfo.color} flex items-center justify-center cursor-pointer relative
                            ${selectedTooth === diente.numero ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
                          onClick={() => {
                            if (editMode) {
                              handleDienteChange(diente.numero, 
                                estadoActual === "sano" ? "caries" : 
                                estadoActual === "caries" ? "restaurado" : 
                                estadoActual === "restaurado" ? "ausente" : 
                                estadoActual === "ausente" ? "tratamiento" : 
                                estadoActual === "tratamiento" ? "protesis" : 
                                estadoActual === "protesis" ? "endodoncia" :
                                estadoActual === "endodoncia" ? "fractura" : "sano"
                              );
                            } else {
                              setSelectedTooth(diente.numero);
                            }
                          }}
                        >
                          <span className="text-xs font-bold">{diente.numero}</span>
                          {editMode && (
                            <span className="absolute -top-5 text-xs whitespace-nowrap">
                              {estadoInfo.label}
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Información del diente seleccionado */}
            {selectedTooth && (
              <div className="mt-6 border-t pt-4">
                <h4 className="text-md font-medium text-gray-700 mb-3">
                  Información del Diente #{selectedTooth} - {
                    dientesAdultos.find(d => d.numero === selectedTooth)?.nombre
                  }
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Estado actual:</p>
                    <div className={`p-3 rounded-lg ${
                      estadosDiente[editMode 
                        ? formData.dientes[selectedTooth] || "sano"
                        : odontograma?.dientes?.[selectedTooth] || "sano"
                      ]?.color || "bg-gray-100"
                    }`}>
                      {estadosDiente[editMode 
                        ? formData.dientes[selectedTooth] || "sano"
                        : odontograma?.dientes?.[selectedTooth] || "sano"
                      ]?.label || "Sano"}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones:
                    </label>
                    {editMode ? (
                      <textarea
                        value={formData.observaciones[selectedTooth] || ""}
                        onChange={handleObservacionChange}
                        className="w-full p-2 border rounded-md"
                        rows="3"
                        placeholder="Detalles sobre este diente..."
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md border">
                        {odontograma?.observaciones?.[selectedTooth] || "No hay observaciones registradas"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lista de odontogramas del historial */}
        {odontogramas.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Odontogramas del Historial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {odontogramas.map(odonto => (
                <div 
                  key={odonto.idOdontograma} 
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                    odontograma?.idOdontograma === odonto.idOdontograma ? "border-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => navigate(
                    `/pacientes/${idPaciente}/historial/${idHistorial}/odontograma/${odonto.idOdontograma}`
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        #{odonto.idOdontograma} - {odonto.tipo}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {odonto.descripcion || "Sin descripción"}
                      </p>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {new Date(odonto.fechaCreacion).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PacienteLayout>
  );
};