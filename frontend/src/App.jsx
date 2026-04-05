import "./App.css";
import { Box, Grid } from "@mui/material";
import { Routes, Route } from "react-router-dom";

//Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Discover from "./pages/Discover";

//Components
import LoggedInNavBar from "./components/LoggedInNavBar";

function App() {
  return (
    /* Keep the footer in the bottom of the screen */
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Navbar */}
      <LoggedInNavBar />

      {/*Main content*/}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Grid container>
          <Grid
            size={{ xs: 12, md: 8 }}
            offset={{ md: 2 }}
            px={{ xs: 2, md: 0 }}
          >
            <Box mt={{ xs: 2, md: 10 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/discover" element={<Discover />} />
              </Routes>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default App;
