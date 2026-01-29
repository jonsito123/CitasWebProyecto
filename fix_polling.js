// Script para corregir el polling
// Ejecutar esto en la consola del navegador

// 1. Reset horariosAnterior cuando se guarda un horario
const oldRegistrarHorario = window.RegistrarHorario;
window.RegistrarHorario = async function() {
  const result = await oldRegistrarHorario.call(this);
  console.log("[Fix] Reseteando horariosAnterior después de RegistrarHorario");
  window.horariosAnterior = null;
  await window.VerificarCambios();
  return result;
};

// 2. Reset horariosAnterior cuando se guarda cambios
const oldGuardarCambios = window.GuardarCambios;
window.GuardarCambios = async function(event) {
  const result = await oldGuardarCambios.call(this, event);
  console.log("[Fix] Reseteando horariosAnterior después de GuardarCambios");
  window.horariosAnterior = null;
  await window.VerificarCambios();
  return result;
};

console.log("[Fix] Sistema de Polling corregido");
