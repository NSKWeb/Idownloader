# Multi-Platform Downloader

A self-hosted, full-stack Next.js application that allows you to download videos and audio from over 20 platforms without requiring third-party API keys or subscriptions. This project is free, open-source, and designed for easy deployment on a VPS or Vercel.

## Features

- **21+ Platforms Supported:** Download from YouTube, Instagram, Facebook, TikTok, Twitter, and many more.
- **No API Keys Needed:** Works out-of-the-box using the powerful `yt-dlp` library.
- **Free and Unlimited:** No watermarks, no time limits, no hidden costs.
- **Self-Hosted:** You have full control over the application and your data.
- **Clean UI:** A simple, responsive interface built with Next.js and Tailwind CSS.
- **Easy Deployment:** Deploy with a single command using the provided Dockerfile, or deploy to Vercel with zero configuration.
- **Modular Backend:** The API is built with a modular structure, making it easy to add or remove platforms.
- **Caching:** A simple caching layer is implemented to quickly serve repeated requests.
- **Logging:** A logging system is in place to monitor requests and errors.

## Live Demo

[Link to your live demo here]

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

### Local Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name/downloader-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.

## Deployment

This application is optimized for deployment on a VPS (using Docker) or on Vercel.

### Option 1: Deploying with Docker (Recommended for VPS)

This is the recommended method for deploying on a cloud server like Contabo, AWS, DigitalOcean, etc.

1.  **Build the Docker image:**
    ```bash
    docker build -t multi-downloader .
    ```

2.  **Run the container:**
    ```bash
    docker run -d -p 3000:3000 --name multi-downloader-container multi-downloader
    ```
    The `-d` flag runs the container in detached mode. The application will be accessible on your server's IP address at port 3000.

### Option 2: Deploying on Vercel

Vercel is a great option for a quick and easy deployment.

1.  **Fork this repository** to your own GitHub account.
2.  Go to [vessel.com](https://vercel.com/) and create a new project.
3.  Connect your GitHub account and select the forked repository.
4.  Vercel will automatically detect that it is a Next.js application and configure the build settings.
5.  Click **Deploy**.

The application is configured to handle Vercel's serverless environment, including its writable `/tmp` directory for downloading the `yt-dlp` binary.

## API Endpoints

The application exposes 21 separate API endpoints, one for each platform. They all follow the same structure:

-   **URL:** `/api/{platform_name}`
-   **Method:** `POST`
-   **Body:** `{ "url": "https://example.com/video" }`
-   **Success Response:** `{ "success": true, "downloadUrl": "..." }`
-   **Error Response:** `{ "success": false, "error": "Error message" }`

## Technologies Used

-   **Frontend:** [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
-   **Backend:** [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction), [Node.js](https://nodejs.org/)
-   **Core Downloader:** [yt-dlp](https://github.com/yt-dlp/yt-dlp) via [yt-dlp-wrap](https://github.com/nodenica/yt-dlp-wrap)
-   **Deployment:** [Docker](https://www.docker.com/), [Vercel](https://vercel.com/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
