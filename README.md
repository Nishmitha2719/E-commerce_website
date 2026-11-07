# 🛍️ E-Commerce Platform

A full-stack e-commerce web application designed to provide a seamless online shopping experience with product browsing, user authentication, shopping cart management, order processing, and administrative controls.

The platform combines a responsive frontend with a robust backend to support customers and administrators through an intuitive interface.

## ✨ Features

### 👤 User Features
- User registration and secure login.
- Browse and explore available products.
- View detailed product information.
- Add and remove products from the shopping cart.
- Manage shopping cart quantities.
- Place and manage orders.
- Responsive shopping interface.

### 🛒 Product Management
- Dynamic product listings.
- Product categorization and organization.
- Product image uploads.
- Product details and pricing management.
- Inventory management.

### 🔐 Admin Dashboard
- Administrative authentication.
- Add, update, and delete products.
- Manage product inventory.
- View and manage customer orders.
- Centralized product and order management.

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, JavaScript, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| File Uploads | Multer |
| API Communication | REST APIs |
| Development Tools | Git, GitHub, VS Code |

## 📁 Project Structure

```text
E-commerce/
│
├── Backend/
│   ├── upload/
│   │   └── images/
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
├── admin/
│
├── README.md
└── .gitignore
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd E-commerce
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` directory:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=4000
```

Replace the placeholder values with your actual configuration.

Start the backend server using the start script defined in `package.json`:

```bash
npm start
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm start
```

If your frontend uses a different development command, use the corresponding script from its `package.json`.

### 4. Admin Panel Setup

Navigate to the `admin` directory and install its dependencies if it has a separate `package.json`.

```bash
cd admin
npm install
```

Start the admin application using its configured development script.

## 🔑 Environment Variables

The backend requires the following environment variables:

| Variable | Description |
|---|---|
| `MONGO_URL` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key used for JWT authentication |
| `PORT` | Backend server port |

**Security:** Never commit `.env` files, database credentials, or secret keys to GitHub.

## 🗄️ Database

MongoDB is used as the primary database, with Mongoose providing object modeling and database interaction.

The database supports application data such as:
- User accounts.
- Product information.
- Shopping cart data.
- Customer orders.
- Inventory information.

## 🚀 Application Highlights

- Full-stack architecture with separate frontend and backend applications.
- RESTful API-based communication.
- MongoDB database integration.
- JWT-based authentication.
- Image upload handling using Multer.
- Responsive user interface.
- Dedicated administrative functionality.

## 🔮 Future Enhancements

- Advanced product recommendations.
- Enhanced product search and filtering.
- Order tracking and notifications.
- Improved payment gateway integration.
- Personalized shopping experience.
- Product reviews and ratings.

## 👩‍💻 Author

**Nishmitha Shetty**

B.Tech – Artificial Intelligence and Data Science

Interested in Full-Stack Development, Artificial Intelligence, and Machine Learning.

---

⭐ If you find this project interesting, consider giving the repository a star!
