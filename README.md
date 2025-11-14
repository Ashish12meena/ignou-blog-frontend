# Bloggera - React Frontend

A modern blogging platform built with React, Vite, and Tailwind CSS.

## Features

- ✅ User Authentication (Login/Register)
- ✅ Create, Read, Update, Delete Posts
- ✅ Like/Unlike Posts
- ✅ Comment on Posts
- ✅ Follow/Unfollow Users
- ✅ Bookmark Posts
- ✅ Search Functionality
- ✅ Category Management
- ✅ Responsive Design
- ✅ Redux State Management
- ✅ Comprehensive Logging

## Tech Stack

- **React 19** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS 4** - Styling
- **Redux Toolkit** - State Management
- **React Router DOM 7** - Routing
- **Axios** - HTTP Client
- **Framer Motion** - Animations
- **React Icons** - Icons

## Prerequisites

- Node.js >= 20.19.0 or >= 22.12.0
- npm >= 8.0.0
- Spring Boot Backend running on port 8080

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd bloggera
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```bash
VITE_API_URL=http://localhost:8080
```

4. **Run the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── assets/          # Images and static files
├── components/      # Reusable components
│   ├── auth/       # Login and Register
│   ├── header/     # Sidebar navigation
│   ├── post/       # Post-related components
│   └── Skeleton/   # Loading skeletons
├── pages/          # Page components
├── redux/          # Redux store and slices
├── services/       # API service functions
│   ├── authService.js
│   ├── PostService.js
│   ├── likeService.js
│   ├── userService.js
│   ├── followService.js
│   └── CategoryService.js
└── App.jsx         # Main app component
```

## API Integration

All API calls are made through service files with comprehensive logging:

### Authentication
- `POST /auth/users/register` - Register new user
- `POST /auth/users/login` - Login user
- `POST /auth/users/logout` - Logout user

### Posts
- `POST /api/posts/cardDetails` - Get post cards
- `POST /api/posts/fullPostDetails` - Get full post
- `POST /api/posts/addPost` - Create new post
- `POST /api/posts/search` - Search posts

### Likes
- `POST /api/like/addlike` - Add like
- `POST /api/like/removelike` - Remove like
- `POST /api/like/likeStatus` - Check like status
- `POST /api/like/getCount` - Get like/comment count

### Follow
- `POST /api/follow/add` - Follow user
- `POST /api/follow/remove` - Unfollow user
- `POST /api/follow/status` - Check follow status

### Users
- `POST /api/users/userdetails` - Get user details

### Categories
- `POST /api/category/list` - Get categories

## Logging

All API calls include comprehensive logging:

```javascript
[AUTH INFO] User login attempt { username: 'john' }
[AUTH SUCCESS] User logged in successfully { userId: '123', username: 'john' }
[POST INFO] Fetching card details { userId: '123', excludedCount: 0 }
[POST SUCCESS] Card details fetched successfully { count: 10 }
```

## Error Handling

- Error Boundary for catching React errors
- Service-level error handling with logging
- User-friendly error messages
- Retry functionality

## Authentication Flow

1. User visits `/start` (Landing Page)
2. User clicks Login/Register
3. Upon successful authentication, user is redirected to `/home`
4. Token is stored in localStorage
5. All API calls include Authorization header

## State Management

Redux is used for global state management:

- `userSlice` - User authentication state
- `postSlice` - Posts data and pagination
- `scrollSlice` - Scroll position tracking

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Backend Requirements

This frontend requires a Spring Boot backend with the following endpoints. Ensure your backend is running on `http://localhost:8080` or update the `VITE_API_URL` in `.env`.

### Required Backend Endpoints:
- Authentication endpoints
- Post CRUD operations
- Like/Unlike functionality
- Follow/Unfollow functionality
- Comment functionality
- Category management

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.