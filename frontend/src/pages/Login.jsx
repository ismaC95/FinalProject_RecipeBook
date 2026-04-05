//Login page

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginApi } from "../services/api";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await loginApi({ email, password });
      login(data.accessToken);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: "80vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: { xs: "90%", sm: "60%", md: "45%" },
          p: 4,
          borderRadius: 3,
        }}
      >
        {/* Header */}
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>
          Welcome back
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          mb={3}
        >
          Sign in to access your recipes
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Error message */}
        {error && (
          <Typography variant="body2" color="error" textAlign="center" mb={2}>
            {error}
          </Typography>
        )}

        {/* Form */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <FormControl variant="outlined">
            <InputLabel required>Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <Button
            onClick={handleSubmit}
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 1,
              py: 1.5,
              bgcolor: "#1A1A1A",
              //   '&:hover': { bgcolor: '#155040' },
              fontWeight: 700,
              borderRadius: 2,
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Register link */}
        <Typography variant="body2" textAlign="center" color="text.secondary">
          Don't have an account?{" "}
          <Typography
            component="span"
            variant="body1"
            sx={{ color: "#1E6B52", cursor: "pointer", fontWeight: 600 }}
            onClick={() => navigate("/register")}
          >
            Create one
          </Typography>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;
