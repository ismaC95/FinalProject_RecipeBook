//Component to display recipes the information to add in each recipe is:
//- Title
//- PrepTime
//- CookTime
//- Difficulty
//- Image

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { BASE_URL } from "../../services/api";
import { getRecipe } from "../../services/api";
import { useNavigate } from "react-router-dom";

//Colors for the difficulty badges and text
const DIFFICULTY_COLORS = {
  Easy: { bg: "#E8F5F0", color: "#1E6B52" },
  Medium: { bg: "#FAEEDA", color: "#854F0B" },
  Hard: { bg: "#FCEBEB", color: "#A32D2D" },
};

function RecipeCard({ recipe }) {
  const navigate = useNavigate();

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
      onClick={() => navigate(`/recipe/${recipe._id}`)}
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

export default RecipeCard;
