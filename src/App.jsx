import { useState } from 'react'
import { analyzeHealth } from './services/openai'
import { Moon, Sun, Copy, CheckCheck, Lightbulb, Clock, Languages } from 'lucide-react'
import CategoryScore from './components/CategoryScore'
import { Info } from 'lucide-react'

function App() {
  // Add new state variables
  const [inputText, setInputText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [copied, setCopied] = useState(false)
  const [language, setLanguage] = useState('en')
  const [history, setHistory] = useState([])
  const [showInstructions, setShowInstructions] = useState(false)

  // Add translations object
  const translations = {
    en: {
      title: 'Welcome to Saludia',
      subtitle: 'AI-powered health information analyzer',
      enterText: 'Enter text for analysis',
      analyze: 'Analyze Text',
      analyzing: 'Analyzing...',
      clear: 'Clear',
      tryExample: 'Try an example',
      characters: 'characters',
      results: 'Analysis Results',
      copy: 'Copy Results',
      copied: 'Copied!',
      history: 'Analysis History',
      revisit: 'Revisit',
      categoryBreakdown: 'Category Breakdown',
      overallScore: 'Overall Credibility Score',
      scientificEvidence: 'Scientific Evidence',
      emotionalManipulation: 'Emotional Manipulation',
      scientificTerminology: 'Scientific Terminology',
      logicalReasoning: 'Logical Reasoning',
      overall: 'Overall',
      howToUse: 'How to Use Saludia',
      purpose: 'Purpose',
      disclaimer: 'Disclaimer',
      purposeText: 'Saludia analyzes health information to help identify potential misinformation and assess credibility of health claims.',
      disclaimerList: [
        'This tool is for educational purposes only',
        'Always consult multiple reliable sources',
        'For medical advice, consult healthcare providers',
        'Follow public health organizations for official guidance'
      ],
      analyzeTitle: 'Analyzing Health Information',
      analyzeList: [
        'Paste any health-related text (news, social media, research)',
        'Works in English and Spanish',
        'Minimum length: 50 characters recommended'
      ],
      scoreTitle: 'Credibility Score (0-100)',
      scoreList: [
        '70+: High credibility',
        '40-69: Medium credibility',
        'Less than 40: Low credibility',
        'Note: ±10% variation possible for non-native language content'
      ],
      contentTitle: 'Content Types',
      contentList: [
        'Scientific: Research papers, academic content',
        'News: Journalism, news articles',
        'Social: Social media posts, blogs',
        'Guidelines: Official health recommendations',
        'Commercial: Product/service promotions',
        'General: Uncategorized content'
      ],
      analysisTitle: 'Analysis Categories',
      analysisList: [
        'Scientific Evidence: Citations, data support',
        'Emotional Manipulation: Objectivity vs persuasion',
        'Scientific Terminology: Accuracy of technical terms',
        'Logical Reasoning: Argument structure and validity'
        ],
      close: 'Close',
      errorTooShort: 'Please enter at least 50 characters for accurate analysis',
      errorRateLimit: 'Too many requests. Please try again in a moment',
      errorNetwork: 'Unable to connect. Please check your internet connection',
      errorGeneral: 'An error occurred. Please try again'   

    },
    es: {
      title: 'Bienvenido a Saludia',
      subtitle: 'Analizador de información de salud potenciado por IA',
      enterText: 'Ingrese texto para análisis',
      analyze: 'Analizar Texto',
      analyzing: 'Analizando...',
      clear: 'Limpiar',
      tryExample: 'Probar ejemplo',
      characters: 'caracteres',
      results: 'Resultados del Análisis',
      copy: 'Copiar Resultados',
      copied: '¡Copiado!',
      history: 'Historial de Análisis',
      revisit: 'Revisar',
      categoryBreakdown: 'Desglose por Categoría',
      overallScore: 'Puntuación de Credibilidad General',
      scientificEvidence: 'Evidencia Científica',
      emotionalManipulation: 'Manipulación Emocional',
      scientificTerminology: 'Terminología Científica',
      logicalReasoning: 'Razonamiento Lógico',
      overall: 'General',
      howToUse: 'Cómo Usar Saludia',
      purpose: 'Propósito',
      disclaimer: 'Aviso Legal',
      purposeText: 'Saludia analiza información de salud para ayudar a identificar posible desinformación y evaluar la credibilidad de las afirmaciones sobre salud.',
      disclaimerList: [
        'Esta herramienta es solo para fines educativos',
        'Consulte siempre múltiples fuentes confiables',
        'Para consejos médicos, consulte a profesionales de la salud',
        'Siga a las organizaciones de salud pública para orientación oficial'
      ],
      analyzeTitle: 'Analizando Información de Salud',
      analyzeList: [
        'Pegue cualquier texto relacionado con la salud (noticias, redes sociales, investigación)',
        'Funciona en inglés y español',
        'Longitud mínima recomendada: 50 caracteres'
      ],
      scoreTitle: 'Puntuación de Credibilidad (0-100)',
      scoreList: [
        '70+: Alta credibilidad',
        '40-69: Credibilidad media',
        'Menos de 40: Baja credibilidad',
        'Nota: Posible variación de ±10% para contenido en idioma no nativo'
      ],
      contentTitle: 'Tipos de Contenido',
      contentList: [
        'Científico: Artículos de investigación, contenido académico',
        'Noticias: Periodismo, artículos de prensa',
        'Social: Publicaciones en redes sociales, blogs',
        'Guías: Recomendaciones oficiales de salud',
        'Comercial: Promociones de productos/servicios',
        'General: Contenido sin categorizar'
      ],
      analysisTitle: 'Categorías de Análisis',
      analysisList: [
        'Evidencia Científica: Citas, respaldo de datos',
        'Manipulación Emocional: Objetividad vs persuasión',
        'Terminología Científica: Precisión de términos técnicos',
        'Razonamiento Lógico: Estructura y validez de argumentos'
      ],
      close: 'Cerrar',
      errorTooShort: 'Ingrese al menos 50 caracteres para un análisis preciso',
      errorRateLimit: 'Demasiadas solicitudes. Inténtelo de nuevo en un momento',
      errorNetwork: 'No se puede conectar. Verifique su conexión a internet',
      errorGeneral: 'Ocurrió un error. Inténtelo de nuevo'
    }
  }

  const exampleText = "Each hour, the human body creates 350,000 joules of energy, which creates the same amount of energy as a 100-watt light bulb. This ends up being enough heat to boil a half gallon of water in just 30 minutes."

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    if (inputText.length < 50) {
      setError(translations[language].errorTooShort);
      return;
    }
    
    try {
      setIsAnalyzing(true);
      setError(null);
      console.log('Current language:', language);
      const analysis = await analyzeHealth(inputText, language);
      setResult(analysis);
      setHistory(prev => [{
        text: inputText,
        result: analysis,
        timestamp: new Date()
      }, ...prev].slice(0, 5));
    } catch (err) {
      if (err.message.includes('429')) {
        setError(translations[language].errorRateLimit);
      } else if (err.message.includes('network')) {
        setError(translations[language].errorNetwork);
      } else {
        setError(translations[language].errorGeneral);
      }
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }
  const handleTryExample = () => {
    setInputText(exampleText)
    setResult(null)
  }

  const handleClear = () => {
    setInputText('')
    setResult(null)
    setError(null)
  }

  const handleCopyResults = async () => {
    try {
      const textToCopy = `Analysis Results\n\nCredibility Score: ${result.credibilityScore}%\n\n${result.fullText}`;
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className={`min-h-screen w-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="w-full h-full flex flex-col items-center justify-start pt-12">
        {/* Banner */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-8 mb-10 w-[700px] relative`}>
          <div className="absolute top-4 right-4 flex gap-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`px-2 py-1 text-sm rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`px-3 py-1 text-sm rounded-lg flex items-center gap-2 
                ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}
            >
              {isDarkMode ? (
                <>
                  <Sun size={16} /> Light Mode
                </>
              ) : (
                <>
                  <Moon size={16} /> Dark Mode
                </>
              )}
            </button>
          </div>
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-center mt-4`}>
            {translations[language].title}
          </h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-xl mt-4 text-center`}>
            {translations[language].subtitle}
          </p>
        </div>

        {/* Input Section */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-8 mb-8 w-[700px]`}>
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-xl font-medium`}>
                {translations[language].enterText}
              </label>
              <button
                onClick={() => setShowInstructions(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700"
              >
                <Info size={18} />
              </button>
            </div>
            <div className="flex items-center gap-6">
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-lg`}>
                {inputText.length} {translations[language].characters}
              </span>
              <button
                onClick={handleTryExample}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700`}
              >
                <Lightbulb size={18} />
                {translations[language].tryExample}
              </button>
            </div>
          </div>
          <textarea
            className={`w-full h-36 p-5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
              ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-300'} 
              text-lg`}
            placeholder={translations[language].enterText}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="flex gap-4 mt-6">
            <button
              className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold text-lg
                ${isAnalyzing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'}`}
              onClick={handleAnalyze}
              disabled={isAnalyzing || !inputText.trim()}
            >
              {isAnalyzing ? translations[language].analyzing : translations[language].analyze}
            </button>
            <button
              className="px-8 py-3 rounded-lg text-white font-semibold text-lg bg-blue-600 hover:bg-blue-700"
              onClick={handleClear}
            >
              {translations[language].clear}
            </button>
          </div>
        </div>


        {/* App instructions */}
        {showInstructions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} p-8 rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto`}>
              <h2 className="text-2xl font-bold mb-4">{translations[language].howToUse}</h2>
              
              <section className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{translations[language].purpose}</h3>
                <p className="mb-2">{translations[language].purposeText}</p>
              </section>

              <section className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{translations[language].disclaimer}</h3>
                <ul className="space-y-2">
                  {translations[language].disclaimerList.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{translations[language].analyzeTitle}</h3>
                <ul className="space-y-2">
                  {translations[language].analyzeList.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{translations[language].scoreTitle}</h3>
                <ul className="space-y-2">
                  {translations[language].scoreList.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{translations[language].contentTitle}</h3>
                <ul className="space-y-2">
                  {translations[language].contentList.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{translations[language].analysisTitle}</h3>
                <ul className="space-y-2">
                  {translations[language].analysisList.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </section>

              <button
                onClick={() => setShowInstructions(false)}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {translations[language].close}
              </button>
            </div>
          </div>
        )}

        {/* Error Section */}
        {error && (
          <div 
            role="alert"
            className={`${isDarkMode ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-700'} 
            border px-6 py-4 rounded-lg w-[700px] mb-8`}
          >
            {error}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-8 w-[700px]`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-3xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {translations[language].results}
              </h2>
              <button
                onClick={handleCopyResults}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg 
                  ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'} 
                  hover:opacity-80`}
              >
                {copied ? <CheckCheck size={18} /> : <Copy size={18} />}
                {copied ? translations[language].copied : translations[language].copy}
              </button>
            </div>

            {/* Overall Score Visualization */}
            <div className="mb-8">
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>
                {translations[language].overallScore}
              </h3>
              <CategoryScore 
              category="Overall"
              score={parseInt(result.credibilityScore) || 
                parseInt((result.fullText.match(/PUNTUACIÓN_DE_CREDIBILIDAD: (\d+)/)||[])[1]) || 
                parseInt((result.fullText.match(/CREDIBILITY_SCORE: (\d+)/)||[])[1]) || 
                0}
              isDarkMode={isDarkMode}
            />
            </div>

            {/* Detailed Analysis */}
            <div className={`prose prose-lg max-w-none ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} space-y-6`}>
                  {result.fullText.split('\n').map((paragraph, index) => (
                    paragraph ? (
                      <p key={index} className="text-lg">
                        {paragraph}
                      </p>
                    ) : null
                  ))}
                </div>
              </div>
            )}

        {/* History Section */}
        {history?.length > 0 && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-8 w-[700px] mt-8`}>
            <div className="flex items-center gap-2 mb-4">
              <Clock size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
              <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {translations[language].history}
              </h3>
            </div>
            <div className="space-y-4">
              {history.map((item, index) => (
                <div 
                  key={index} 
                  className={`border rounded-lg p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <div className="flex justify-between mb-2">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(item.timestamp).toLocaleString(language === 'en' ? 'en-US' : 'es-ES')}
                    </span>
                    <button 
                      onClick={() => {
                        setInputText(item.text);
                        setResult(item.result);
                      }}
                      className="px-4 py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700"
                    >
                      {translations[language].revisit}
                    </button>
                  </div>
                  <p className={`truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App