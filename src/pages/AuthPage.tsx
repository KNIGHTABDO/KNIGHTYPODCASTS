import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Lock } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';

export const AuthPage: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signUp } = useAuthStore();
  const navigate = useNavigate();
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isSignIn) {
      if (!username.trim()) {
        newErrors.username = 'Username is required';
      } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        newErrors.username = 'Username must be 3-20 characters and can only contain letters, numbers, and underscores';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      let result;
      
      if (isSignIn) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, username);
      }
      
      if (result.error) {
        if (result.error.message.includes('User already registered')) {
          setErrors({ email: 'An account with this email already exists' });
        } else if (result.error.message.includes('Username already taken')) {
          setErrors({ username: 'This username is already taken' });
        } else {
          throw result.error;
        }
        return;
      }
      
      navigate('/admin');
    } catch (error: unknown) {
      console.error('Authentication error:', error);
      setErrors({
        form: error instanceof Error ? error.message : 'Authentication failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleAuthMode = () => {
    setIsSignIn(!isSignIn);
    setErrors({});
  };
  
  return (
    <Layout>
      <div className="min-h-[calc(100vh-64px-300px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-green-600 text-white mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <CardTitle>{isSignIn ? 'Sign In' : 'Create Account'}</CardTitle>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errors.form && (
                <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded">
                  {errors.form}
                </div>
              )}
              
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                fullWidth
              />
              
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                fullWidth
              />

              {!isSignIn && (
                <Input
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={errors.username}
                  fullWidth
                />
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                leftIcon={isSignIn ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              >
                {isSignIn ? 'Sign In' : 'Create Account'}
              </Button>
              
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-green-500 hover:text-green-400 text-sm"
              >
                {isSignIn
                  ? "Don't have an account? Sign Up"
                  : 'Already have an account? Sign In'}
              </button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};