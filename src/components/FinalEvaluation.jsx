import { CheckCircle, AlertCircle, Award } from 'lucide-react';

const EvaluationCard = ({ title, score, strengths, improvements }) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
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

const FinalEvaluation = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-4 text-white">
        <h3 className="text-lg font-semibold mb-2">Overall Band Score</h3>
        <p className="text-3xl font-bold">{data.overall_band_score || 'N/A'}</p>
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
    </div>
  );
};

export default FinalEvaluation;