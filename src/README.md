# SaludIA 🏥
[![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg?logo=react&logoColor=white)](https://reactjs.org/) [![OpenAI](https://img.shields.io/badge/OpenAI-API-12A1F1.svg)](https://openai.com/) [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![Vitest](https://img.shields.io/badge/Vitest-Testing-2F7D8C.svg)](https://vitest.dev/)

An AI-powered health information analyzer that helps detect misinformation and assess credibility of health claims in English and Spanish. The name comes from salud in spanish which means health and inteligencia artificial (IA) or AI in spanish.

Saludia aims to develop an AI-driven system to detect health misinformation by analyzing patterns and rhetorical techniques. The system will identify common misinformation tactics, such as emotional manipulation and logical fallacies. By focusing on these objectives, the aim is to enhance public access to reliable health information and mitigate the spread of misinformation.

## 🎯 Features
- **Credibility Scoring**: Analyzes health information on a 0-100 scale
- **Content Type Detection**: Identifies scientific, news, social media, and other content types
- **Multilingual**: Full support for English and Spanish
- **Dark Mode**: Toggle between light and dark themes
- **Analysis History**: Track and revisit previous analyses

## 🛠️ Tech Stack
- Frontend: React + Vite
- Styling: TailwindCSS
- AI: OpenAI API
- Testing: Vitest + React Testing Library

## 📁 Project Structure
```
saludia/
├── src/
│   ├── components/
│   ├── services/
│   ├── __tests__/
│   ├── App.jsx
│   └── main.jsx
├── screenshots/      
├── .env
├── .gitignore
├── package.json
├── README.md
├── LICENSE
└── vitest.config.js
```
## 🚀 Installation
1. Clone repository:
git clone https://github.com/yourusername/saludia.git
cd saludia

2. Install dependencies:
npm install

3. Configure environment:
Create .env file:
VITE_OPENAI_API_KEY=your_openai_api_key

4. Run development server:
npm run dev

5. Run tests:
npm test

## 🧪 Testing
- 7 passing tests covering:
  - Component rendering and functionality
  - Content analysis and scoring
  - Language switching (EN/ES)
  - Error handling and edge cases
  - Dark/light mode
  - API integration

Test results:
<br>
<img src="./assets/screenshots/tests.png" width="700" alt="testing results"/>

## 📸 Screenshots
<div align="center">
    <img src="./assets/screenshots/dark-mode.png" width="350" alt="Dark Mode Interface"/>
     <br>
    *Dark mode interface*
    <br><br>
    <img src="./assets/screenshots/light-mode.png" width="350" alt="Light Mode Interface"/>
     <br>
    *Light mode in Spanish interface*
    <br><br>
    <img src="./assets/screenshots/analysis.png" width="350" alt="Analysis View"/>
    <br>
    *Detailed credibility analysis with scoring*
</div>

## ⚡ Key Features in Detail
- Instant credibility assessment with detailed breakdowns
- Content type categorization (scientific, news, social media)
- Bilingual analysis maintaining accuracy across languages
- Real-time language switching
- Historical analysis tracking
- Responsive design for all devices

## 📝 Notes
- Language variations of ±10% may occur when analyzing non-native content
- For medical advice, always consult healthcare providers
- Follow public health organizations for official guidance
- Best viewed on modern browsers (Chrome, Firefox, Safari)
- Requires stable internet connection for API functionality

## 🔒 Security & Privacy
- No user data storage
- Secure API communication
- Environment variable protection
- Regular security updates

## 📜 License
MIT License

## 📬 Contact
Don Deerie B. Dumayas - [LinkedIn Profile](http://linkedin.com/in/ddumayas34959b28)
<br>
Project Link: [GitHub](https://github.com/dondeerie/saludia)

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request

## 🙏 Acknowledgments
- OpenAI for API support
- React community
- TailwindCSS team
- Testing libraries contributors