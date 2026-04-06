import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RecipeCard from "./RecipeCard";
import RecipeCardSkeleton from "./RecipeCardSkeleton";

//Sections are extracted so they are reusable and easier to manipulate
const getSections = (recipes) => [
  {
    title: "Newest recipes",
    recipes: [...recipes]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3),
  },
  {
    title: "Quickest to make",
    recipes: [...recipes]
      .sort((a, b) => a.prepTime + a.cookTime - (b.prepTime + b.cookTime))
      .slice(0, 3),
  },
];

function RecipeSummary({ recipes = [], loading = false, error = "" }) {
  const navigate = useNavigate();
  const sections = getSections(recipes);

  if (error) {
    return (
      <Typography color="error" textAlign="center" mt={4}>
        {error}
      </Typography>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      {sections.map((section) => (
        <Box key={section.title}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h4" fontWeight={700}>
              {section.title}
            </Typography>
            <Button
              onClick={() => navigate("/discover")}
              sx={{
                color: "#1E6B52",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.85rem",
              }}
            >
              See all →
            </Button>
          </Box>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <RecipeCardSkeleton key={i} />
                ))
              : section.recipes.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default RecipeSummary;
