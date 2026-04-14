# 🚀 UDO Social - Frontend Application

Bienvenido al frontend de **UDO Social**, la interfaz de usuario diseñada para ofrecer una experiencia fluida y moderna a la comunidad universitaria. Esta aplicación web actúa como el puente visual entre los usuarios y el backend, gestionando la autenticación, la navegación y la presentación de contenido multimedia.

---

## 🛠 Stack Tecnológico
* **Framework:** Next.js con React
* **Lenguaje:** TypeScript
* **Estilos:** Tailwind CSS
* **HTTP Client:** Axios
* **Linting:** ESLint

---

## 📖 Descripción de la Aplicación
La arquitectura sigue un enfoque de **Cliente Seguro**:
1. **Usuario:** Interactúa con la interfaz web a través de formularios y navegación.
2. **Aplicación (Next.js):** Maneja el estado local, valida inputs del lado cliente, y realiza peticiones autenticadas al backend mediante cookies HttpOnly.
3. **Backend (Express):** Procesa las solicitudes, valida sesiones y devuelve datos estructurados.

Esta estructura garantiza una separación clara entre la lógica de presentación y la lógica de negocio, manteniendo la seguridad y la escalabilidad.

---

## 🏗 Arquitectura de Páginas y Componentes
Para mantener la consistencia y la escalabilidad, todas las páginas y componentes deben cumplir con los siguientes estándares:

### Reglas de Construcción:
* **Tipado Estricto:** Es obligatorio el uso de interfaces de TypeScript para definir props de componentes y estados.
* **Nomenclatura:** Los archivos de páginas se nombran en **singular e inglés** dentro de `/app` (Ej: `page.tsx`, `layout.tsx`).
* **Componentes:** Usar PascalCase para nombres de componentes y archivos (Ej: `UserCard.tsx`).
* **Estilos:** Aplicar Tailwind CSS con clases utilitarias, evitando estilos inline cuando sea posible.
* **Estado Global:** Gestionar estado compartido mediante hooks personalizados o contextos de React.

---

## 🤝 Guía de Colaboración (Git & GitHub)

Para mantener un historial de cambios limpio y evitar conflictos de código, aplicamos el flujo de trabajo **Feature Branching**.

### 1. Sincronización Inicial
Antes de comenzar cualquier tarea, asegúrate de estar en la rama principal y tener la última versión:
```bash
git checkout main
git pull origin main
2. Creación de Ramas
Nunca trabajes directamente sobre main. Crea una rama con un nombre descriptivo según la naturaleza del cambio:

**feature/**nombre-de-la-mejora (Nuevas funcionalidades)

**fix/**nombre-del-error (Corrección de fallos)

**docs/**cambio-leeme (Cambios en documentación)

Bash
git checkout -b feature/interfaz-comentarios
3. Commits Atómicos
Realiza commits pequeños, frecuentes y con mensajes descriptivos:

Bash
git add .
git commit -m "feat: implement user comment interface in feed"
4. Sincronización antes del Push
Para evitar conflictos en la nube, es obligatorio traer los últimos cambios de main a tu rama local antes de subir tu trabajo:

Bash
# Traer cambios de la rama principal
git pull origin main

# Resolver conflictos manualmente si aparecen, luego:
git push origin feature/interfaz-comentarios
5. Pull Requests (PR)
Una vez subida la rama, sigue este proceso en GitHub:

Ve al repositorio en GitHub y abre un Pull Request.

Descripción: Detalla brevemente qué cambios introduce tu código y si afecta a la estructura de componentes o rutas.

Review: Solicita la revisión de al menos un colaborador.

Merge: No realices el Merge hasta que el código haya sido aprobado.

📋 Estándares de Código
Para mantener la legibilidad y coherencia en todo el proyecto, aplicamos las siguientes reglas:

Variables y Funciones: Usar camelCase (ej: handleSubmit).

Componentes y Clases: Usar PascalCase (ej: UserProfile).

Hooks: Prefijar con "use" (ej: useAuth).

Manejo de Errores: Utilizar try/catch en funciones asíncronas y mostrar mensajes de error amigables al usuario.

Variables de Entorno: Nunca subas el archivo .env.local al repositorio. Si agregas una variable nueva, actualiza el archivo .env.example.

[!NOTE]

Esta aplicación utiliza Axios configurado para manejar cookies automáticamente. Las peticiones al backend incluyen credenciales para mantener la autenticación a través de sesiones HttpOnly. El proxy configurado facilita el desarrollo local conectándose al servidor Express.
