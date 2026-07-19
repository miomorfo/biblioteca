# 📚 Mi Biblioteca

Catálogo público de mi biblioteca física para que mis familiares y amigos puedan ver qué libros tengo y pedirme uno prestado.

🔗 **Ver la biblioteca:** https://miomorfo.github.io/biblioteca/

## Cómo funciona

El sitio muestra todos mis libros con su edición, género y estado actual:
- 🟢 **Disponible** — Lo tengo y podés pedirlo
- 🔴 **Prestado** — Alguien lo tiene, fijate en las notas quién
- 🟠 **Reservado** — Ya está apartado para alguien

Incluye buscador por título/autor/género y filtros por estado.

## Cómo agregar o editar libros

Editar el archivo `data/books.json`. Cada libro tiene esta estructura:

```json
{
  "id": 6,
  "title": "Nombre del libro",
  "author": "Nombre del autor",
  "edition": "Edición, editorial, año",
  "genre": "Género",
  "status": "Disponible",
  "notes": ""
}
```

Después de hacer push, el sitio se actualiza solo en unos minutos.
