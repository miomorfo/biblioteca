# 📚 Mi Biblioteca

Sitio web estático para compartir tu biblioteca física con familiares y amigos. Permite buscar libros por título, autor o género, y ver su estado (disponible, prestado o reservado).

## Cómo agregar o editar libros

Edita el archivo `data/books.json`. Cada libro tiene esta estructura:

```json
{
  "id": 6,
  "title": "Nombre del libro",
  "author": "Nombre del autor",
  "edition": "Descripción de la edición (editorial, año, etc.)",
  "genre": "Género literario",
  "status": "Disponible",
  "notes": ""
}
```

### Campos

| Campo | Descripción |
|-------|-------------|
| `id` | Número único para cada libro |
| `title` | Título del libro |
| `author` | Autor(es) |
| `edition` | Edición, editorial y año |
| `genre` | Género (Novela, Ensayo, Ciencia ficción, etc.) |
| `status` | Estado actual: `Disponible`, `Prestado` o `Reservado` |
| `notes` | Notas opcionales (a quién se prestó, etc.) |

## Despliegue en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo: `mi-biblioteca`)
2. Sube todos los archivos del proyecto:
   ```bash
   git init
   git add .
   git commit -m "Mi biblioteca personal"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/mi-biblioteca.git
   git push -u origin main
   ```
3. Ve a **Settings > Pages** en tu repositorio
4. En "Source", selecciona la rama `main` y carpeta `/ (root)`
5. Haz clic en **Save**
6. En unos minutos tu sitio estará disponible en: `https://TU_USUARIO.github.io/mi-biblioteca/`

## Estructura del proyecto

```
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos del sitio
├── js/
│   └── app.js          # Lógica de búsqueda y filtrado
├── data/
│   └── books.json      # Datos de tus libros
└── README.md           # Este archivo
```

## Personalización

- Cambia el título y subtítulo en `index.html`
- Modifica colores en las variables CSS al inicio de `css/styles.css`
- Agrega nuevos estados editando el select en `index.html` y los estilos correspondientes
