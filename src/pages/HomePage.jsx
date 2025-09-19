import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Play, Star, MessageCircle, Send, User, Clock, Award } from 'lucide-react';

const HomePage = () => {
  const [newFeedback, setNewFeedback] = useState('');
  const [userName, setUserName] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Sample feedback data
  const [feedbacks] = useState([
    {
      id: 1,
      name: 'Sarvar Fozilov',
      rating: 5,
      comment: 'This IELTS practice tool is amazing! The AI feedback is incredibly detailed and helpful. I improved my band score from 6.5 to 8.0 in just 2 weeks!',
      date: '2024-01-15'
    },
    {
      id: 2,
      name: 'Hikmat Yuldoshev',
      rating: 5,
      comment: 'The voice activity detection works perfectly. I love how it gives real-time feedback during speaking practice. Highly recommended!',
      date: '2024-01-12'
    },
    {
      id: 3,
      name: 'Sardorbek Toshpulatov',
      rating: 4,
      comment: 'Great tool for IELTS preparation. The conversation flow feels natural and the feedback is very constructive. Would love more practice topics.',
      date: '2024-01-10'
    },
    {
      id: 4,
      name: 'Jasurbek Asqarov',
      rating: 5,
      comment: 'Excellent platform! The AI examiner is very realistic and the detailed evaluation helps identify specific areas for improvement.',
      date: '2024-01-08'
    }
  ]);

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (newFeedback.trim() && userName.trim() && rating > 0) {
      // Here you would typically send to backend
      console.log('New feedback:', { name: userName, comment: newFeedback, rating: rating });
      setNewFeedback('');
      setUserName('');
      setRating(0);
      setHoveredRating(0);
      alert('Thank you for your feedback!');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Mic className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              IELTS Speaking Practice
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Master your IELTS speaking with AI-powered feedback
            </p>
            <Link
       to="/test"
       className="relative inline-flex items-center bg-white text-gray-800 font-bold py-4 px-8 rounded-xl text-lg overflow-hidden group"
       onMouseEnter={() => setIsHovered(true)}
       onMouseLeave={() => setIsHovered(false)}
       style={{
         boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -5px rgba(0, 0, 0, 0.05)',
         transition: 'all 0.3s ease',
         border: '2px solid transparent',
         background: 'linear-gradient(white, white) padding-box, linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981) border-box',
         animation: 'borderRotate 3s linear infinite'
       }}
     >
       {/* Animated border gradient */}
       <div 
         className="absolute inset-0 rounded-xl opacity-70"
         style={{
           background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981, #3b82f6)',
           backgroundSize: '400% 400%',
           animation: 'gradientShift 3s ease infinite',
           zIndex: -1
         }}
       ></div>
      
       {/* Continuous shine effect */}
       <div 
         className="absolute top-0 -inset-full w-1/2 h-full bg-gradient-to-r from-transparent to-gray-200 opacity-30"
         style={{
           transform: 'skewX(-25deg)',
           animation: 'shine 4s infinite ease-in-out',
           transition: 'all 0.7s ease'
         }}
       ></div>
      
      <div className="relative z-10 flex items-center">
        <Play 
          className="w-5 h-5 mr-2" 
          style={{
            transform: isHovered ? 'translateX(3px) scale(1.1)' : 'translateX(0) scale(1)',
            transition: 'transform 0.3s ease'
          }} 
        />
        <span>Start Practice Now</span>
      </div>
      
       {/* Style for the animations */}
       <style>
         {`
           @keyframes gradientShift {
             0% {
               background-position: 0% 50%;
             }
             50% {
               background-position: 100% 50%;
             }
             100% {
               background-position: 0% 50%;
             }
           }
           @keyframes borderRotate {
             0% {
               background: linear-gradient(white, white) padding-box, linear-gradient(0deg, #3b82f6, #8b5cf6, #06b6d4, #10b981) border-box;
             }
             25% {
               background: linear-gradient(white, white) padding-box, linear-gradient(90deg, #8b5cf6, #06b6d4, #10b981, #3b82f6) border-box;
             }
             50% {
               background: linear-gradient(white, white) padding-box, linear-gradient(180deg, #06b6d4, #10b981, #3b82f6, #8b5cf6) border-box;
             }
             75% {
               background: linear-gradient(white, white) padding-box, linear-gradient(270deg, #10b981, #3b82f6, #8b5cf6, #06b6d4) border-box;
             }
             100% {
               background: linear-gradient(white, white) padding-box, linear-gradient(360deg, #3b82f6, #8b5cf6, #06b6d4, #10b981) border-box;
             }
           }
           @keyframes shine {
             0% {
               transform: skewX(-25deg) translateX(-120%);
               opacity: 0;
             }
             20% {
               opacity: 0.25;
             }
             50% {
               transform: skewX(-25deg) translateX(0%);
               opacity: 0.25;
             }
             80% {
               opacity: 0.25;
             }
             100% {
               transform: skewX(-25deg) translateX(120%);
               opacity: 0;
             }
           }
         `}
       </style>
    </Link>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How to Use
            </h2>
            <p className="text-lg text-gray-600">
              Get started with our simple 3-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Start Test</h3>
              <p className="text-gray-600">
                Click "Start IELTS Test" and allow microphone access for the best experience.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Practice Speaking</h3>
              <p className="text-gray-600">
                Answer the AI examiner's questions naturally, just like in a real IELTS test.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Get Feedback</h3>
              <p className="text-gray-600">
                Receive detailed band scores and improvement suggestions for each response.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Clock className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold mb-2">Real-time Practice</h3>
              <p className="text-gray-600 text-sm">Practice with realistic timing and flow</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Star className="h-8 w-8 text-yellow-500 mb-3" />
              <h3 className="font-semibold mb-2">AI-Powered Feedback</h3>
              <p className="text-gray-600 text-sm">Get detailed band scores and suggestions</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <User className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold mb-2">Personalized Experience</h3>
              <p className="text-gray-600 text-sm">Adapts to your speaking level and pace</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Award className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-semibold mb-2">IELTS Standards</h3>
              <p className="text-gray-600 text-sm">Follows official IELTS speaking criteria</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Reviews Section */}
      <div id="reviews" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of successful IELTS candidates
            </p>
          </div>

          {/* Existing Reviews */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400 mr-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < feedback.rating ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-900">{feedback.name}</span>
                  <span className="text-gray-500 text-sm ml-auto">{feedback.date}</span>
                </div>
                <p className="text-gray-700">{feedback.comment}</p>
              </div>
            ))}
          </div>

          {/* Leave Feedback Form */}
          <div className="bg-blue-50 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Share Your Experience
            </h3>
            <form onSubmit={handleSubmitFeedback} className="max-w-2xl mx-auto">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              {/* Star Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate your experience
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none transition-colors"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoveredRating || rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        } hover:text-yellow-400 transition-colors`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Click to rate'}
                  </span>
                </div>
              </div>
              <div className="mb-6">
                <textarea
                  placeholder="Share your experience with our IELTS practice tool..."
                  value={newFeedback}
                  onChange={(e) => setNewFeedback(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
