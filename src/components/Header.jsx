import { Mic } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center">
          <Mic className="h-8 w-8 text-purple-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">IELTS Speaking Mock Test</h1>
        </div>
        <p className="mt-1 text-sm text-gray-600">Practice and improve your IELTS speaking skills with AI feedback</p>
      </div>
    </header>
  );
};

export default Header;