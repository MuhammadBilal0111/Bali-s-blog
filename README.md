# MERN Stack Blogging Website

This is a full-featured blogging website built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). The project includes user authentication with Google, secure password management with JWT, and a responsive user interface styled with TailwindCSS and Flowbite React components.

## Features

- **User Authentication:** Google Authentication for easy sign-in.
- **Secure Password Management:** JWT authentication with support for reset and forgot password.
- **Responsive Design:** TailwindCSS and Flowbite React components for a modern, responsive UI.
- **Content Management:** Create, edit, and delete blog posts.
- **Admin Controls:** Admin-only routes for content moderation.

## Technologies Used

- **Frontend:** React.js, TailwindCSS, Flowbite React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Firebase, Google Authentication, JWT

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Firebase Project (with Google Authentication enabled)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/MuhammadBilal0111/Website.git
    cd Website
    ```

2. **Install dependencies for the server and client:**

    ```bash
    cd server
    npm install
    cd ../client/blog
    npm install
    ```

3. **Create environment variables:**
   - Create a `.env` file in the `server` and `client/blog` directory and add your environment variables (e.g., MongoDB URI, JWT Secret, Firebase credentials).

4. **Run the application:**

    ```bash
    # Start the server
    cd server
    npm start
    
    # Start the client
    cd /client/blog
    npm run dev
    ```


## Contributing

Feel free to submit pull requests or open issues to help improve the project.

## License

This project is open-source.
