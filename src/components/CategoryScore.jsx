import React from 'react'

const CategoryScore = ({ category, score, isDarkMode }) => {
  const getScoreColor = (score) => {
    if (score >= 70) return 'bg-green-500'
    if (score >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          {category}
        </span>
        <span className={`${getScoreColor(score)} text-white px-2 py-1 rounded-lg text-sm`}>
          {score}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          role="progressbar"
          className={`${getScoreColor(score)} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

export default CategoryScore