import React, { useState } from 'react';
import subirArchivoClinico  from "../../../../services/archivo-clinico.service";

export default SubirArchivoClinico;

const SubirArchivoClinico = ({ idHistorialClinico }) => {
  const [file, setFile] = useState(null);
  const [observaciones, setObservaciones] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !idHistorialClinico) {
      alert("Por favor selecciona un archivo y un historial clínico.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('idHistorialClinico', idHistorialClinico);
    formData.append('observaciones', observaciones);

    try {
      const response = await subirArchivoClinico(formData);
      alert('Archivo subido correctamente');
      console.log(response);
    } catch (error) {
      console.error(error);
      alert('Error al subir archivo');
    }
  };

  return (
    <div>
      <h2>Subir Archivo Clínico</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <br />
        <textarea
          placeholder="Observaciones"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
        <br />
        <button type="submit">Subir</button>
      </form>
    </div>
  );
};


/*
export const subirArchivoClinico = (formData) =>
  axiosConsultorio.post('/archivo-clinico/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(r => r.data);*/

