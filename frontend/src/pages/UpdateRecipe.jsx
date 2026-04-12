// src/pages/EditRecipe.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRecipe, updateRecipe } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Switch,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const UNITS = [
  "g",
  "kg",
  "ml",
  "l",
  "tsp",
  "tbsp",
  "cup",
  "oz",
  "lb",
  "units",
  "piece",
  "slice",
  "pinch",
  "handful",
  "to taste",
];

function UpdateRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ── Pre-populate form with existing recipe data ──
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await getRecipe(id);
        const recipe = data.recipe;

        // check the user is actually the owner before letting them edit
        if (user?._id !== recipe.owner?._id?.toString()) {
          navigate(`/recipes/${id}`);
          return;
        }

        // populate all fields
        setTitle(recipe.title);
        setPrepTime(recipe.prepTime);
        setCookTime(recipe.cookTime);
        setDifficulty(recipe.difficulty);
        setIsPublic(recipe.isPublic);
        setIngredients(
          recipe.ingredients.map((i) => ({
            name: i.name,
            quantity: i.quantity ?? "",
            unit: i.unit || "g",
          })),
        );
        // split instructions back into steps array
        setSteps(recipe.instructions.split("\n").filter((s) => s.trim()));
      } catch (err) {
        setError("Could not load recipe.");
      } finally {
        setFetching(false);
      }
    };
    fetchRecipe();
  }, [id]);

  // ── Ingredient handlers ──
  const addIngredient = () =>
    setIngredients([...ingredients, { name: "", quantity: "", unit: "g" }]);
  const removeIngredient = (index) =>
    setIngredients(ingredients.filter((_, i) => i !== index));
  const updateIngredient = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  // ── Step handlers ──
  const addStep = () => setSteps([...steps, ""]);
  const removeStep = (index) => setSteps(steps.filter((_, i) => i !== index));
  const updateStep = (index, value) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  // ── Submit ──
  const handleSubmit = async () => {
    setError("");

    if (!title || !prepTime || !cookTime || !difficulty) {
      setError("Please fill in all required fields.");
      return;
    }
    if (ingredients.some((i) => !i.name.trim())) {
      setError("Please fill in all ingredient names.");
      return;
    }
    if (steps.some((s) => !s.trim())) {
      setError("Please fill in all instruction steps.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title,
        prepTime: Number(prepTime),
        cookTime: Number(cookTime),
        difficulty,
        isPublic,
        ingredients,
        instructions: steps.filter((s) => s.trim()).join("\n"),
      };
      await updateRecipe(id, payload);
      navigate(`/recipe/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <Box pt={4}>
        <Skeleton height={60} sx={{ mb: 2 }} />
        <Skeleton height={400} variant="rounded" />
      </Box>
    );

  if (error && !title)
    return (
      <Box textAlign="center" mt={10}>
        <Typography fontSize="3rem">🍳</Typography>
        <Typography fontWeight={700} mt={1}>
          {error}
        </Typography>
        <Typography
          color="#1E6B52"
          sx={{ cursor: "pointer", mt: 1 }}
          onClick={() => navigate(`/recipes/${id}`)}
        >
          Back to recipe
        </Typography>
      </Box>
    );

  return (
    <Box maxWidth="100%" mx="auto">
      {/* Back button */}
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2, color: "#1E6B52" }}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h4" fontWeight={800} mb={1}>
        Edit recipe
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Update your recipe details
      </Typography>

      {error && (
        <Typography color="error" mb={3}>
          {error}
        </Typography>
      )}

      {/* ── Basic info ── */}
      <Paper
        elevation={0}
        sx={{ border: "1px solid #F0EDE8", borderRadius: 3, p: 3, mb: 3 }}
      >
        <Typography variant="h6" fontWeight={700} mb={2}>
          Basic info
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Recipe title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              label="Prep time (min)"
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              sx={{ flex: 1, minWidth: 140 }}
              required
              slotProps={{
                htmlInput: { min: 0 },
              }}
            />
            <TextField
              label="Cook time (min)"
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              sx={{ flex: 1, minWidth: 140 }}
              required
              slotProps={{
                htmlInput: { min: 0 },
              }}
            />
            <FormControl sx={{ flex: 1, minWidth: 140 }} required>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficulty}
                label="Difficulty"
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* isPublic toggle */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ border: "1px solid #F0EDE8", borderRadius: 2, px: 2, py: 1 }}
          >
            <Box>
              <Typography fontWeight={600}>
                {isPublic ? "Public recipe" : "Private recipe"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isPublic
                  ? "Everyone can see this recipe"
                  : "Only you can see this recipe"}
              </Typography>
            </Box>
            <Switch
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#1E6B52" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  bgcolor: "#1E6B52",
                },
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* ── Ingredients ── */}
      <Paper
        elevation={0}
        sx={{ border: "1px solid #F0EDE8", borderRadius: 3, p: 3, mb: 3 }}
      >
        <Typography variant="h6" fontWeight={700} mb={2}>
          Ingredients
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          {ingredients.map((ingredient, index) => (
            <Box
              key={index}
              display="flex"
              gap={1}
              alignItems="center"
              flexWrap="wrap"
            >
              <TextField
                label="Ingredient"
                value={ingredient.name}
                onChange={(e) =>
                  updateIngredient(index, "name", e.target.value)
                }
                sx={{ flex: 2, minWidth: 140 }}
                size="small"
                required
              />
              <TextField
                label="Quantity"
                type="number"
                value={ingredient.quantity}
                onChange={(e) =>
                  updateIngredient(index, "quantity", e.target.value)
                }
                sx={{ flex: 1, minWidth: 80 }}
                size="small"
                slotProps={{
                  htmlInput: { min: 0 },
                }}
              />
              <FormControl sx={{ flex: 1, minWidth: 100 }} size="small">
                <InputLabel>Unit</InputLabel>
                <Select
                  value={ingredient.unit}
                  label="Unit"
                  onChange={(e) =>
                    updateIngredient(index, "unit", e.target.value)
                  }
                >
                  {UNITS.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton
                onClick={() => removeIngredient(index)}
                disabled={ingredients.length === 1}
                sx={{ color: "#A32D2D" }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            onClick={addIngredient}
            startIcon={<AddIcon />}
            sx={{
              alignSelf: "flex-start",
              color: "#1E6B52",
              textTransform: "none",
            }}
          >
            Add ingredient
          </Button>
        </Box>
      </Paper>

      {/* ── Instructions ── */}
      <Paper
        elevation={0}
        sx={{ border: "1px solid #F0EDE8", borderRadius: 3, p: 3, mb: 4 }}
      >
        <Typography variant="h6" fontWeight={700} mb={2}>
          Instructions
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          {steps.map((step, index) => (
            <Box key={index} display="flex" gap={2} alignItems="flex-start">
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
                  mt: 1,
                }}
              >
                <Typography variant="body2" color="white" fontWeight={700}>
                  {index + 1}
                </Typography>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={step}
                onChange={(e) => updateStep(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                size="small"
              />
              <IconButton
                onClick={() => removeStep(index)}
                disabled={steps.length === 1}
                sx={{ color: "#A32D2D", mt: 0.5 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            onClick={addStep}
            startIcon={<AddIcon />}
            sx={{
              alignSelf: "flex-start",
              color: "#1E6B52",
              textTransform: "none",
            }}
          >
            Add step
          </Button>
        </Box>
      </Paper>

      <Divider sx={{ mb: 4 }} />

      {/* ── Submit ── */}
      <Box display="flex" gap={2} justifyContent="flex-end">
        <Button
          onClick={() => navigate(`/recipe/${id}`)}
          variant="outlined"
          sx={{
            borderColor: "#1A1A1A",
            color: "#1A1A1A",
            borderRadius: 99,
            px: 4,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: "#1A1A1A",
            color: "white",
            borderRadius: 99,
            px: 4,
            textTransform: "none",
            fontWeight: 700,
            "&:hover": { bgcolor: "#333" },
          }}
        >
          {loading ? "Saving..." : "Save changes"}
        </Button>
      </Box>
    </Box>
  );
}

export default UpdateRecipe;
