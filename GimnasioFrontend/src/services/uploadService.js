import { API_URL } from "../assets/api";
import { buildAuthHeaders } from "./apiClient";

export async function subirFoto(archivo) {
  const formData = new FormData();
  formData.append("archivo", archivo);

  const respuesta = await fetch(`${API_URL}/upload/foto`, {
    method: "POST",
    headers: buildAuthHeaders(),
    body: formData,
  });

  if (!respuesta.ok) {
    const texto = await respuesta.text();
    throw new Error(texto || "Error al subir la imagen.");
  }

  return respuesta.json();
}
