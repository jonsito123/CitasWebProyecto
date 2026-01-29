# CitasApp - AI Coding Agent Guidelines

## Project Overview
**CitasApp** is a vanilla JavaScript medical appointment booking SPA (Single Page Application) for Clínica Los Fresnos. No framework—pure HTML/CSS/ES6+ JavaScript with inline code in `index.html` and CSS organized in separate files.

### Stack & Architecture
- **Frontend**: Vanilla HTML5, CSS3, ES6+ JavaScript (~600 lines inline in index.html)
- **UI Components**: SweetAlert2 v11.7.3 (CDN) for modals; custom CSS for calendar/grid layouts
- **Backend APIs**: Render (`https://api-rest-ventas.onrender.com`) + Vercel fallback
- **Design**: Mobile-first responsive (breakpoints: 360px, 480px, 768px, 1200px)

## Critical Architecture Patterns

### 1. **Three-View SPA Flow**
The application uses view containers toggled by `showView(viewName, title)`:
```javascript
// Views: specialties → doctores → calendar
// Each accessible via back buttons using showView()
// See index.html lines ~250 for implementation
```
- **specialties-view**: Grid of medical specialties (emoji icons)
- **doctores-view**: Doctor cards filtered by specialty
- **calendar-view**: Interactive calendar + appointment slots

### 2. **Async Data Loading Pattern**
All API calls use `fetch()` with `async/await`. Always:
- Fetch from Render API (`https://api-rest-ventas.onrender.com`)
- Convert response to JSON before using: `const data = await response.json()`
- Handle empty arrays explicitly (e.g., `if(data.length>0)`)
- Use `.toISOString().split("T")[0]` for date string comparisons

**Example** (index.html ~lines 210):
```javascript
async function ObtenerMedicosEspecialidad(id) {
  const response = await fetch(`https://api-rest-ventas.onrender.com/api/MedicosEspecialidad/${id}`);
  const data = await response.json();
  // Filter, validate, then render
}
```

### 3. **Calendar Date Logic (Critical)**
- **Past dates**: Marked with class `past` (opacity: 0.45), non-clickable
- **Available dates**: Class `available` (green), clickable only if medico has schedules
- **Selected date**: Class `selected` (blue)
- **Comparison method**: Always convert to ISO strings: `new Date().toISOString().split('T')[0]`
- **Prevention**: Don't allow navigation to past months in calendar header

See `renderCalendar()` (~lines 280) for full implementation; past date logic added recently.

### 4. **Form Validation Pattern**
Modal validations in `CrearCita()` (~line 380):
1. All fields required (check for empty strings)
2. Email regex: `/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/`
3. DNI regex: `/^\d{8}(?:[-\s]\d{4})?$/` (Peruvian 8-digit)
4. Políticas checkbox must be checked
5. TipoSeguro must be a valid number (not NaN)

All validations use `alert()` (not Swal) before form submission.

## API Integration Reference

| Endpoint | Method | Purpose | Response |
|----------|--------|---------|----------|
| `/api/Especialidades` | GET | Load specialties | `Array<{id_especialidad, Especialidad, emoji}>` |
| `/api/MedicosEspecialidad/{id}` | GET | Doctors by specialty | `Array<{id_medico, Nombres, Apellidos, Especialidad, CMP}>` |
| `/api/HorariosMedico/{id}` | GET | All slots for doctor | `Array<{id_horario, FechaHorario, Hora, Cupos}>` |
| `/api/HorariosMedicoFecha` | POST | Slots for specific date | Request: `{fecha, id_medico}` |
| `/api/Citas` | POST | Create appointment | Request: `{id_Horario, PacienteNombres, ...}` → Response: `{id, ...}` |

**Important**: Check `result.id > 0` to confirm successful appointment creation (line ~420).

## CSS Organization & Responsivity

- **Doctors.css**: Main styles, logo responsive (540px desktop → 192px mobile)
- **Calendario.css**: Calendar grid + state classes (`available`, `selected`, `past`)
- **Citas.css**, **FrmPaciente.css**, **Modal.css**, **Footer.css**: Component styles
- **Breakpoints**: Use `@media (max-width: 480px)` and `(max-width: 768px)` for mobile tweaks
- **Tuerca (Admin Gear)**: Hidden on mobile via `(hover: none)` media query; visible on desktop hover

## Developer Workflows

### Local Testing
1. Serve files locally (e.g., `python -m http.server` or VS Code Live Server)
2. Check browser console for errors; API responses logged via `console.log(result)`
3. SweetAlert confirmations appear after successful appointment

### Adding Features
- **New View**: Add `<div id="name-view" class="view">` and `showView('name')` call
- **New API Endpoint**: Fetch from Render, handle `async/await`, validate response length
- **New Styling**: Add to appropriate CSS file; test at all 4 breakpoints (use DevTools device emulation)

## Project-Specific Conventions

1. **Naming**: camelCase for JS variables (e.g., `PacienteNombres`), kebab-case for CSS classes (e.g., `doctor-card`)
2. **Modal Handling**: Use SweetAlert2 `Swal.fire()` for confirmations only; use `alert()` for validation errors
3. **HTML IDs**: Prefixed with intent: `txt*` (text inputs), `grid-*` (containers), `*-view` (view containers)
4. **Error Messages**: Use `alert()` for client errors; log API errors to console with `console.error()`
5. **Legacy Code**: `js/Horario.js` is unused; Views folder contains demo copies—focus on `index.html`

## Known Limitations & Security Notes

- **No backend validation**: All validation is client-side—implement server-side checks before production
- **No authentication**: Admin access via hidden footer tuerca; implement real auth (JWT, OAuth) for production
- **No CSRF protection**: Add CSRF tokens when moving to production
- **Hardcoded API URLs**: Consider environment variables for different deployment stages
- **Mobile tuerca hidden**: Intentional UX choice; adjust media queries if needed

## Files to Understand First

1. [index.html](../index.html) - Entire app (600+ lines, all JS inline)
2. [css/Doctors.css](../css/Doctors.css) - Layout + responsive logo
3. [css/Calendario.css](../css/Calendario.css) - Calendar state classes
4. [ANALISIS_PROYECTO.md](../ANALISIS_PROYECTO.md) - Comprehensive project analysis (use for reference)

## Common Modifications

- **Change API host**: Replace `https://api-rest-ventas.onrender.com` with your backend URL
- **Adjust responsivity**: Modify breakpoint values in CSS media queries
- **Add specialty icons**: Update emoji in specialty objects from API response
- **Modify modal fields**: Add/remove inputs in `.modal-body`; update validation logic in `CrearCita()`
