
# Express.js API Documentation and Setup

This repository contains an Express.js-based API for user registration, login, profile fetching, and product management. The following documentation provides details on how to set up the project and use the various API endpoints.

---

## Table of Contents

1. [Project Setup](#project-setup)
2. [API Documentation](#api-documentation)
   - [Register](#register)
   - [Login](#login)
   - [Profile](#profile)
   - [Add Product](#add-product)
   - [Show Product](#show-product)
   - [Edit Product](#edit-product)

---

## Project Setup

### 1. Clone the Repository
Clone this repository to your local machine using the following command:

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies
Install all required dependencies:

```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root of the project and configure the necessary environment variables. Example `.env` file:

```bash
PORT=6001
DB_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your-jwt-secret-key
```

### 4. Start the Server
Start the Express server with the following command:

```bash
npm start
```

The API will be available at `http://localhost:6001`.

---

## API Documentation

### Register
**POST** `http://localhost:6001/web/user/register`

Registers a new user.

#### Request Body:
```json
{
    "name": "reshav gupta",
    "emailId": "reshavbajaj786@gmail.com",
    "contactNo": "7654101068",
    "password": "resh1234"
}
```

#### Response:
- **Success**: Returns a success message.
- **Failure**: Returns an error message if the user already exists.

### Login
**POST** `http://localhost:6001/web/user/login`

Logs in a user and returns a token.

#### Request Body:
```json
{
    "emailId": "peter.parker@gmail.com",
    "password": "pete1234"
}
```

#### Response:
- **Success**: Returns a JWT token.
- **Failure**: Returns an error message if the credentials are incorrect.

### Profile
**GET** `http://localhost:6001/web/user/profile`

Fetches the profile of the logged-in user.

#### Authorization:
- **Header**: `Authorization: Bearer <token>`

#### Response:
- **Success**: Returns user profile details.
- **Failure**: Returns an error if the user is not found.

### Add Product
**POST** `http://localhost:6001/web/product/add`

Adds a new product to the inventory.

#### Authorization:
- **Header**: `Authorization: Bearer <token>`

#### Request Body:
```json
{
    "name": "natraj pencil",
    "description": "Bold dark pencil strokes",
    "price": 4
}
```

#### Response:
- **Success**: Returns a success message.
- **Failure**: Returns an error message if the product already exists.

### Show Product
**GET** `http://localhost:6001/web/product/show`

Shows a list of products.

#### Query Parameters:
- **searchText**: (Optional) Text to search for products by name or description.
- **page**: (Optional) The page number.
- **limit**: (Optional) The number of items per page.

#### Response:
- **Success**: Returns a list of products.
- **Failure**: Returns an error message.

### Edit Product
**PUT** `http://localhost:6001/web/product/edit/<productId>`

Updates product details.

#### Authorization:
- **Header**: `Authorization: Bearer <token>`

#### Request Body:
```json
{
    "name": "updated product name",
    "description": "updated description",
    "price": 5
}
```

#### Response:
- **Success**: Returns a success message.
- **Failure**: Returns an error message if the product does not exist.
