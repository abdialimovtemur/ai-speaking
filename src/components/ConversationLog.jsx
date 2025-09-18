import { User, Bot } from 'lucide-react';

const ConversationLog = ({ logEntries }) => (
  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Conversation</h2>
    <div className="space-y-4">
      {logEntries.map((entry) => (
        <div key={entry.key} className="p-4 rounded-lg bg-gray-50">
          <div className="flex items-center mb-2">
            {entry.speaker === 'You' ? (
              <User className="w-5 h-5 text-blue-600 mr-2" />
            ) : (
              <Bot className="w-5 h-5 text-purple-600 mr-2" />
            )}
            <strong className={entry.speaker === 'You' ? 'text-blue-600' : 'text-purple-600'}>
              {entry.speaker}:
            </strong>
          </div>
          {entry.html ? (
            <div dangerouslySetInnerHTML={{ __html: entry.html }} className="text-gray-700" />
          ) : (
            <p className="text-gray-700">{entry.text}</p>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default ConversationLog;