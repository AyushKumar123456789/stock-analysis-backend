## Stock Analysis Service

This is a full-stack project that provides a service where users can access knowledge about stocks, including which stocks to invest in and their analysis. The application includes role-based authentication, allowing an editor to add and manage content, while general users can view the information.

---

## Backend

### Overview

The backend is built using Node.js, Express, and MongoDB. It includes features for user authentication, role management, and stock data handling.

### Features

-   User registration and login
-   Role-based access control (editor and user) but user can't choose role while registering it should be decide by the database admin.
-   CRUD operations for stock data
-   JWT-based authentication
-   User can read limited number of articles without login (still to be implemented)
-   For Full access have to buy premium subscription (still to be implemented) which will be handled by stripe payment gateway.
-   Show view count of each article (still to be implemented)
-   User can add comments to the article (still to be implemented)
-   User can add articles to their favourite list (still to be implemented)
-   User can share the article on social media (still to be implemented)
-   User can download the article in pdf format (still to be implemented)
-   Images, pdfsa, Excel files can be attached to the article (still to be implemented)

### Prerequisites

-   Node.js
-   MongoDB

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

-   **POST** `/api/users/register` - Register a new user
-   **POST** `/api/users/login` - Login a user
-   **GET** `/api/health` - Health check endpoint , used to check if the server is running
-   **GET** `/api/users/registerbymail` - Register a new user by mail validation
-   **POST** `/api/stocks` - Create a new stock (Editor only)
-   **GET** `/api/stocks` - Get all stocks

### Directory Structure

```
backend/
├── config/
│   └── db.js
├── controllers/
|   ├── healthCheckController.js
│   ├── stockController.js
│   └── userController.js
├── middleware/
│   └── auth.js
|   └── multer.middleware.js
|   └── validator.middleware.js
├── models/
|   ├── validation/
|   |    └──login.validation.schema.js
|   |    └──register.validation.schema.js
│   ├── stock.model.js
│   └── user.model.js
├── routes/
│   ├── healthCheckRoutes.js
│   ├── stockRoutes.js
│   └── userRoutes.js
├── util/
│   └── nodemailer.js
|       └── EmailValidation.js
|   └── cloudinary.js
|   └── constants.js
|   └── validator.js
├── .env
├── package.json
└── server.js
```

---

### To Do

-   Create a database digram for the MongoDB database , what i want to implement is that editor was allowed to add information it sort of like blogs and create differne sections attach pdf which can be viewd by the user.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

---

By following these instructions, you should be able to set up and run both the backend and frontend for the Stock Analysis Service. Feel free to contribute to the project to make it better!
