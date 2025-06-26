import { useEffect, useState } from 'react';
import { getAllEmpleados } from "../../../services/empleado.service";
import { getAgendaEmpleado } from "../../../services/asistencia.service";
import { getAllTurnos } from "../../../services/turno.service";
import { PacienteLayout } from '../../../components/layouts/PacienteLayout';

export const HorariosDoctoresPage = () => {
  const [profesionales, setProfesionales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Días de la semana
  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Cargar todos los profesionales con sus horarios
  useEffect(() => {
    const cargarTodosProfesionales = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener todos los empleados y turnos
        const [empleadosData, turnosData] = await Promise.all([
          getAllEmpleados(),
          getAllTurnos()
        ]);

        // Obtener horarios para cada profesional
        const profesionalesConHorarios = await Promise.all(
          empleadosData.map(async profesional => {
            try {
              const agendaEmpleado = await getAgendaEmpleado(profesional.idEmpleado);
              
              // Organizar horarios por día
              const horariosPorDia = {};
              
              agendaEmpleado.forEach(asistencia => {
                const turno = turnosData.find(t => t.idTurno === asistencia.idTurno);
                if (turno) {
                  const dia = diasSemana[asistencia.diaSemana - 1];
                  horariosPorDia[dia] = {
                    horaInicio: turno.horaInicio.slice(0, 5),
                    horaFin: turno.horaFin.slice(0, 5)
                  };
                }
              });

              return {
                ...profesional,
                horarios: horariosPorDia
              };
            } catch (error) {
              console.error(`Error cargando agenda para ${profesional.persona?.nombres}:`, error);
              return {
                ...profesional,
                horarios: {}
              };
            }
          })
        );

        setProfesionales(profesionalesConHorarios);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('No se pudieron cargar los horarios de los profesionales');
      } finally {
        setLoading(false);
      }
    };

    cargarTodosProfesionales();
  }, []);

  return (
    <PacienteLayout>
      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Horarios de Todos los Profesionales</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-blue-600">
              <span className="animate-pulse">Cargando horarios...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {profesionales.length > 0 ? (
              profesionales.map(profesional => (
                <div key={profesional.idEmpleado} className="border rounded-lg overflow-hidden shadow-sm">
                  {/* Encabezado del profesional */}
                  <div className="bg-gray-50 p-4 border-b">
                    <h3 className="font-semibold text-gray-800">
                      {profesional.persona?.nombres} {profesional.persona?.apellidoPaterno}
                      <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {profesional.cargo}
                      </span>
                    </h3>
                    {profesional.especialidad && (
                      <p className="text-sm text-gray-600 mt-1">
                        Especialidad: {profesional.especialidad}
                      </p>
                    )}
                  </div>

                  {/* Horarios */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {diasSemana.map(dia => (
                        <div key={dia} className={`border rounded-md p-3 ${
                          profesional.horarios[dia] ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <h5 className="font-medium text-gray-700 text-sm mb-2">{dia}</h5>
                          {profesional.horarios[dia] ? (
                            <p className="text-green-600 font-medium">
                              {profesional.horarios[dia].horaInicio} - {profesional.horarios[dia].horaFin}
                            </p>
                          ) : (
                            <p className="text-gray-400 text-sm">No labora</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <p>No se encontraron profesionales registrados</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PacienteLayout>
  );
};