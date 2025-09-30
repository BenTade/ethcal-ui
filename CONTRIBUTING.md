# Contributing to Ethiopian Calendar UI

Thank you for your interest in contributing to ethcal-ui! 

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/BenTade/ethcal-ui.git
cd ethcal-ui
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Start development with watch mode:
```bash
npm run dev
```

## Project Structure

```
ethcal-ui/
├── src/              # Source files
│   ├── calendar.js   # Core calendar logic
│   ├── ui.js        # UI component
│   ├── styles.css   # Styles
│   └── index.js     # Main entry point
├── dist/            # Built files (generated)
├── examples/        # Usage examples
├── php/             # PHP helper class
└── README.md        # Documentation
```

## Making Changes

1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes in the `src/` directory

3. Build and test your changes:
```bash
npm run build
```

4. Test with the examples:
```bash
# Start a local server
python3 -m http.server 8080
# Open http://localhost:8080/examples/vanilla.html
```

5. Commit your changes with a clear message:
```bash
git commit -m "Add: your feature description"
```

## Code Style

- Use 2 spaces for indentation
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions focused and concise

## Testing

- Manually test all examples in `examples/` directory
- Verify calendar navigation (month/year)
- Test date selection and conversion
- Ensure mobile responsiveness

## Pull Request Process

1. Update README.md if needed
2. Update CHANGELOG.md with your changes
3. Ensure all examples still work
4. Submit a pull request with a clear description

## Questions?

Open an issue for any questions or concerns.

Thank you for contributing! 🎉
