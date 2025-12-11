# MovieApp

A full-stack movie application built with React (frontend) and Node.js/Express (backend). Users can browse, search, and view movie details, while admins can add and edit movies. Features user authentication and role-based access.

## Features

- **User Authentication**: Register, login, and logout with JWT tokens
- **Movie Browsing**: View popular movies on the home page
- **Search Functionality**: Search movies by title
- **Movie Details**: Detailed view of individual movies
- **Admin Panel**: Add new movies and edit existing ones (admin only)
- **Responsive Design**: Mobile-friendly UI with Material-UI
- **Protected Routes**: Role-based access control

## Tech Stack

### Frontend
- React 18
- Vite (build tool)
- Material-UI (components)
- React Router (navigation)
- Axios (API calls)
- Framer Motion (animations)

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT (authentication)
- bcryptjs (password hashing)
- CORS (cross-origin requests)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd movie-app
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```

## Configuration

1. **Backend Environment Variables:**
   Create a `.env` file in the `backend` directory:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/movieapp
   JWT_SECRET=your_jwt_secret_here
   ```

2. **Database Seeding (Optional):**
   To populate the database with sample movies:
   ```bash
   cd backend
   npm run seed
   ```

   The seed script (`seed/seedMovies.js`) generates 250 sample movies with:
   - Titles: "Top Movie 1" through "Top Movie 250"
   - Years: Random years starting from 1970
   - Ratings: Random ratings between 8.0 and 9.5
   - Durations: Varying from 100 to 160 minutes
   - Descriptions: Placeholder descriptions for each movie
   - Posters: Random placeholder images from Picsum
   - IMDb Rank: Sequential ranking from 1 to 250

   This provides a large dataset for testing search and browsing functionality.

## Running the Application

1. **Start the Backend:**
   ```bash
   cd backend
   npm run dev  # For development (with nodemon)
   # or
   npm start    # For production
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (default Vite port)

3. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Movies
- `GET /api/movies` - Get all movies (with optional search query)
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Add new movie (admin only)
- `PUT /api/movies/:id` - Update movie (admin only)
- `DELETE /api/movies/:id` - Delete movie (admin only)

## Project Structure

```
movie-app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── role.js
│   ├── models/
│   │   ├── Movie.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── movies.js
│   ├── seed/
│   │   └── seedMovies.js
│   ├── utils/
│   │   └── errorHandler.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js
│   │   ├── components/
│   │   │   ├── MovieCard.jsx
│   │   │   ├── MovieDetails.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── AuthProvider.jsx
│   │   ├── pages/
│   │   │   ├── AdminAdd.jsx
│   │   │   ├── AdminEdit.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Search.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
