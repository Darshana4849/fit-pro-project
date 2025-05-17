import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser, socialLogin } from '../../services/authService';

// Logo Imports for social login buttons
import GoogleLogo from '../../assets/google-logo.svg';
import FacebookLogo from '../../assets/facebook-logo.svg';
import GitHubLogo from '../../assets/github-logo.svg';

/**
 * Login component handles user authentication through:
 * - Email/password login
 * - Social login (Google, Facebook, GitHub)
 * - Navigation to registration and password recovery
 */
function Login() {
  // React Router navigation hook
  const navigate = useNavigate();
  
  // State management:
  const [email, setEmail] = useState(''); // Stores email input
  const [password, setPassword] = useState(''); // Stores password input
  const [message, setMessage] = useState(''); // Stores authentication messages
  const [loading, setLoading] = useState(false); // Loading state during authentication

  /**
   * Handles traditional email/password login
   */
  const handleLogin = async () => {
    setLoading(true);
    setMessage('');
    try {
      await loginUser({ email, password });
      navigate('/'); // Redirect to home on successful login
    } catch (err) {
      // Display error message from API or default message
      setMessage(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  /**
   * Handles social login redirection
   * @param {string} provider - Social login provider (google, facebook, github)
   */
  const handleSocialLogin = (provider) => {
    socialLogin(provider);
  };

  return (
    // Outer container with dark background
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Full viewport height
        backgroundColor: '#000000', // Black background
        p: 2 // Padding
      }}
    >
      {/* Login form container */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '400px', // Responsive max width
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 20px rgba(0,0,0,0.5)', // Subtle shadow
          display: 'flex',
          flexDirection: 'column',
          gap: 2, // Spacing between child elements
          backgroundColor: '#121212', // Dark background
          border: '1px solid rgba(255, 255, 255, 0.1)' // Subtle border
        }}
      >
        {/* Form header */}
        <Typography variant="h4" textAlign="center" fontWeight="bold" mb={1} color="white">
          Welcome Back!
        </Typography>
        <Typography variant="body1" textAlign="center" mb={2} color="rgba(255, 255, 255, 0.7)">
          Please log in to continue
        </Typography>

        {/* Email input field */}
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)', // Light border
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)', // Hover state
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main', // Focus state
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)', // Label color
            },
            '& .MuiInputBase-input': {
              color: 'white', // Input text color
            },
          }}
        />

        {/* Password input field */}
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
            '& .MuiInputBase-input': {
              color: 'white',
            },
          }}
        />

        {/* Login button */}
        <Button
          variant="contained"
          onClick={handleLogin}
          sx={{ 
            textTransform: 'none', // Prevent uppercase transformation
            fontWeight: 'bold',
            py: 1.5, // Vertical padding
            '&:hover': {
              backgroundColor: 'primary.dark' // Darker hover state
            }
          }}
          fullWidth
          disabled={loading} // Disable during loading
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>

        {/* Error/success message display */}
        {message && (
          <Typography color="error" textAlign="center" mt={1}>
            {message}
          </Typography>
        )}

        {/* Secondary actions (Forgot password/Register) */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Button
            variant="text"
            onClick={() => navigate('/forgot-password')}
            sx={{ 
              textTransform: 'none',
              color: 'primary.main'
            }}
          >
            Forgot Password?
          </Button>
          <Button
            variant="text"
            onClick={() => navigate('/register')}
            sx={{ 
              textTransform: 'none',
              color: 'primary.main'
            }}
          >
            Register
          </Button>
        </Box>

        {/* Divider with "OR" text */}
        <Divider sx={{ 
          my: 2, // Margin vertical
          color: 'rgba(255, 255, 255, 0.5)', // Text color
          '&::before, &::after': {
            borderColor: 'rgba(255, 255, 255, 0.12)', // Divider line color
          }
        }}>
          OR
        </Divider>

        {/* Social login buttons */}
        <Button
          variant="outlined"
          onClick={() => handleSocialLogin('google')}
          startIcon={
            <img src={GoogleLogo} alt="Google" style={{ width: 24, height: 24 }} />
          }
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)', // Slightly opaque background
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.23)',
            textTransform: 'none',
            fontWeight: 'bold',
            py: 1.5,
            '&:hover': { 
              backgroundColor: 'rgba(255, 255, 255, 0.12)', // Hover state
              borderColor: 'rgba(255, 255, 255, 0.5)'
            },
          }}
          fullWidth
        >
          Continue with Google
        </Button>

        <Button
          variant="outlined"
          onClick={() => handleSocialLogin('facebook')}
          startIcon={
            <img src={FacebookLogo} alt="Facebook" style={{ width: 24, height: 24 }} />
          }
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.23)',
            textTransform: 'none',
            fontWeight: 'bold',
            py: 1.5,
            '&:hover': { 
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderColor: 'rgba(255, 255, 255, 0.5)'
            },
          }}
          fullWidth
        >
          Continue with Facebook
        </Button>

        <Button
          variant="outlined"
          onClick={() => handleSocialLogin('github')}
          startIcon={
            <img src={GitHubLogo} alt="GitHub" style={{ width: 24, height: 24 }} />
          }
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.23)',
            textTransform: 'none',
            fontWeight: 'bold',
            py: 1.5,
            '&:hover': { 
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderColor: 'rgba(255, 255, 255, 0.5)'
            },
          }}
          fullWidth
        >
          Continue with GitHub
        </Button>
      </Box>
    </Box>
  );
}

export default Login;