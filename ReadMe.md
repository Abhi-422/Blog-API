# Blog App API

A robust RESTful API built with Node.js, Express, and MongoDB, featuring secure JWT authentication and full CRUD functionality for users, posts, and comments.

## 🚀 Features

- **Authentication:** Secure Signup, Login, and Logout using JWT and Cookies.
- **User Management:** Profile retrieval and secure password handling.
- **Post System:** Create, Read, Update, and Delete posts.
- **Comment System:** Interactive commenting on specific posts with ownership checks.
- **Security:** Protected routes using a custom `verifyJWT` middleware.
- **Reliability:** Comprehensive Unit and Integration testing using Jest and Supertest.

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Security:** JSON Web Tokens (JWT) & bcrypt
- **Testing:** Jest, Supertest, MongoDB Memory Server

## 📋 Prerequisites

- [Node.js](nodejs.org) installed (v24 or higher recommended)
- [MongoDB Atlas](www.mongodb.com) account or local MongoDB instance

## ⚙️ Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abhi-422/Blog-API.git
   cd ./Backend/

2.  **Install dependencies:**
    ```bash
    npm install
3.  Configure Environment Variables:  
    Create a `.env` file in the root directory and add the following:
    
    env

        PORT=8000
        MONGODB_URI=your_mongodb_connection_string
        CORS_ORIGIN=*
        ACCESS_TOKEN_SECRET=your_access_token_secret
        ACCESS_TOKEN_EXPIRY=15m
        REFRESH_TOKEN_SECRET=your_refresh_token_secret
        REFRESH_TOKEN_EXPIRY=7d
        
    
    Use code with caution.
    
4.  Run the Server:
    
    ```bash
    # Development mode
    npm run dev
    
    # Production mode
    npm start
            
Use code with caution.
    

🧪 Testing

- To run the automated test suite (Unit & Integration tests):

    ```bash
    npm test
Use code with caution.

📡 API Endpoints

Authentication

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/api/v1/user/register` | Register a new user | No |
| POST | `/api/v1/user/login` | Login and get tokens | No |
| POST | `/api/v1/user/logout` | Logout and clear cookies | Yes |

Posts

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| GET | `/api/v1/post` | Get all posts | No |
| POST | `/api/v1/post` | Create a new post | Yes |
| GET | `/api/v1/post/:id` | Get post by ID | No |
| PUT | `/api/v1/post/:id` | Update post (Owner only) | Yes |
| DELETE | `/api/v1/post/:id` | Delete post (Owner only) | Yes |

Comments

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| GET | `/api/v1/comment/post/:postId` | Get all comments for a post | No |
| POST | `/api/v1/comment/post/:postId` | Add a comment to a post | Yes |
| GET | `/api/v1/comment/:commentId` | Get comment BY Id | No |
| PUT | `/api/v1/comment/:commentId` | Add a comment to a post | Yes |
| DELETE | `/api/v1/comment/:commentId` | Delete a comment | Yes |

🔐 How to use Authentication

For protected routes, the API expects a JWT token. This is primarily handled via Cookies (`accessTocken`). If using a client that doesn't support cookies, you can provide the token in the header:

text

    Authorization: Bearer <your_access_token>
    

Use code with caution.

📄 Documentation

You can find the detailed request/response schemas in the [Postman Documentation](https://mystudy422-7691377.postman.co/workspace/Abhishek-Patange's-Workspace~3350f12a-5617-41ea-8a97-fa7e63b2325e/collection/50779629-ac89d111-24fa-406a-a61a-eba5ea8a9e40?action=share&source=copy-link&creator=50779629).

    
### Final Step: Commit the Documentation
    
Once you've saved the file, run this final command:

```bash
git add README.md
git commit -m "docs: Add comprehensive README and user guide"