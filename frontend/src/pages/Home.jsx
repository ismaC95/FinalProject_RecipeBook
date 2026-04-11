//Landing page

import { useState, useEffect } from "react";
import { getRecipes } from "../services/api";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import RecipeSummary from "../components/recipes/RecipeSummary";

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getRecipes();
        setRecipes(data.recipes);
      } catch (err) {
        setError("Could not load recipes.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <>
      {/* Welcome content */}
      <Box
        display="flex"
        gap={{ xs: 4, md: 10 }}
        sx={{
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          minHeight: "30vh",
          alignItems: "center",
          py: { xs: 4, md: 6 },
        }}
      >
        {/* Welcome text */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h3"
            fontWeight={800}
            mb={3}
            sx={{ fontSize: { xs: "2rem", md: "3.5rem" } }}
          >
            Your cooking recipes,
            <br /> all in one place
          </Typography>

          {/* Benefits list */}
          {[
            "Create and store your favourite recipes",
            "Access them from anywhere, anytime",
            "Share your creations with the world",
          ].map((benefit) => (
            <Box
              key={benefit}
              display="flex"
              alignItems="center"
              gap={1}
              mb={1}
            >
              <CheckCircleIcon
                sx={{ color: "#1E6B52", fontSize: "1.3rem", flexShrink: 0 }}
              />
              <Typography
                sx={{ fontSize: { xs: "1rem", md: "1.5rem" } }}
                color="text.secondary"
              >
                {benefit}
              </Typography>
            </Box>
          ))}

          {/* Action buttons */}
          <Box display="flex" gap={2} mt={4} flexWrap="wrap">
            <Button
              variant="contained"
              onClick={() =>
                user ? navigate("/create-recipe") : navigate("/register")
              }
              sx={{
                bgcolor: "#1A1A1A",
                color: "white",
                fontWeight: 700,
                borderRadius: 99,
                px: 4,
                py: 1.5,
                "&:hover": { bgcolor: "#333" },
                textTransform: "none",
                fontSize: { xs: "1rem", md: "1.3rem" },
              }}
            >
              Get started
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/discover")}
              sx={{
                borderColor: "#1A1A1A",
                color: "#1A1A1A",
                fontWeight: 700,
                borderRadius: 99,
                px: 4,
                py: 1.5,
                "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                textTransform: "none",
                fontSize: { xs: "1rem", md: "1.3rem" },
              }}
            >
              Browse recipes
            </Button>
          </Box>
        </Box>

        {/* Images on the right */}
        {/* TO REVIEW */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            height: 320,
          }}
        >
          {/* Card 1 — back */}
          <Box
            sx={{
              position: "absolute",
              width: 220,
              height: 160,
              bgcolor: "#F5C842",
              borderRadius: 4,
              transform: "rotate(-8deg) translate(-40px, 20px)",
            }}
          />

          {/* Card 2 — middle */}
          <Box
            sx={{
              position: "absolute",
              width: 220,
              height: 160,
              bgcolor: "#1E6B52",
              borderRadius: 4,
              transform: "rotate(4deg) translate(20px, -10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography fontWeight={800} fontSize="1.4rem" color="white">
              Umamade
            </Typography>
          </Box>

          {/* Card 3 — front */}
          <Box
            sx={{
              position: "absolute",
              width: 220,
              height: 160,
              bgcolor: "white",
              borderRadius: 4,
              transform: "rotate(-2deg) translate(-10px, 40px)",
              border: "1px solid #eee",
              p: 2,
            }}
          >
            <Typography
              fontWeight={700}
              fontSize="0.95rem"
              color="#1A1A1A"
              mb={0.5}
            >
              Spaghetti Carbonara
            </Typography>
            <Typography fontSize="0.8rem" color="text.secondary">
              30 min · Easy
            </Typography>
            <Box display="flex" gap={0.5} mt={1}>
              {["pasta", "eggs", "pancetta"].map((tag) => (
                <Box
                  key={tag}
                  sx={{
                    bgcolor: "#F5F3EE",
                    borderRadius: 99,
                    px: 1,
                    py: 0.3,
                    fontSize: "0.7rem",
                    color: "#1E6B52",
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <RecipeSummary recipes={recipes} loading={loading} error={error} />
    </>
  );
}

export default Home;
