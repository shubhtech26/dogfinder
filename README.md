# 🐶 Dog Finder App

A web application that helps users search through a database of shelter dogs and find their perfect match! Built with **React**, **TypeScript**, **Vite**, and **Material-UI**.

> [Live Demo](https://dogfinder-9wdz.vercel.app/)  
> [GitHub Repository](https://github.com/shubhtech26/dogfinder).



## Features

- User authentication with name and email
- Search and filter dogs by breed
- Sort results by breed, name, or age
- Pagination for search results
- Favorite dogs and generate matches
- Responsive design for all screen sizes

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <https://github.com/shubhtech26/dogfinder >
cd fetch-dogs-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Technologies Used

- React 18
- TypeScript
- Material-UI
- React Query
- React Router
- React Hook Form
- Vite

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── context/       # Context providers
  ├── pages/         # Page components
  ├── services/      # API services
  ├── types/         # TypeScript type definitions
  ├── App.tsx        # Main app component
  └── main.tsx       # Entry point
```

## API Integration

The app integrates with the Fetch API service for:
- User authentication
- Dog search and filtering
- Breed listings
- Match generation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
# dogfinder
