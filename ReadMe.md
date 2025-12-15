# Blog app API
> ## Task Description

>Day 1-2: Requirement Analysis 
## Understand Requirements:  
<h2 style="text-align:center;">Core Features and Functionalities</h2>

- User Authentication & Authorization: Users must be able to sign up, log in, and manage their profiles. Different user roles (e.g., user, admin) will have different permissions (e.g., user can only create/edit/delete own posts).

- Content Management (Posts): The ability to create, read, update, and delete (CRUD) blog posts. Posts should support titles, content, categories, tags, status (draft/published), author information, and publication dates.

- Comment Management: A system for readers to post comments on blog posts. This may include features like comment moderation, replies (nesting), and linking comments to specific users or posts.

#
<h2 style="text-align:center;">Define API Endpoints</h2>
  - List the endpoints required for blog post and comment management (e.g., /posts, /posts/{id}, 
/comments, /comments/{id})


| URL (Path) | HTTP Method | Description |
| --- | --- | --- |
| /api/posts | GET | Retrieve a list of all published blog posts (supports filtering, sorting, and pagination). |
| /api/posts | POST | Create a new blog post (requires authentication). |
| /api/posts/{id} | GET | Retrieve a specific blog post by its unique ID. |
| /api/posts/{id} | PUT | Update an existing blog post (requires authentication/authorization). |
| /api/posts/{id} | DELETE | Delete a specific blog post (requires authentication/authorization). |

# 
# Comment Endpoints
- Comments are typically nested under the related blog post to show the hierarchical relationship: 

| URL (Path) | HTTP Method | Description |
| --- | --- | --- |
| /api/posts/{id}/comments | GET | Retrieve all comments for a specific blog post. |
| /api/posts/{id}/comments | POST | Add a new comment to a specific blog post (may require authentication). |
| /api/comments/{commentId} | GET | Retrieve a specific comment by its unique ID. |
| /api/comments/{commentId} | PUT | Update a specific comment (requires authentication/authorization). |
| /api/comments/{commentId} | DELETE | Delete a specific comment (requires authentication/authorization/moderation rights). |

# 
> Day 3–5: Database Design & Implementation
# 1. Database Setup
- For this project, I used MongoDB as the database.
- I configured the connection using Mongoose in the backend and created the required collections for users, posts, and comments.

# 2. Schema Design
  > Users Collection
  - Stores all user-related information including authentication details.

- Fields:
  - username
  - email
  - password
  - role (user or admin)

> Posts Collection
- Stores blog posts created by users.
- Fields:
  - title
  - content
  - author (ObjectId → User)
  - createdAt
  - updatedAt

> Comments Collection
- Stores comments made on posts.
- Fields:
  - postId (ObjectId → Post)
  - author (ObjectId → User)
  - content
  - createdAt

# 3. Relationships
- One User → Many Posts
- One Post → Many Comments
- One User → Many Comments

Relationships are created using ObjectId references in MongoDB.