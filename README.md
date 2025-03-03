# Knighty Podcasts

Knighty Podcasts is a modern, responsive web application for discovering and listening to podcasts. Built with TypeScript, Vite, and Tailwind CSS, it leverages Supabase for backend services and database management. This project aims to provide a fast, scalable, and engaging user experience for podcast enthusiasts.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Database Setup](#database-setup)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

Knighty Podcasts is designed to streamline the podcast listening experience. Whether you're discovering new episodes, managing your subscriptions, or enjoying curated content, this application is built to deliver a smooth and intuitive experience using modern web technologies.

## Features

- **Podcast Discovery:** Browse and search through a variety of podcasts.
- **Responsive Design:** Mobile-first design ensures seamless usability on all devices.
- **Fast Development:** Utilizes Vite for rapid builds and hot module replacement.
- **Type Safety:** Developed in TypeScript to minimize runtime errors.
- **Real-time Data:** Integrated with Supabase for real-time updates and backend management.
- **Modern Styling:** Styled with Tailwind CSS for a clean and modern look.
- **Scalable Architecture:** Easily extensible for adding new features and services.

## Tech Stack

- **Frontend:** [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [Supabase](https://supabase.com/) (with PLpgSQL for migrations)
- **Linting & Formatting:** [ESLint](https://eslint.org/), [PostCSS](https://postcss.org/)
- **Deployment:** Configured for deployment on [Vercel](https://vercel.com/)

## Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**

    git clone https://github.com/KNIGHTABDO/KNIGHTYPODCASTS.git  
    cd KNIGHTYPODCASTS

2. **Install Dependencies**

    Ensure you have Node.js installed, then run:

    npm install

3. **Environment Variables**

    Create a `.env` file in the root directory with your environment-specific settings. For example:

    # Supabase configuration
    SUPABASE_URL=https://your-supabase-url.supabase.co
    SUPABASE_ANON_KEY=your-supabase-anon-key

4. **Run Database Migrations**

    supabase db push

## Usage

To run the project in development mode:

    npm run dev

This command starts the development server with hot reloading. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the application.

To build the project for production:

    npm run build

To preview the production build locally:

    npm run preview

## Database Setup

This project uses Supabase to manage the backend and database. The migration scripts located in `supabase/migrations` can be applied using the Supabase CLI. Ensure you have your Supabase project URL and API keys set in your `.env` file before running migrations.

## Deployment

The project is configured for deployment on Vercel. The `vercel.json` file in the root directory contains necessary settings for seamless deployment. To deploy:

1. Push your changes to the main branch.
2. Connect your repository to Vercel.
3. Vercel will automatically deploy your application.

For more detailed deployment instructions, refer to the [Vercel Documentation](https://vercel.com/docs).

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to your branch: `git push origin feature/YourFeature`
5. Open a pull request with a clear description of your changes.

Please make sure to update tests as appropriate and follow the existing code style.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions, feature requests, or bug reports, please open an issue in the [GitHub repository](https://github.com/KNIGHTABDO/KNIGHTYPODCASTS/issues).
