//How it looks when you open a recipe
//Page changes based on user being the owner adding Edit and Delete recipe buttons
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipe } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../services/api";
import {
  Box,
  Typography,
  Chip,
  Divider,
  Grid,
  Skeleton,
  IconButton,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";

const DIFFICULTY_COLORS = {
  Easy: { bg: "#E8F5F0", color: "#1E6B52" },
  Medium: { bg: "#FAEEDA", color: "#854F0B" },
  Hard: { bg: "#FCEBEB", color: "#A32D2D" },
};

function RecipePageSkeleton() {
  return (
    <Box>
      <Skeleton variant="rounded" height={400} sx={{ mb: 4 }} />
      <Skeleton width="60%" height={48} sx={{ mb: 1 }} />
      <Skeleton width="40%" height={24} sx={{ mb: 4 }} />
      <Skeleton variant="rounded" height={120} sx={{ mb: 4 }} />
      <Skeleton variant="rounded" height={200} />
    </Box>
  );
}

function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await getRecipe(id);
        console.log("recipe data:", data.recipe); // add this
        console.log("owner:", data.recipe.owner); // add this
        setRecipe(data.recipe);
      } catch (err) {
        setError("Recipe not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading)
    return (
      <Box maxWidth="100%" mx="auto" pt={4}>
        <RecipePageSkeleton />
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" mt={10}>
        <Typography fontSize="3rem">🍳</Typography>
        <Typography fontWeight={700} mt={1}>
          {error}
        </Typography>
        <Typography
          color="#1E6B52"
          sx={{ cursor: "pointer", mt: 1 }}
          onClick={() => navigate("/discover")}
        >
          Back to recipes
        </Typography>
      </Box>
    );

  const isOwner = user?.id === recipe.owner?._id?.toString();
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <Box maxWidth="100%" mx="auto" pb={8}>
      {/* Back button */}
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2, color: "#1E6B52" }}>
        <ArrowBackIcon />
      </IconButton>

      {/* Hero image */}
      <Box
        component="img"
        src={`${BASE_URL}${recipe.imageUrl}`}
        alt={recipe.title}
        sx={{
          width: "100%",
          height: { xs: 240, md: 450 },
          objectFit: "cover",
          borderRadius: 4,
          mb: 4,
        }}
      />

      {/* Title + badges + Author */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap={2}
        mb={2}
      >
        <Typography variant="h4" fontWeight={800}>
          {recipe.title}
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
          <Chip
            label={recipe.difficulty}
            sx={{
              bgcolor: DIFFICULTY_COLORS[recipe.difficulty]?.bg,
              color: DIFFICULTY_COLORS[recipe.difficulty]?.color,
              fontWeight: 700,
              fontSize: { sm: "0.8rem", md: "1.2rem" },
              p: 1,
            }}
          />
          <Chip
            icon={
              recipe.isPublic ? (
                <PublicIcon sx={{ fontSize: 14 }} />
              ) : (
                <LockIcon sx={{ fontSize: 14 }} />
              )
            }
            label={recipe.isPublic ? "Public" : "Private"}
            size="small"
            sx={{
              bgcolor: "#F5F3EE",
              color: "#6B6B6B",
              fontWeight: 600,
              fontSize: { sm: "0.8rem", md: "1.2rem" },
              p: 1,
            }}
          />
        </Box>
      </Box>

      {/* Time info */}
      <Box display="flex" gap={4} mb={4} flexWrap="wrap">
        <Box display="flex" alignItems="center" gap={0.5}>
          <AccessTimeIcon sx={{ fontSize: 18, color: "#1E6B52" }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { sm: "0.8rem", md: "1.2rem" } }}
          >
            Prep: <strong>{recipe.prepTime} min</strong>
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={0.5}>
          <WhatshotIcon sx={{ fontSize: 18, color: "#854F0B" }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { sm: "0.8rem", md: "1.2rem" } }}
          >
            Cook: <strong>{recipe.cookTime} min</strong>
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={0.5}>
          <AccessTimeIcon sx={{ fontSize: 18, color: "#6B6B6B" }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { sm: "0.8rem", md: "1.2rem" } }}
          >
            Total: <strong>{totalTime} min</strong>
          </Typography>
        </Box>
      </Box>

      {/* Owner + Update and delete buttons */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap={2}
        mb={2}
      >
        <Typography
          color="text.secondary"
          sx={{ fontSize: { sm: "0.8rem", md: "1.2rem" } }}
        >
          Created by {recipe.owner?.username}
        </Typography>
        {/* Edit/Delete — only visible to owner */}
        {isOwner && (
          <Box display="flex" gap={2}>
            <Chip
              label="Edit recipe"
              onClick={() => navigate(`/recipes/${id}/edit`)}
              sx={{
                bgcolor: "#1E6B52",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
                "&:hover": { bgcolor: "#155040" },
                fontSize: { sm: "0.8rem", md: "1.2rem" },
                px: 2,
              }}
            />
            <Chip
              label="Delete recipe"
              sx={{
                bgcolor: "#FCEBEB",
                color: "#A32D2D",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: { sm: "0.8rem", md: "1.2rem" },
                px: 2,
              }}
            />
          </Box>
        )}
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Ingredients + Instructions side by side on desktop */}
      <Grid container spacing={{ xs: 4, md: 10 }}>
        {/* Ingredients */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={2}>
            Ingredients
          </Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            {recipe.ingredients.map((ingredient, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={1}
                sx={{ borderBottom: "1px solid #F0EDE8" }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    textTransform: "capitalize",
                    fontSize: { sm: "0.8rem", md: "1.2rem" },
                  }}
                >
                  {ingredient.name}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{ fontSize: { sm: "0.8rem", md: "1.2rem" } }}
                >
                  {ingredient.quantity} {ingredient.unit}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Instructions */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h5" fontWeight={700} mb={2}>
            Instructions
          </Typography>
          {/* <Box display="flex" flexDirection="column" gap={3}>
            {recipe.instructions
              .split("\n")
              .filter((step) => step.trim())
              .map((step, index) => (
                <Box key={index} display="flex" gap={2}>
                  <Box
                    sx={{
                      minWidth: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: "#1E6B52",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      mt: 0.3,
                    }}
                  >
                    <Typography
                      variant="body1"
                      color="white"
                      fontWeight={700}
                      sx={{ fontSize: { sm: "0.8rem", md: "1.2rem" } }}
                    >
                      {index + 1}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.8,
                      fontSize: { sm: "0.8rem", md: "1.2rem" },
                    }}
                  >
                    {step}
                  </Typography>
                </Box>
              ))}
          </Box> */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              lineHeight: 1.8,
              fontSize: { sm: "0.8rem", md: "1.2rem" },
            }}
          >
            {recipe.instructions}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RecipePage;
