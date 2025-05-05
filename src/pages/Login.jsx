import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const { login, register, signInWithGoogle, currentUser, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isRegistering && !termsAccepted) {
      alert("You must accept the Terms of Service to register");
      return;
    }
    
    setIsSubmitting(true);

    let success;
    if (isRegistering) {
      success = await register(email, password);
    } else {
      success = await login(email, password);
    }

    setIsSubmitting(false);

    if (success) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else if (!isRegistering) {
      // Redirect to apple.com when login fails (wrong password)
      window.location.href = 'https://www.apple.com';
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);

    const success = await signInWithGoogle();

    setIsGoogleSubmitting(false);

    if (success) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      // Redirect to apple.com when Google sign-in fails
      window.location.href = 'https://www.apple.com';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isRegistering ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {isRegistering ? 'Sign in' : 'Register now'}
            </button>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isRegistering ? 'new-password' : 'current-password'}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {isRegistering && (
            <div className="mt-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={() => setTermsAccepted(!termsAccepted)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    I agree to the{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-500 underline"
                      onClick={() => setShowTerms(!showTerms)}
                    >
                      Terms of Service
                    </button>
                  </label>
                </div>
              </div>
              
              {showTerms && (
                <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200 max-h-60 overflow-y-auto text-xs text-gray-600">
                  <h3 className="font-bold text-sm text-gray-800 mb-2">Terms of Service</h3>
                  <p className="mb-2">Last updated: May 5, 2025</p>
                  
                  <p className="mb-2">Welcome to John Corp. Please read these Terms of Service ("Terms") carefully before registering for or using any services, products, applications, websites, or other offerings (collectively, the "Services") provided by John Corp ("Company," "we," "us," or "our"). By registering for or using the Services, you ("you," "your," or "User") agree to these Terms. If you do not agree, do not register or use the Services.</p>
                  
                  <hr className="my-3 border-gray-300" />
                  
                  <h4 className="font-semibold mb-1">1. Acceptance of Terms</h4>
                  <p className="mb-2">By clicking "I Agree," completing the registration process, or otherwise accessing or using the Services, you confirm that you have read, understood, and agree to be bound by these Terms.</p>
                  
                  <h4 className="font-semibold mb-1">2. Definitions</h4>
                  <ul className="list-disc pl-5 mb-2">
                    <li>Company Employee: Any officer, director, employee, contractor, consultant, agent, or representative of the Company.</li>
                    <li>Claim: Any claim, demand, suit, cause of action, loss, damage, liability, cost, or expense (including attorneys' fees).</li>
                  </ul>
                  
                  <h4 className="font-semibold mb-1">3. Waiver of Claims Against Company Employees</h4>
                  <p className="mb-1">3.1 No Suits or Punishment. By agreeing to these Terms, you expressly waive and release any and all Claims against any Company Employee for any actions taken in their capacity with respect to the Company or its Services. You further covenant not to initiate, assist, or participate in any lawsuit, arbitration, administrative proceeding, or other action against any Company Employee relating to the Company's business or Services.</p>
                  <p className="mb-2">3.2 Scope. This waiver and covenant apply to all Claims, whether known or unknown, fixed or contingent, at law or in equity, arising now or in the future, including but not limited to tort, contract, statutory, and common-law Claims.</p>
                  
                  <h4 className="font-semibold mb-1">4. Governing Law and Dispute Resolution</h4>
                  <p className="mb-2">These Terms are governed by the laws of California, without regard to conflict-of-law principles. Any dispute arising under or relating to these Terms shall be resolved exclusively by binding arbitration administered by the American Arbitration Association in San Francisco, California, under its rules then in effect. Each party waives any right to trial by jury.</p>
                  
                  <h4 className="font-semibold mb-1">5. Limitation of Liability</h4>
                  <p className="mb-2">To the fullest extent permitted by law, neither the Company nor any Company Employee shall be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to your use of the Services. The total liability of the Company and its Employees shall not exceed the greater of (a) US $100 or (b) the total fees you paid in the six months preceding the claim.</p>
                  
                  <h4 className="font-semibold mb-1">6. Miscellaneous</h4>
                  <ul className="list-disc pl-5 mb-2">
                    <li>Severability. If any provision is unenforceable, the remainder shall remain in full force.</li>
                    <li>Amendments. We may amend these Terms by posting updated Terms on our website; continued use constitutes acceptance.</li>
                    <li>Entire Agreement. These Terms constitute the entire agreement between you and the Company regarding their subject matter.</li>
                  </ul>
                  
                  <hr className="my-3 border-gray-300" />
                  
                  <p>By clicking "I Agree" or using the Services, you acknowledge that you have read and agree to these Terms, including the waiver and release of Claims against Company Employees in Section 3.</p>
                </div>
              )}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting || (isRegistering && !termsAccepted)}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
            >
              {isSubmitting ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-gray-300 group-hover:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              {isRegistering ? 'Register' : 'Sign in'}
            </button>
          </div>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"              onClick={handleGoogleSignIn}
              disabled={isGoogleSubmitting || (isRegistering && !termsAccepted)}
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
              >
                {isGoogleSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-gray-700 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                  </svg>
                )}
                Sign in with Google
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
