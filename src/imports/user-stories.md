Ítem 8 — Validación al crear materia
HU: Como estudiante, quiero recibir retroalimentación si falta información.
CA:
Si el nombre está vacío, aparece “Escribe un nombre para la materia”.
No se guarda hasta corregir.

Ítem 9 — Categorizar materias (modal para crear categorías)
HU: Como estudiante, quiero clasificar materias por categorías para organizarlas mejor.
CA:
Puede seleccionar categoría existente o crear nueva.
Categoría visible en listado.

Ítem 10 — Estado vacío en materias
HU: Como estudiante, quiero entender qué hacer cuando no tengo materias registradas.
CA:
Mensaje: “Aún no tienes materias”.
CTA dirige a crear materia.

Ítem 11 — Listado de sesiones de estudio
HU: Como estudiante, quiero ver mis sesiones planificadas y realizadas para controlar mi tiempo.
CA:
Lista muestra materia, fecha y estado.
Ordenadas por fecha próxima.

Ítem 12 — Crear sesión de estudio (modal)
HU: Como estudiante, quiero registrar sesiones para planificar cuándo estudiar.
CA:
Permite seleccionar materia, fecha y duración.
Confirmación visible al guardar.

Ítem 13 — Definir meta por sesión (modal)
HU: Como estudiante, quiero establecer una meta específica para cada sesión para estudiar con propósito.
CA:
Campo de meta obligatorio.
Meta visible en la lista de sesiones.

Ítem 14 — Programar horario de sesión
HU: Como estudiante, quiero asignar horario para estructurar mi rutina.
CA:
Permite elegir hora inicio y fin.
Validación evita horarios inválidos.

Ítem 15 — Recordatorios de sesiones
HU: Como estudiante, quiero recibir recordatorios para no olvidar estudiar.
CA:
Puede activarse recordatorio.
Si los permisos están denegados, se informa claramente.

Ítem 16 — Confirmación al guardar sesión
HU: Como estudiante, quiero saber que la sesión fue registrada correctamente.
CA:
Mensaje “Sesión guardada”.
Acción secundaria “Ver sesiones”.

Ítem 17 — Error al guardar sesión
HU: Como estudiante, quiero saber qué hacer si ocurre un fallo.
CA:
Mensaje: “No se pudo guardar. Inténtalo nuevamente”.
Botón “Reintentar”.
Los datos ingresados se conservan.

Ítem 18 — Seguimiento de metas alcanzadas
HU: Como estudiante, quiero visualizar metas cumplidas para medir progreso.
CA:
Dashboard muestra metas completadas.
Actualización automática tras completar sesión.

Pantallas preliminares (nombres)
Registro / Login
Inicio / Dashboard
Estado vacío inicial
Lista de materias
Modal crear materia
Categorías
Lista de sesiones
Crear sesión
Editar sesión
Confirmación / Snackbar
Estado vacío materias
Estado vacío sesiones
Permiso notificaciones
Error de red
Ayuda / Cómo empezar
Tres estados críticos esperados (v0)
Vacío (Materias):
“Aún no tienes materias. Agrega la primera.” + CTA “Agregar materia”.
Confirmación (Guardar sesión):
“Sesión guardada.” + acción “Ver sesiones”.
Error (Fallo de guardado):
“No se pudo guardar. Revisa tu conexión e inténtalo nuevamente.” + “Reintentar”.
