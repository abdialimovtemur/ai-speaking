import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';

const VerifyCodePage = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const { verifyCode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const phoneNumber = location.state?.phoneNumber || '';
  const from = location.state?.from || '/';

  // Countdown timer for resend
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code');
      setLoading(false);
      return;
    }

    try {
      const result = await verifyCode(code);
      
      if (result.success) {
        // Redirect to the page they were trying to access
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Invalid verification code');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setCanResend(false);
    setTimeLeft(60);
    setError('');
    
    // In a real app, you would call the resend API here
    console.log('Resending code to:', phoneNumber);
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setError('');
  };

  const goBack = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Phone</h1>
          <p className="text-gray-600">
            We've sent a 6-digit code to{' '}
            <span className="font-semibold text-gray-900">{phoneNumber}</span>
          </p>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={handleCodeChange}
                placeholder="••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-2xl font-mono tracking-widest"
                disabled={loading}
                autoFocus
                maxLength={6}
              />
              <p className="text-sm text-gray-500 mt-2 text-center">
                Enter the 6-digit code sent to your phone
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify and Continue</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Resend Code */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              {canResend ? (
                <button
                  onClick={handleResendCode}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Resend Code
                </button>
              ) : (
                <p className="text-sm text-gray-500">
                  Resend code in {timeLeft} seconds
                </p>
              )}
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-4">
            <button
              onClick={goBack}
              className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Change phone number</span>
            </button>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-green-900 mb-1">Demo Mode</h3>
              <p className="text-sm text-green-700">
                For demo purposes, enter any 6-digit number to verify and continue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCodePage;
