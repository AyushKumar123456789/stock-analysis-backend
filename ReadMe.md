## Stock Analysis Service

This is a full-stack project that provides a service where users can access knowledge about stocks, including which stocks to invest in and their analysis. The application includes role-based authentication, allowing an editor to add and manage content, while general users can view the information.

---

## Backend

### Overview

The backend is built using Node.js, Express, and MongoDB. It includes features for user authentication, role management, and stock data handling.

### Features

- User registration and login
- Role-based access control (editor and user)
- CRUD operations for stock data
- JWT-based authentication

### Prerequisites

- Node.js
- MongoDB

### Getting Started

1. **Clone the Repository**

   ```sh
   git clone https://github.com/yourusername/stock-analysis-backend.git
   cd stock-analysis-backend
   ```

2. **Install Dependencies**

   ```sh
   npm install
   ```

3. **Setup Environment Variables**

   Create a `.env` file in the root directory and add the following:

   ```
   MONGO_URI=mongodb://localhost:27017/stockDB
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. **Run the Server**
   ```sh
   npm start
   ```

### API Endpoints

- **POST** `/api/users/register` - Register a new user
- **POST** `/api/users/login` - Login a user
- **POST** `/api/stocks` - Create a new stock (Editor only)
- **GET** `/api/stocks` - Get all stocks

### Directory Structure

```
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── stockController.js
│   └── userController.js
├── middleware/
│   └── auth.js
├── models/
│   ├── Stock.js
│   └── User.js
├── routes/
│   ├── stockRoutes.js
│   └── userRoutes.js
├── .env
├── package.json
└── server.js
```

---

### To Do

- Create a database digram for the MongoDB database , what i want to implement is that editor was allowed to add information it sort of like blogs and create differne sections attach pdf which can be viewd by the user.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

By following these instructions, you should be able to set up and run both the backend and frontend for the Stock Analysis Service. Feel free to contribute to the project to make it better!
