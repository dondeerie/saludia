# Saludia Documentation 🔧

## Setup Guide
- Node.js (v16+) and npm (v8+) required
- OpenAI API key needed
- Clone repository: git clone [your-repo-url]
- Install dependencies: npm install
- Create .env file with VITE_OPENAI_API_KEY=your_key_here
- Run development server: npm run dev
- Build for production: npm run build
- Run tests: npm test

## Common Issues & Solutions

### API Related Issues
- OpenAI API errors: Check API key in .env, verify credits
- Rate limiting: Wait before retrying if "Too many requests" appears
- API usage costs: Monitor credit consumption
- Error handling: Check console for specific error messages

### Language & Analysis Issues
- Score variations (±10%) normal between languages
- Minimum 50 characters required for analysis
- Content length affects analysis accuracy
- Language detection may affect scoring

### Testing Issues
- Run npm test for all 16 core tests
- Use npm run test:ui for visual test interface
- Mock API responses may need adjustment
- Async/await usage critical in tests

## Code Watch-outs
- Handle async/await properly in API calls
- Maintain dark/light mode consistency
- Clear error states after resolution
- Manage history limit (5 items)
- Reset states on language change
- Keep translations synced in both languages
- Test both language versions thoroughly
- Monitor API usage and costs
- Verify responsive design works
- Check accessibility features

## Maintenance Guidelines
- Add components in src/components/
- Include tests for new features
- Follow naming conventions
- Maintain bilingual support
- Update translations in both languages
- Follow existing code patterns
- Document new features
- Test in both languages

## Performance Notes
- Optimize API calls
- Manage memory usage
- Monitor load times
- Ensure error recovery
- Test browser compatibility
- Verify state persistence
- Check image optimization
- Implement code splitting

## Security Considerations
- Protect API keys
- Secure environment variables
- Sanitize user input
- Hide sensitive errors
- Update dependencies
- Secure build process
- Monitor API usage
- Check license compliance

## Future Improvements
- Add more languages
- Enhance error reporting
- Monitor performance
- Store user preferences
- Extend test coverage
- Improve accessibility
- Optimize for mobile
- Track API analytics

## Contact & Support
- GitHub issues for bugs
- Pull requests welcome
- Regular doc updates
- Follow contribution guidelines