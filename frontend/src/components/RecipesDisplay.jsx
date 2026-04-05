//Component to display recipes in squares, flex wrap. The information to add in each recipe are:
//- Title
//- PrepTime
//- CookTime
//- Difficulty
//- Image

import { useState, useEffect } from "react";
import { useSortedRecipes } from "../hooks/useSortedRecipes";
import { getRecipes } from "../services/api";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Skeleton,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { BASE_URL } from "../services/api";

//Colors for the difficulty badges and text
const DIFFICULTY_COLORS = {
  Easy: { bg: "#E8F5F0", color: "#1E6B52" },
  Medium: { bg: "#FAEEDA", color: "#854F0B" },
  Hard: { bg: "#FCEBEB", color: "#A32D2D" },
};

function RecipeCard({ recipe }) {
  return (
    <Card
      sx={{
        width: {
          xs: "100%",
          sm: "49%",
          md: "32%",
        },
        borderRadius: 3,
        border: "1px solid #eee",
        boxShadow: "none",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        },
      }}
    >
      {/* Image */}
      <CardMedia
        component="img"
        height="180"
        image={`${BASE_URL}${recipe.imageUrl}`}
        alt={recipe.title}
        sx={{ objectFit: "cover" }}
      />

      <CardContent sx={{ p: 2 }}>
        {/* Difficulty badge */}
        <Chip
          label={recipe.difficulty}
          size="small"
          sx={{
            mb: 1,
            bgcolor: DIFFICULTY_COLORS[recipe.difficulty]?.bg,
            color: DIFFICULTY_COLORS[recipe.difficulty]?.color,
            fontWeight: 600,
            fontSize: "1rem",
            height: 25,
          }}
        />

        {/* Title */}
        {/* Webkit is used to keep the title in 2 lines, whatever overflows won't be shown */}
        <Typography
          fontWeight={700}
          fontSize="1.25rem"
          mb={1}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {recipe.title}
        </Typography>

        {/* Prep and Cook time */}
        <Box display="flex" gap={2} mt={1}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <AccessTimeIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body1" color="text.secondary">
              Prep {recipe.prepTime}m
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <WhatshotIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body1" color="text.secondary">
              Cook {recipe.cookTime}m
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

//The skeleton will show only when the content is loading
function RecipeCardSkeleton() {
  return (
    <Box
      sx={{
        width: {
          xs: "100%",
          sm: "49%",
          md: "32%",
        },
      }}
    >
      <Skeleton variant="rounded" height={180} />
      <Box pt={1}>
        <Skeleton width="30%" height={24} />
        <Skeleton width="80%" height={24} />
        <Skeleton width="60%" height={20} />
      </Box>
    </Box>
  );
}

function RecipeDisplay() {
  const [recipes, setRecipes] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sortedRecipes = useSortedRecipes(recipes, sortBy);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data } = await getRecipes();
        setRecipes(data.recipes);
      } catch (err) {
        setError("Could not load recipes. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      {/* Error */}
      {error && (
        <Typography color="error" textAlign="center" mt={4}>
          {error}
        </Typography>
      )}

      {/* Recipe grid */}
      <Box display="flex" justifyContent={"center"} flexWrap="wrap" gap={2}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))
          : sortedRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
      </Box>

      {/* Empty state */}
      {!loading && !error && recipes.length === 0 && (
        <Box textAlign="center" mt={8}>
          <Typography fontSize="3rem">🍳</Typography>
          <Typography fontWeight={700} mt={1}>
            No recipes yet
          </Typography>
          <Typography color="text.secondary" mt={0.5}>
            Be the first to add one!
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default RecipeDisplay;
