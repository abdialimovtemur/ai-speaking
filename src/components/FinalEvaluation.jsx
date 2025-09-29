import { CheckCircle, AlertCircle, Award, RotateCcw } from 'lucide-react';

const EvaluationCard = ({ title, score, strengths, improvements }) => (
  <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-2xl p-5 shadow-sm border border-white/50">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-xs font-semibold border border-blue-200">
        {score}
      </span>
    </div>
    
    <div className="mb-3">
      <h4 className="flex items-center text-xs font-medium text-gray-700 mb-2">
        <CheckCircle className="w-3 h-3 text-green-500 mr-1" /> Strengths
      </h4>
      <ul className="space-y-1">
        {Object.entries(strengths).map(([k, v]) => (
          <li key={k} className="text-xs text-gray-600">
            <strong className="text-gray-800">{k}:</strong> {v}
          </li>
        ))}
      </ul>
    </div>
    
    <div>
      <h4 className="flex items-center text-xs font-medium text-gray-700 mb-2">
        <AlertCircle className="w-3 h-3 text-amber-500 mr-1" /> Areas for Improvement
      </h4>
      <ul className="space-y-1">
        {Object.entries(improvements).map(([k, v]) => (
          <li key={k} className="text-xs text-gray-600">
            <strong className="text-gray-800">{k}:</strong> {v}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const FinalEvaluation = ({ data, onRestartTest }) => {
  if (!data) return null;

  const handleRestartTest = () => {
    if (onRestartTest) {
      onRestartTest();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Award className="w-5 h-5 mr-2" />
          Overall Band Score
        </h3>
        <p className="text-4xl font-bold">{data.overall_band_score || 'N/A'}</p>
      </div>
      
      <div className="space-y-4">
        {data.sections?.map((section) => (
          <EvaluationCard key={section.title} {...section} />
        ))}
      </div>
      
      {data.final_suggestions && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Final Suggestions for Improvement</h3>
          <div className="space-y-2">
            {Object.entries(data.final_suggestions).map(([k, v]) => (
              <p key={k} className="text-sm text-gray-700">
                <strong className="text-gray-900">For {k.replace(/_/g, ' & ')}:</strong> {v}
              </p>
            ))}
          </div>
        </div>
      )}
      
      {/* Restart Test Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleRestartTest}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Restart Test
        </button>
      </div>
    </div>
  );
};

export default FinalEvaluation;