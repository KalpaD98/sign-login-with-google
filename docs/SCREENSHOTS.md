# Application Screenshots

This document describes the key screens and features of the application.

## Login Screen

**URL:** `http://localhost:5173/`

The login screen features:
- Clean, modern design with gradient background (purple to blue)
- Centered card with "Welcome" heading
- "Sign in with your Google account" subtitle
- Google Sign-In button (blue, with Google logo)
- Responsive design that works on all screen sizes

**Visual Description:**
```
┌────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    [Gradient Background]                        │
│                                                                 │
│          ┌──────────────────────────────────────┐              │
│          │                                       │              │
│          │            Welcome                    │              │
│          │   Sign in with your Google account   │              │
│          │                                       │              │
│          │    ┌────────────────────────────┐    │              │
│          │    │  [G] Continue with Google  │    │              │
│          │    └────────────────────────────┘    │              │
│          │                                       │              │
│          └──────────────────────────────────────┘              │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

## Google OAuth Consent Screen

When clicking the sign-in button, Google's OAuth consent screen appears:
- Shows application name
- Lists requested permissions (email, profile, picture)
- User can select Google account
- User can allow or deny access

## User Profile Screen

**URL:** `http://localhost:5173/` (after successful login)

The profile screen displays:
- "User Profile" heading in purple
- Large circular profile picture (120px)
- Detailed user information in a bordered table:
  - Email address (with mail icon)
  - First name (with user icon)
  - Last name (with user icon)
  - Member since date (formatted as "Month Day, Year")
- Red "Logout" button at the bottom

**Visual Description:**
```
┌────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    [Gradient Background]                        │
│                                                                 │
│          ┌──────────────────────────────────────┐              │
│          │        User Profile                   │              │
│          │                                       │              │
│          │          ┌─────────────┐             │              │
│          │          │   Profile   │             │              │
│          │          │    Photo    │             │              │
│          │          └─────────────┘             │              │
│          │                                       │              │
│          │  ┌────────────────────────────────┐  │              │
│          │  │ 📧 Email    │ user@gmail.com  │  │              │
│          │  ├────────────────────────────────┤  │              │
│          │  │ 👤 First Name │ John         │  │              │
│          │  ├────────────────────────────────┤  │              │
│          │  │ 👤 Last Name  │ Doe          │  │              │
│          │  ├────────────────────────────────┤  │              │
│          │  │ Member Since │ January 1, 2024│  │              │
│          │  └────────────────────────────────┘  │              │
│          │                                       │              │
│          │  ┌────────────────────────────────┐  │              │
│          │  │       🚪 Logout               │  │              │
│          │  └────────────────────────────────┘  │              │
│          │                                       │              │
│          └──────────────────────────────────────┘              │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

## API Documentation

**URL:** `http://localhost:8000/docs`

FastAPI automatically generates interactive API documentation:
- Swagger UI interface
- List of all endpoints
- Try-it-out functionality
- Request/response schemas
- Authentication options

**Available Endpoints:**
- `GET /` - API information
- `GET /health` - Health check
- `POST /auth/google` - Google authentication
- `GET /auth/me` - Get current user (requires authentication)

## Features Demonstrated

### 1. Google OAuth Flow
- Click "Continue with Google" button
- Select Google account
- Grant permissions
- Automatic redirect to profile page

### 2. User Data Display
- Profile picture from Google account
- Email address
- First and last name
- Account creation timestamp

### 3. Authentication State
- Logged-in state persists across page refreshes
- JWT token stored securely in localStorage
- Automatic token injection in API requests

### 4. Logout Functionality
- Click "Logout" button
- Clears authentication state
- Returns to login screen
- Removes stored credentials

## Responsive Design

The application is fully responsive:

### Desktop (> 1024px)
- Full-width gradient background
- Centered card with generous padding
- Large profile picture and comfortable spacing

### Tablet (768px - 1024px)
- Adjusted card width
- Optimized font sizes
- Maintained readability

### Mobile (< 768px)
- Full-width card with minimal margins
- Stacked layout for better touch interaction
- Smaller profile picture
- Full-width buttons

## Color Scheme

- **Primary Gradient:** Purple (#667eea) to Dark Purple (#764ba2)
- **Card Background:** White (#ffffff)
- **Primary Text:** Purple (#667eea)
- **Secondary Text:** Gray (#666)
- **Button Primary:** Blue (Ant Design default)
- **Button Danger:** Red (Ant Design default)

## Typography

- **Headings:** Bold, large font (28px for main heading)
- **Body Text:** Regular, 16px
- **Labels:** Bold, standard size
- **Values:** Regular, standard size

## Icons

- Mail icon (📧) for email
- User icon (👤) for name fields
- Logout icon (🚪) for logout button
- Google logo on sign-in button

## Loading States

- Loading message during authentication: "Authenticating..."
- Success message: "Login successful!"
- Error messages for failed authentication

## Error Handling

- Invalid credentials: Shows error message
- Network errors: User-friendly error notification
- Missing configuration: Configuration error message displayed
- All errors use Ant Design message component
