# Tsdey Activeware Backend

Node.js/Express backend for the **tsedey activeware** frontend.  
Provides authentication, role-based access (user/admin), and CRUD APIs for collections and items with Cloudinary-hosted images.

## Tech stack

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication with roles (`user`, `admin`)
- Cloudinary for image storage
- Multer for file uploads
- Helmet, CORS, Morgan for security/logging

---

## Setup

### 1. Install dependencies

```bash
cd Backend
npm install
```

### 2. Environment variables

Create a `.env` file inside `Backend` with:

```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Optional
PORT=5000
CLIENT_URL=http://localhost:5173
```

> Do **not** commit real secrets to git.

### 3. Run the server

Development (reload on changes):

```bash
npm run dev
```

Production-style:

```bash
npm start
```

Server defaults to `http://localhost:5000` unless `PORT` is set.

---

## Main endpoints (all prefixed by `/api`)

### Auth (`/api/auth`)

- **POST** `/api/auth/register`  
  Register a new user. The **first** registered user is automatically given the `admin` role (simple seeding).

  Request body:

  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

  Response:

  ```json
  {
    "success": true,
    "data": {
      "token": "jwt-token",
      "user": {
        "id": "...",
        "email": "user@example.com",
        "role": "admin",
        "createdAt": "..."
      }
    }
  }
  ```

- **POST** `/api/auth/login`  
  Log in existing user and receive JWT.

---

### Collections (`/api/collections`)

- **GET** `/api/collections` — list all collections (public).
- **GET** `/api/collections/:id` — get one collection by ID (public).
- **POST** `/api/collections` — create collection (**admin only**).
  - Headers: `Authorization: Bearer <token>`
  - Content-Type: `multipart/form-data`
  - Fields:
    - `name` (required)
    - `description` (optional)
    - `image` (optional file) → uploaded to Cloudinary
- **PUT** `/api/collections/:id` — update collection (**admin only**, optional image file).
- **DELETE** `/api/collections/:id` — delete collection (**admin only**, also deletes related items).

---

### Items

- **GET** `/api/collections/:collectionId/items` — list items in a collection (public).
- **GET** `/api/items/:id` — get single item (public).
- **POST** `/api/collections/:collectionId/items` — create item (**admin only**).
  - Headers: `Authorization: Bearer <token>`
  - Content-Type: `multipart/form-data`
  - Fields:
    - `name` (required)
    - `price` (required, number)
    - `description` (optional)
    - `inStock` (optional; boolean-like, e.g. `"true"` / `"false"`)
    - `image` (optional file) → uploaded to Cloudinary
- **PUT** `/api/items/:id` — update item (**admin only**, optional image file).
- **DELETE** `/api/items/:id` — delete item (**admin only**).

---

## Models

- **User**
  - `email` (string, unique, required)
  - `password` (hashed with bcrypt, required)
  - `role` (`"user"` or `"admin"`)
  - `createdAt`, `updatedAt`

- **Collection**
  - `name` (string, required)
  - `description` (string, optional)
  - `image` (string URL, Cloudinary, optional)
  - `createdBy` (ref to `User`, required, typically admin)
  - `createdAt`, `updatedAt`

- **Item**
  - `collection` (ref to `Collection`, required)
  - `name` (string, required)
  - `description` (string, optional)
  - `price` (number, required)
  - `inStock` (boolean, default `true`)
  - `image` (string URL, Cloudinary, optional)
  - `createdAt`, `updatedAt`

---

## Notes

- All admin-only routes require **both** JWT auth and admin role:
  - `Authorization: Bearer <token>` header
  - `user.role === "admin"`
- Errors are returned as:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

