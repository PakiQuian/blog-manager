## **Prueba técnica — Fullstack Developer Trainee / Junior**

  
**Plazo de entrega:** 7 días calendario  
**Entrega obligatoria:** repositorio en GitHub  
**Entrega opcional:** enlace a una versión desplegada

### **Objetivo**

Crear una aplicación web simple para gestionar artículos de blog. Buscamos evaluar cómo resolvés un problema de producto de punta a punta: interfaz, formularios, autenticación, API, persistencia y manejo de datos.

Priorizamos una solución clara, funcional y bien explicada por encima de una solución con muchas funcionalidades adicionales.

### **Uso de IA**

Podés utilizar herramientas de IA durante toda la prueba.

Incluí en el [README.md](http://README.md) las herramientas/modelos utilizados y una breve explicación de para qué los usaste. Esto no afecta negativamente la evaluación; nos interesa entender tu proceso de trabajo.

### **Funcionalidades requeridas**

#### **Autenticación**

- Registro de usuario con email y contraseña.
- Inicio y cierre de sesión.
- Protección de las rutas privadas.
- Usar **Better Auth**.
- No es necesario implementar verificación de email, recuperación de contraseña ni proveedores sociales.

#### **Artículos**

Cada usuario autenticado debe poder:

- Crear un artículo con:
  - título;
  - contenido;
  - URL de imagen de portada opcional.
- Ver el listado de sus propios artículos.
- Editar y eliminar únicamente sus propios artículos.
- Ver el detalle de un artículo, incluyendo nombre del autor y fecha de creación.
- Navegar el listado de sus artículos con paginación.

#### **Página pública**

Crear una página principal que muestre:

- Los autores registrados.
- La cantidad de artículos creados por cada autor.
- Un buscador de artículos.

La búsqueda debe ejecutarse desde el servidor y permitir encontrar artículos por:

- título;
- contenido;
- nombre del autor.

### **Requisitos técnicos**

- **Frontend:** React, TypeScript, Vite y HeroUI ([https://heroui.com/](https://heroui.com/)).
- **Datos y routing:** TanStack Query y TanStack Router ([https://tanstack.com/](https://tanstack.com/)).
- **Formularios:** TanStack Form ([https://tanstack.com/](https://tanstack.com/)).
- **Backend:** API con Hono ([https://hono.dev/](https://hono.dev/)).
- **Validación:** Zod, tanto en formularios como en la API ([https://zod.dev/](https://zod.dev/)).
- **Base de datos:** MongoDB, usando driver nativo ([https://www.mongodb.com/es/docs/drivers/node/current/](https://www.mongodb.com/es/docs/drivers/node/current/)).
- **Autenticación:** Better Auth ([https://better-auth.com/](https://better-auth.com/)).

  


Podés organizar frontend y backend como prefieras, siempre que el proyecto pueda ejecutarse siguiendo las instrucciones del README.

### **Consideraciones importantes**

- Las operaciones de edición y eliminación deben validar del lado del servidor que el artículo pertenece al usuario autenticado.
- Los errores de formulario y de API deben mostrarse de forma comprensible.
- La interfaz debe funcionar correctamente en desktop y mobile.
- Incluí un archivo .env.example sin credenciales reales.
- El repositorio debe contar con instrucciones claras de instalación, variables de entorno y ejecución local.

### **Adicionales opcionales**

Estos puntos no son necesarios para completar la prueba, pero pueden sumar si están bien resueltos:

- Filtros o estado de búsqueda reflejado en la URL.
- Estados de carga, vacío y error especialmente cuidados.
- Seed de datos para facilitar la revisión.
- Despliegue funcional.
- Mejoras de accesibilidad.
- Diseño visual más trabajado.

### **Criterios de evaluación**

- Solución funcional y alcance completo.
- Tipado y modelado de datos coherentes.
- Validaciones con Zod.
- Protección correcta de operaciones privadas.
- Uso razonable de TanStack Query: consultas, mutaciones e invalidación de caché.
- Código claro, ordenado y fácil de mantener.
- Manejo de estados de carga, error y listas vacías.
- Calidad del README y de las decisiones explicadas.
- Capacidad de priorizar: preferimos los requerimientos principales bien resueltos antes que extras incompletos.

### **Entrega**

1. Repositorio público o con acceso compartido en GitHub.
2. [README.md](http://README.md) con instrucciones de instalación y ejecución.
3. Archivo .env.example.
4. Si realizaste un despliegue, enlace a la aplicación.

**Éxitos.**

  
