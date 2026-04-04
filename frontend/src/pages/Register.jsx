//Register page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/api';
import { register as registerApi } from '../services/api';

import { Box, Paper, Typography, TextField, Button, Divider } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';


function Register(){
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    
    const handleShowPassword = () => setShowPassword((show) => !show);

    //Data validation
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        //data validation
        if (!username || !email || !password) {
            setError('All fields are required');
            return;
        }

        if (!emailRegex.test(email)) {
            setError('Invalid email');
            return;
        }

        if (!passwordRegex.test(password)) {
            setError('Password must be at least 8 characters with uppercase, lowercase and a number');
            return;
        }


        setLoading(true)

        try {
            //try to register
            await registerApi({ username, email, password });

            //once registered, login
            const { data } = await loginApi({ email, password });
            login(data.accessToken);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
  }

  return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            minHeight: '80vh',
        }}>
            <Paper elevation={3} sx={{
                width: { xs: '90%', sm: '60%', md: '45%' },
                p: 4,
                borderRadius: 3,
            }}>
                <Typography variant= 'h5' sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }} fontWeight={700} textAlign="center" mb={1}>
                    Create an account
                </Typography>
                <Typography variant="body1" textAlign="center" color="text.secondary" mb={3}>
                    Start saving your recipes today
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {error && (
                    <Typography variant="body2" color="error" textAlign="center" mb={2}>
                        {error}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                    />

                    {/* Password field with show/hide toggle */}
                    <FormControl variant="outlined" fullWidth required>
                        <InputLabel>Password</InputLabel>
                        <OutlinedInput
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onFocus={() => setShowPasswordCriteria(true)}
                            onBlur={() => setShowPasswordCriteria(false)}
                            onChange={(e) => setPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton 
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={handleShowPassword} 
                                    edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>

                    {/*While focusing the password field */}
                    {showPasswordCriteria && (
                        <Box border='2px solid black' borderRadius={2} p={1} px={2}>
                            <Typography variant="body1" fontWeight={700} color="black" mb={1}>
                                Password requirements:
                            </Typography>
                            <Typography variant="body1" color="black">
                                - At least 8 characters
                            </Typography>
                            <Typography variant="body1" color="black">
                                - 1 lowercase
                            </Typography>
                            <Typography variant="body1" color="black" >
                                - 1 uppercase
                            </Typography>
                            <Typography variant="body1" color="black">
                                - 1 number
                            </Typography>
                        </Box>
                        )
                    }

                    <Button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={handleSubmit}
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{
                            mt: 1,
                            py: 1.5,
                            bgcolor: '#1A1A1A',
                            fontWeight: 700,
                            borderRadius: 2,
                        }}
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="body1" textAlign="center" color="text.secondary">
                    Already have an account?{' '}
                    <Typography
                        component="span"
                        variant="body1"
                        sx={{ color: '#1E6B52', cursor: 'pointer', fontWeight: 600 }}
                        onClick={() => navigate('/login')}
                    >
                        Sign in
                    </Typography>
                </Typography>
            </Paper>
        </Box>
    )
}

export default Register