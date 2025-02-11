const CredibilityScore = ({ score, isDarkMode }) => {
    // Determine color based on score
    const getScoreColor = (score) => {
      if (score >= 70) return 'bg-green-500';
      if (score >= 40) return 'bg-yellow-500';
      return 'bg-red-500';
    };
  
    return (
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-semibold">
            Credibility Score:
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(score)} text-white px-4 py-2 rounded-lg`}>
            {score}%
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
          <div
            className={`${getScoreColor(score)} h-4 rounded-full transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    );
  };
  
  export default CredibilityScore;