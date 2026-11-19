# Library Books API Design

## List Books

- Method: GET
- Path: /books
- Description: Returns all books.
- Success Status: 200 OK

---

## Get One Book

- Method: GET
- Path: /books/{id}
- Description: Returns one book by ID.
- Success Status: 200 OK

---

## Create Book

- Method: POST
- Path: /books
- Description: Creates a new book.
- Request Body:

```json
{
  "title": "JavaScript Basics",
  "author": "John Smith",
  "year": 2025
}
```

- Success Status: 201 Created

---

## Update Book

- Method: PUT
- Path: /books/{id}
- Description: Updates an existing book.
- Request Body:

```json
{
  "title": "Advanced JavaScript",
  "author": "John Smith",
  "year": 2026
}
```

- Success Status: 200 OK

---

## Delete Book

- Method: DELETE
- Path: /books/{id}
- Description: Deletes a book.
- Success Status: 204 No Content

---

## List Books by Author

- Method: GET
- Path: /books?author=John%20Smith
- Description: Returns books written by a specific author.
- Success Status: 200 OK

---

# Error Codes

## 400 Bad Request

Example:

- Missing required title field when creating a book.

## 404 Not Found

Example:

- Requesting a book ID that does not exist.