# ✨ AponVerse — Modern Blogging Platform

> **Write. Share. Explore. Connect.**

AponVerse is a modern full-stack blogging platform where users can create, publish, explore, like, and comment on articles. The platform provides a clean, responsive, and interactive experience with dedicated user features for managing posts and profiles.

---

## 🌐 Live Project

🚀 **Frontend:**
https://apon-blog-next-js-ts-postgre-sql.vercel.app

🔗 **Backend API:**
https://aponverse-postgresql-prisma-server.onrender.com

📦 **Backend Repository:**
https://github.com/AritraApon/AponVerse_postgreSQL_-_prisma_server

---

## 📸 About AponVerse

AponVerse is designed as a community-driven blogging platform where users can:

- ✍️ Write and publish blog posts
- 🔍 Explore and search published articles
- 🏷️ Filter posts by categories
- ❤️ Like posts
- 💬 Comment on articles
- 👤 Manage personal profiles
- 📝 Edit and delete their own posts
- 🖼️ Upload post and profile images
- 🌙 Switch between Dark and Light themes
- 📱 Enjoy a fully responsive experience

The interface is designed to feel simple, modern, and comfortable for both readers and writers.



## 🚀 Features

### 🔐 Authentication

- User Registration
- User Login
- User Logout
- JWT-based authentication
- Protected routes
- Persistent authentication state

---

### 🏠 Explore

The Explore page is the main feed of AponVerse.

Features include:

- Latest published posts
- Infinite scrolling
- Search posts
- Category filtering
- Horizontally scrollable category navigation
- Responsive post cards
- Smooth animations
- Loading states
- Empty states

---

### 📝 Create Post

Authenticated users can create new articles.

Features:

- Post title
- Rich article description
- Category selection
- Optional image upload
- Image preview before publishing
- ImgBB image hosting
- Publish post
- Form validation
- Toast notifications

---

### 📚 Post Details

Each article has a dedicated details page.

Users can see:

- Cover image
- Article title
- Full description
- Author information
- Category
- Published date
- Like/reaction count
- Comments
- Comment form

The complete post card is clickable and navigates directly to the article details page.

---

### 📂 My Posts

Users can manage all of their own articles from the My Posts dashboard.

Features:

- Server-side pagination
- Post overview cards
- Edit post
- Delete post
- Delete confirmation modal
- Edit post modal
- Post details navigation
- Loading and empty states

---

### 👤 Profile

Users have their own profile page.

Profile features:

- Profile information
- Profile image
- Bio
- Email
- Edit profile
- Change profile image
- Logout

Profile editing is handled through a modal for a smooth user experience.

---

### ❤️ Reactions

Users can interact with posts through reactions.

- Like/unlike posts
- Reaction count
- Authentication-protected reactions
- Real-time UI updates

---

### 💬 Comments

Users can participate in discussions under articles.

Features:

- Add comments
- View comments
- Delete own comments
- Authentication-protected commenting
- Comment count

---

### 🏷️ Categories

Posts can be organized using categories.

Users can:

- View available categories
- Filter Explore posts by category
- Select categories while creating/editing posts
- Horizontally scroll through categories on smaller screens

---

## 🎨 UI / UX

AponVerse focuses on a clean and modern user experience.

### Theme

- 🌙 Dark Mode
- ☀️ Light Mode
- Persistent theme preference
- Responsive theme toggle
- Consistent colors across the application

### Design

- Modern dashboard
- Clean typography
- Responsive cards
- Smooth transitions
- Framer Motion animations
- Toast notifications
- Modal-based editing
- Loading states
- Empty states
- Mobile-friendly navigation

> **Orange is intentionally avoided in the visual identity.**

---

## 📱 Responsive Design

AponVerse is fully responsive and optimized for:

- 💻 Desktop
- 💻 Laptop
- 📱 Tablet
- 📱 Mobile
- 📱 Small-screen devices

On desktop, users get a sidebar-based dashboard experience.

On mobile and small devices, the application uses a compact navigation experience inspired by modern social platforms.

---
## 📸 Screenshots

### 🏠 Explore Page

![AponVerse Explore Page](https://i.ibb.co.com/CjpRxdy/image.png)

---

### 📝 Create Post

![AponVerse Create Post](https://i.ibb.co.com/v4WHn1Xn/image.png)

---

### 📚 My Posts

![AponVerse My Posts](https://i.ibb.co.com/twL5hvdx/image.png)

---

### 👤 Details Page

![AponVerse Profile](https://i.ibb.co.com/XrYVsmp3/image.png)

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js | React framework |
| React | UI development |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| React Toastify | Notifications |
| React Icons | Icons |

### Backend

The frontend communicates with a separate REST API built with:

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Image Hosting

- ImgBB

---

## 🗂️ Project Structure

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   │
│   ├── dashboard/
│   │   ├── explore/
│   │   ├── create-post/
│   │   ├── my-posts/
│   │   └── profile/
│   │
│   ├── posts/
│   │   └── [id]/
│   │
│   └── ...
│
├── actions/
│   ├── authAction.ts
│   ├── postAction.ts
│   ├── categoryAction.ts
│   ├── commentAction.ts
│   ├── reactionAction.ts
│   └── userAction.ts
│
├── lib/
│   ├── auth.ts
│   └── ...
│
├── components/
│   ├── Navbar
│   ├── Sidebar
│   ├── PostCard
│   ├── PostModal
│   ├── CommentSection
│   └── ...
│
└── ...

```
### .env
```
 NEXT_PUBLIC_API_URL=https://aponverse-postgresql-prisma-server.onrender.com
```
```
NEXT_PUBLIC_IMGBB_URI=your_imgbb_api_key

```
---
- Clone the repository:
```
git clone <your-frontend-repository-url>
```
- Go to the project directory:
```
cd AponVerse
```
- Install dependencies:
```
npm install
```
- Create your environment file:
```
.env.local
```

Add the required environment variables.

### ▶️ Run Development Server
```
npm run dev
```
The application will run on:
```
http://localhost:3000
```
---
---

### 🏗️ Production Build

Create a production build:
```
npm run build
```
Run the production server:
```
npm start
```
---
---
### 🔄 Application Flow
```
User
 │
 ├── Register
 │
 ├── Login
 │
 ▼
Dashboard
 │
 ├── Explore
 │    ├── Search
 │    ├── Categories
 │    ├── Infinite Scroll
 │    └── Post Details
 │
 ├── Create Post
 │    ├── Image Upload
 │    ├── Image Preview
 │    └── Publish
 │
 ├── My Posts
 │    ├── Pagination
 │    ├── Edit
 │    └── Delete
 │
 └── Profile
      ├── Edit Profile
      ├── Profile Image
      └── Logout
```
---
### 🔌 API Integration

The frontend communicates with the AponVerse REST API.

- Base URL:
```
https://aponverse-postgresql-prisma-server.onrender.com
```
- Main API resources:
```
/api/auth
/api/users
/api/posts
/api/categories
/api/comments
/api/reactions
````
- The frontend uses these APIs for authentication, posts, categories, comments, reactions, and profile management.
---
---
### ✨ User Experience

- AponVerse provides a smooth experience through:

- ⚡ Fast navigation
- 🔄 Infinite scrolling
- 📄 Server-side pagination
- 🔎 Search and filtering
- 🎞️ Smooth animations
- 🔔 Toast notifications
- 🌓 Dark/Light theme
- 📱 Mobile-first responsiveness
- 🖼️ Image preview
- 🪟 Modal-based editing
- 🔐 Protected user actions
- 🔮 Future Improvements
---

### Possible future improvements include:

- 🔖 Bookmark/save posts
- 🔔 Notification system
- 👥 Follow authors
- 📊 User analytics
- 🖊️ Rich text editor
- 🔎 Advanced search
- 🧑‍🤝‍🧑 User discovery
- 🏆 Trending articles
- 📈 Popular authors
- 🏷️ Multiple tags per post
---
---

### 👨‍💻 Developer
#  Aritro Mazumdar

Web Developer

- Passionate about building modern, scalable, and user-friendly web applications using modern JavaScript technologies.
```
- Tech Interests
- Next.js
- React
- TypeScript
- Node.js
- Express.js
- PostgreSQL
- Prisma
- MongoDB
```
 ### ⭐ Support

If you like AponVerse, consider giving the repository a ⭐ on GitHub.

📄 License

This project is created for learning, portfolio, and demonstration purposes.

