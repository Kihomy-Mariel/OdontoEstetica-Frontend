import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOnePaciente } from "../../../../services/paciente.service";
import { createHistorialClinico } from "../../../../services/historial-clinico.service";
import { AdminLayout } from "../../../../components/layouts/AdminLayout";
import "./RegistrarHistorialClinicoPage.css";
import { getOdontogramasByHistorial } from "../../../../services/odontograma.service";
import { Eye } from "lucide-react";

export const RegistrarHistorialClinicoPage = () => {
  const { idPaciente } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [odontos, setOdontos] = useState([]);

  const [form, setForm] = useState({
    idPaciente: Number(idPaciente),
    fechaRegistroHistorial: "",
    antecedentesMedicos: "",
    antecedentesOdontologicos: "",
    diagnostico: "",
    tratamientoPropuesto: "",
    tratamientoRealizado: "",
    observaciones: "",
    edadEnConsulta: "",
  });

  useEffect(() => {
    // Cargar solo el paciente seleccionado
    getOnePaciente(idPaciente)
      .then(data => setPaciente(data))
      .catch(console.error);
  }, [idPaciente]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createHistorialClinico({
        ...form,
        edadEnConsulta: Number(form.edadEnConsulta),
      });
      alert("✅ Historial clínico registrado");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("❌ Error al registrar historial clínico");
    }
  };

  
  return (
    <AdminLayout>
      <div className="registrar-hc-container">
        <h2 className="page-title">Historial Clínico</h2>
        <p className="subtitle">Complete el formulario para crear un nuevo registro clínico</p>

        <form className="hc-form" onSubmit={handleSubmit}>
          {/* Mostrar solo nombre de paciente */}
          <div className="form-group">
            <label>Paciente</label>
            <input
              type="text"
              value={
                paciente
                  ? `${paciente.persona.nombres} ${paciente.persona.apellidoPaterno}`
                  : "Cargando..."
              }
              disabled
            />
          </div>

          {/* Solo fecha y datos clínicos */}
          <div className="form-group two-cols">
            <div>
              <label>Fecha</label>
              <input
                type="date"
                name="fechaRegistroHistorial"
                value={form.fechaRegistroHistorial}
                onChange={handleChange}
                required
              />
            </div>
            <div className="small-group">
              <label>Edad en Consulta</label>
              <input
                type="number"
                name="edadEnConsulta"
                value={form.edadEnConsulta}
                onChange={handleChange}
                min={0}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Antecedentes Médicos</label>
            <textarea
              name="antecedentesMedicos"
              value={form.antecedentesMedicos}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label>Antecedentes Odontológicos</label>
            <textarea
              name="antecedentesOdontologicos"
              value={form.antecedentesOdontologicos}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label>Diagnóstico</label>
            <input
              type="text"
              name="diagnostico"
              value={form.diagnostico}
              onChange={handleChange}
              placeholder="Diagnóstico del paciente"
              required
            />
          </div>

          <div className="form-group">
            <label>Tratamiento Propuesto</label>
            <input
              type="text"
              name="tratamientoPropuesto"
              value={form.tratamientoPropuesto}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Tratamiento Realizado</label>
            <input
              type="text"
              name="tratamientoRealizado"
              value={form.tratamientoRealizado}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Observaciones</label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <button type="submit" className="btn-submit">
            Guardar Registro
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};