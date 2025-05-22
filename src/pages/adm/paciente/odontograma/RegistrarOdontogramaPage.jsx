// src/pages/adm/odontograma/RegistrarOdontogramaPage.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createOdontograma } from '../../../../services/odontograma.service';
import { createDetalle } from '../../../../services/odontograma-detalle.service';
import { AdminLayout } from '../../../../components/layouts/AdminLayout';
import './RegistrarOdontogramaPage.css';
import { PlusCircle, ChevronDown, ChevronRight } from 'lucide-react';

export const RegistrarOdontogramaPage = () => {
    const { idPaciente, idHistorial } = useParams();
    const navigate = useNavigate();

    const [odontograma, setOdontograma] = useState({
        tipo: '',
        descripcion: '',
        archivoURL: ''
    });
    const [detallesActivo, setDetallesActivo] = useState(false);
    const [detalles, setDetalles] = useState([]);
    const [panelAbierto, setPanelAbierto] = useState(true);

    const onChangeOdo = e => {
        const { name, value } = e.target;
        setOdontograma(o => ({ ...o, [name]: value }));
    };

    const addDetalle = () =>
        setDetalles(d => [...d, { numeroPiezaDental: '', estado: '', observaciones: '' }]);

    const onChangeDet = (idx, e) => {
        const { name, value } = e.target;
        setDetalles(d =>
            d.map((det, i) => (i === idx ? { ...det, [name]: value } : det))
        );
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const creado = await createOdontograma({
                idHistorialClinico: Number(idHistorial),
                tipo: odontograma.tipo,
                descripcion: odontograma.descripcion,
                archivoURL: odontograma.archivoURL || null
            });
            const idOdo = creado.idOdontograma;
            if (detallesActivo && detalles.length) {
                for (let det of detalles) {
                    await createDetalle({ idOdontograma: idOdo, ...det });
                }
            }
            alert('✅ Odontograma registrado correctamente');
            navigate(-1);
        } catch {
            alert('❌ Error al registrar odontograma');
        }
    };

    return (
        <AdminLayout>
            <div className="reg-odo-container">
                <h2 className="page-title">Nuevo Odontograma</h2>

                <form onSubmit={handleSubmit} className="reg-odo-form">
                    <div className="card">
                        <h3 className="card-title">Datos Generales</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Tipo</label>
                                <input name="tipo" value={odontograma.tipo} onChange={onChangeOdo} required />
                            </div>
                            <div className="form-group">
                                <label>archivo URL (opcional)</label>
                                <input name="archivoURL" value={odontograma.archivoURL} onChange={onChangeOdo} />
                            </div>
                            <div className="form-group full">
                                <label>Descripción</label>
                                <textarea
                                    name="descripcion"
                                    rows={3}
                                    value={odontograma.descripcion}
                                    onChange={onChangeOdo}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* <div className="detalles-section">
                        <button
                            type="button"
                            className="panel-toggle"
                            onClick={() => setPanelAbierto(f => !f)}
                        >
                            {panelAbierto ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            <span>Añadir Detalles de Dientes</span>
                        </button>

                        {panelAbierto && (
                            <div className="panel-body">
                                <div className="checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="detallesActivo"
                                        checked={detallesActivo}
                                        onChange={() => setDetallesActivo(f => !f)}
                                    />
                                    <label htmlFor="detallesActivo">Registrar cada diente</label>
                                </div>

                                {detallesActivo && (
                                    <>
                                        <button type="button" className="btn-add" onClick={addDetalle}>
                                            <PlusCircle size={18} /> Añadir Diente
                                        </button>

                                        {detalles.map((det, i) => (
                                            <div key={i} className="detalle-row">
                                                <input
                                                    name="numeroPiezaDental"
                                                    placeholder="N° Pieza"
                                                    value={det.numeroPiezaDental}
                                                    onChange={e => onChangeDet(i, e)}
                                                    required
                                                />
                                                <select
                                                    name="estado"
                                                    value={det.estado}
                                                    onChange={e => onChangeDet(i, e)}
                                                    required
                                                >
                                                    <option value="">-- Estado --</option>
                                                    <option value="sano">Sano</option>
                                                    <option value="caries">Caries</option>
                                                    <option value="obturado">Obturado</option>
                                                    <option value="extraido">Extraído</option>
                                                    <option value="corona">Corona</option>
                                                    <option value="endodoncia">Endodoncia</option>
                                                </select>
                                                <input
                                                    name="observaciones"
                                                    placeholder="Observaciones"
                                                    value={det.observaciones}
                                                    onChange={e => onChangeDet(i, e)}
                                                />
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}
                    </div> */}

                    <button type="submit" className="btn-submit">
                        Guardar Odontograma
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
};
