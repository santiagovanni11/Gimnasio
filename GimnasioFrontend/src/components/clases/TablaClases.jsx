import { cupoDeHorario } from "../../utils/inscripcionesClase";
import { profesorDeClase, proximaFranjaClase, nivelOcupacion } from "../../utils/clasesOperativas";

function TablaClases({
 clases,
 horarios,
 seleccionada,
 puedeGestionarClases,
 puedeEliminarClases,
 onSeleccionar,
 onEditar,
 onEliminar,
 onAlternarEstado,
 inscripciones = [],
}) {
 const horariosDe = (clase) => horarios.filter((h) => h.claseId === clase.id);

 return (
   <div className="table-wrapper">
     <table>
       <thead>
         <tr>
           <th>Clase</th>
           <th>Profesor</th>
           <th>Cupo</th>
           <th>Próxima franja</th>
           <th>Acciones</th>
         </tr>
       </thead>

       <tbody>
         {clases.map((clase) => {
           const activa = clase.id === seleccionada?.id;
           const listaHorarios = horariosDe(clase);
           const cupo = listaHorarios.length
             ? cupoDeHorario(inscripciones, listaHorarios[0], clase.capacidadMaxima)
             : { ocupados: 0, capacidad: clase.capacidadMaxima || 0, libres: clase.capacidadMaxima || 0, lleno: false };
           const nivel = nivelOcupacion(clase, listaHorarios, inscripciones);

           return (
             <tr key={clase.id} className={activa ? "fila-seleccionada" : ""}>
               <td>
                 <div className="clase-cell-main">
                   <strong>{clase.nombre}</strong>
                   <small>{clase.descripcion || "Sin descripción"}</small>
                   {clase.activa === false && <span className="status-inactive">Inactiva</span>}
                 </div>
               </td>

               <td>{profesorDeClase(clase, horarios)}</td>

               <td>
                 <div className="clase-cupo-box">
                   <span>{cupo.ocupados}/{cupo.capacidad}</span>
                   <small className={nivel.claseCss}>{nivel.nivel}</small>
                 </div>
               </td>

               <td>{proximaFranjaClase(clase, listaHorarios)}</td>

               <td>
                 <div className="table-actions">
                   <button type="button" className="view-button" onClick={() => onSeleccionar(activa ? null : clase)}>
                     {activa ? "Ocultar" : "Horarios"}
                   </button>

                   {puedeGestionarClases && (
                     <>
                       <button type="button" className={clase.activa === false ? "approve-button" : "secondary-button"} onClick={() => onAlternarEstado?.(clase)}>
                         {clase.activa === false ? "Activar" : "Desactivar"}
                       </button>
                       <button type="button" className="edit-button" onClick={() => onEditar(clase)}>Editar</button>
                       <button type="button" className="delete-button" onClick={() => onEliminar(clase, listaHorarios.length)} disabled={!puedeEliminarClases}>
                         Eliminar
                       </button>
                     </>
                   )}
                 </div>
               </td>
             </tr>
           );
         })}
       </tbody>
     </table>
   </div>
 );
}

export default TablaClases;
