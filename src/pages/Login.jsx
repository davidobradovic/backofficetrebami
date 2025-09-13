import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/users-management';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData);
      
      if (result.success) {
        // Redirect to the page user was trying to access or dashboard
        const from = location.state?.from?.pathname || '/users-management';
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Neispravni podaci za prijavu');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Greška pri prijavi. Proverite podatke i pokušajte ponovo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <Icon name="BarChart3" size={32} color="var(--color-primary-foreground)" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            TrebaMi Admin
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Prijavite se u admin panel
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card p-8 rounded-lg border border-border shadow-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={20} className="text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@example.com"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Lozinka
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Unesite lozinku"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                  Zapamti me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary/80">
                  Zaboravili ste lozinku?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              iconName={isLoading ? "Loader2" : "LogIn"}
            >
              {isLoading ? 'Prijavljivanje...' : 'Prijavite se'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-2">Demo podaci:</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Email:</strong> admin@example.com</p>
              <p><strong>Lozinka:</strong> admin123</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ email: 'admin@example.com', password: 'admin123' })}
              className="mt-2 text-xs text-primary hover:text-primary/80 underline"
            >
              Kliknite da popunite demo podatke
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 TrebaMi. Sva prava zadržana.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
