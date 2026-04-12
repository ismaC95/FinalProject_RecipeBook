import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser } from "../services/api";
import { updateUser } from "../services/api";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  IconButton,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Profile() {
  const { user, setUser } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // pre-populate from auth context
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
    }
  }, [user]);

  // ── Update profile info ──
  const handleProfileSubmit = async () => {
    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);
    try {
      await updateUser({ username, email, bio });
      // refresh user in context so navbar and profile update immediately
      const { data } = await getCurrentUser();
      setUser(data);
    } catch (err) {
      setProfileError(
        err.response?.data?.message || "Could not update profile.",
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Update password ──
  const handlePasswordSubmit = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword) {
      setPasswordError("Please fill in both password fields.");
      return;
    }
    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password.");
      return;
    }

    setPasswordLoading(true);
    try {
      await updateUser({ currentPassword, newPassword });
      setPasswordSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Could not update password.",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Box maxWidth="100%" mx="auto">
      {/* Header */}
      <Box display="flex" alignItems="center" gap={3} mb={4}>
        <Box sx={{ position: "relative" }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "#F5C842",
              color: "#1E6B52",
              fontWeight: 700,
              fontSize: "3rem",
            }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            {user?.username}
          </Typography>
          <Typography color="text.secondary">{user?.bio}</Typography>
        </Box>
      </Box>

      {/* ── Profile info section ── */}
      <Paper
        elevation={0}
        sx={{ border: "1px solid #F0EDE8", borderRadius: 3, p: 3, mb: 3 }}
      >
        <Typography variant="h6" fontWeight={700} mb={3}>
          Profile information
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Full Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            slotProps={{
              htmlInput: { minLength: 0, maxLength: 50 },
            }}
            helperText="Between 2 and 50 characters"
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            fullWidth
            multiline
            rows={3}
            slotProps={{
              htmlInput: { maxLength: 300 },
            }}
            helperText={`${bio.length}/300`}
          />

          {profileError && (
            <Typography color="error" variant="body2">
              {profileError}
            </Typography>
          )}
          {profileSuccess && (
            <Typography color="success.main" variant="body2">
              {profileSuccess}
            </Typography>
          )}

          <Button
            onClick={handleProfileSubmit}
            variant="contained"
            disabled={profileLoading}
            sx={{
              alignSelf: "flex-end",
              bgcolor: "#1A1A1A",
              color: "white",
              borderRadius: 99,
              px: 4,
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { bgcolor: "#333" },
            }}
          >
            {profileLoading ? "Saving..." : "Save changes"}
          </Button>
        </Box>
      </Paper>

      {/* ── Password section ── */}
      <Paper
        elevation={0}
        sx={{ border: "1px solid #F0EDE8", borderRadius: 3, p: 3, mb: 3 }}
      >
        <Typography variant="h6" fontWeight={700} mb={1}>
          Change password
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          You need to enter your current password to set a new one
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          {/* Current password */}
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Current password</InputLabel>
            <OutlinedInput
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowCurrentPassword((s) => !s)}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Current password"
            />
          </FormControl>

          {/* New password */}
          <FormControl variant="outlined" fullWidth>
            <InputLabel>New password</InputLabel>
            <OutlinedInput
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword((s) => !s)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="New password"
            />
          </FormControl>

          {passwordError && (
            <Typography color="error" variant="body2">
              {passwordError}
            </Typography>
          )}
          {passwordSuccess && (
            <Typography color="success.main" variant="body2">
              {passwordSuccess}
            </Typography>
          )}

          <Button
            onClick={handlePasswordSubmit}
            variant="contained"
            disabled={passwordLoading}
            sx={{
              alignSelf: "flex-end",
              bgcolor: "#1A1A1A",
              color: "white",
              borderRadius: 99,
              px: 4,
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { bgcolor: "#333" },
            }}
          >
            {passwordLoading ? "Updating..." : "Update password"}
          </Button>
        </Box>
      </Paper>

      {/* ── Danger zone ── */}
      {/* <Paper
        elevation={0}
        sx={{ border: "1px solid #FCEBEB", borderRadius: 3, p: 3 }}
      >
        <Typography variant="h6" fontWeight={700} color="#A32D2D" mb={1}>
          Danger zone
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Once you delete your account all your data and recipes will be
          permanently removed.
        </Typography>
        <Button
          variant="outlined"
          sx={{
            borderColor: "#A32D2D",
            color: "#A32D2D",
            borderRadius: 99,
            textTransform: "none",
            fontWeight: 700,
            "&:hover": { bgcolor: "#FCEBEB" },
          }}
        >
          Delete account
        </Button>
      </Paper> */}
    </Box>
  );
}

export default Profile;
