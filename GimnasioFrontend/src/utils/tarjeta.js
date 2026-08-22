// =========================================================
// UTILIDADES DE TARJETA
// Validación centralizada, testeable y sin código amontonado.
// Soporta MM/AA y MM/AAAA, Visa/Mastercard (16) y Amex (15).
// =========================================================

export const parseVencimiento = (vencimiento) => {
  const raw = String(vencimiento || "").trim();

  // Acepta MM/AA o MM/AAAA
  const match = raw.match(/^(\d{2})\/(\d{2}|\d{4})$/);
  if (!match) return { valido: false, mes: null, anio: null };

  const mes = Number(match[1]);
  let anioTexto = match[2];
  let anio = Number(anioTexto);

  // Normaliza año a 4 dígitos
  if (anioTexto.length === 2) {
    anio = Number(`20${anioTexto}`);
  }

  if (!Number.isFinite(mes) || mes < 1 || mes > 12) {
    return { valido: false, mes: null, anio: null };
  }

  if (!Number.isFinite(anio)) {
    return { valido: false, mes: null, anio: null };
  }

  return { valido: true, mes, anio };
};

export const estaVencida = (vencimiento) => {
  const { valido, mes, anio } = parseVencimiento(vencimiento);
  if (!valido) return true; // Si no es válido, se considera vencida para forzar rechazo

  const hoy = new Date();
  const mesActual = hoy.getMonth() + 1;
  const anioActual = hoy.getFullYear();

  // Vencida si año < actual, o mismo año y mes < actual (vigente hasta fin de mes)
  if (anio < anioActual) return true;
  if (anio === anioActual && mes < mesActual) return true;

  return false;
};

/**
 * Algoritmo de Luhn: valida el dígito verificador del número.
 */
export const validarLuhn = (numeroTarjeta) => {
  const digitos = String(numeroTarjeta || "").replace(/\D/g, "");
  if (!digitos.length) return false;

  let suma = 0;
  let duplicar = false;

  for (let i = digitos.length - 1; i >= 0; i--) {
    let digito = Number(digitos[i]);

    if (duplicar) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }

    suma += digito;
    duplicar = !duplicar;
  }

  return suma % 10 === 0;
};

export const validarTarjeta = ({ numeroTarjeta, titular, vencimiento, cvv, marca }) => {
  const numero = String(numeroTarjeta || "").replace(/\D/g, "");
  const titularNorm = String(titular || "").trim();
  const cvvNorm = String(cvv || "").replace(/\D/g, "");
  const { valido } = parseVencimiento(vencimiento);

  // Longitud según marca
  const esAmex = String(marca || "").toLowerCase() === "amex";
  const longitudOk = esAmex ? numero.length === 15 : numero.length === 16;

  const titularOk = titularNorm.length >= 3; // mínimo 3 para evitar "A"
  const vencimientoOk = valido && !estaVencida(vencimiento);
  const cvvOk = esAmex ? cvvNorm.length === 4 : cvvNorm.length === 3;
  const luhnOk = validarLuhn(numero);

  return {
    longitudOk,
    titularOk,
    vencimientoOk,
    cvvOk,
    luhnOk,
    vencimientoValido: valido,
    vencida: estaVencida(vencimiento),
    esValida: longitudOk && titularOk && vencimientoOk && cvvOk && luhnOk,
  };
};
/**
 * Prefijo BIN basico por marca: detecta al instante si el
 * inicio del numero no corresponde con la marca elegida.
 */
export const prefijoCorrespondeConMarca = (numeroTarjeta, marca) => {
  const numero = String(numeroTarjeta || "").replace(/\D/g, "");
  const marcaNormalizada = String(marca || "").toLowerCase();

  if (!numero) return true;

  if (marcaNormalizada === "visa") return /^4/.test(numero);
  if (marcaNormalizada === "mastercard") {
    return /^(5[1-5]|2[2-7])/.test(numero);
  }
  if (marcaNormalizada === "amex") return /^3[47]/.test(numero);

  // Marca sin regla conocida: no rechazar
  return true;
};
