//Displaying recipes in Discovery and My Recipes pages
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
  Pagination,
  InputAdornment,
  Slider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import RecipeCard from "./RecipeCard";
import RecipeCardSkeleton from "./RecipeCardSkeleton";

function RecipeGrid({
  recipes = [],
  loading = false,
  error = "",
  pagination = {},
  page = 1,
  onPageChange,
  search = "",
  onSearchChange,
  difficulty = "",
  onDifficultyChange,
  maxTime = "",
  onMaxTimeChange,
  maxIngredients = "",
  onMaxIngredientsChange,
  onClearFilters,
}) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = difficulty || maxTime || maxIngredients;

  return (
    <Box>
      {/* ── Search bar + filter toggle ── */}
      <Box display="flex" gap={2} mb={2} alignItems="center">
        {/* <TextField
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          fullWidth
          // size="large"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary", fontSize: 25 }} />
              </InputAdornment>
            ),
          }}
          fontSize="3rem"
          sx={{ bgcolor: "white", borderRadius: 2 }}
        /> */}
        <TextField
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary", fontSize: 25 }} />
                </InputAdornment>
              ),
              sx: {
                fontSize: "1.3rem",
              },
            },
          }}
          sx={{ bgcolor: "white", borderRadius: 2 }}
        />
        <Button
          onClick={() => setShowFilters((s) => !s)}
          startIcon={<TuneIcon />}
          variant={showFilters || hasActiveFilters ? "contained" : "outlined"}
          sx={{
            whiteSpace: "nowrap",
            borderRadius: 99,
            textTransform: "none",
            fontWeight: 700,
            fontSize: "1rem",
            borderColor: "#1A1A1A",
            color: showFilters || hasActiveFilters ? "white" : "#1A1A1A",
            bgcolor:
              showFilters || hasActiveFilters ? "#1A1A1A" : "transparent",
            "&:hover": { bgcolor: "#333", color: "white" },
            px: 3,
          }}
        >
          Filters {hasActiveFilters ? "•" : ""}
        </Button>
      </Box>

      {/* ── Filters panel ── */}
      <Collapse in={showFilters}>
        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          sx={{
            bgcolor: "white",
            border: "1px solid #F0EDE8",
            borderRadius: 3,
            p: 3,
            mb: 3,
            gap: { md: 10, xs: 3 },
          }}
        >
          {/* Difficulty */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={difficulty}
              label="Difficulty"
              onChange={(e) => onDifficultyChange(e.target.value)}
            >
              <MenuItem value="">Any</MenuItem>
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </Select>
          </FormControl>

          {/* Max total time */}
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body1" color="text.secondary" mb={1}>
              Max total time: {maxTime ? `${maxTime} min` : "Any"}
            </Typography>
            <Slider
              value={maxTime ? Number(maxTime) : 180}
              onChange={(_, val) =>
                onMaxTimeChange(val === 180 ? "" : String(val))
              }
              min={10}
              max={180}
              step={10}
              sx={{ color: "#1E6B52" }}
            />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                10 min
              </Typography>
              <Typography variant="body2" color="text.secondary">
                180 min
              </Typography>
            </Box>
          </Box>

          {/* Max ingredients */}
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body1" color="text.secondary" mb={1}>
              Max ingredients: {maxIngredients ? maxIngredients : "Any"}
            </Typography>
            <Slider
              value={maxIngredients ? Number(maxIngredients) : 20}
              onChange={(_, val) =>
                onMaxIngredientsChange(val === 20 ? "" : String(val))
              }
              min={1}
              max={20}
              step={1}
              sx={{ color: "#1E6B52" }}
            />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                1
              </Typography>
              <Typography variant="body2" color="text.secondary">
                20
              </Typography>
            </Box>
          </Box>

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button
              onClick={onClearFilters}
              sx={{
                fontSize: "1rem",
                color: "#A32D2D",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Clear filters
            </Button>
          )}
        </Box>
      </Collapse>

      {/* ── Active filter chips ── */}
      {hasActiveFilters && (
        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
          {difficulty && (
            <Chip
              label={`Difficulty: ${difficulty}`}
              onDelete={() => onDifficultyChange("")}
              sx={{ bgcolor: "#F5F3EE", fontSize: "0.9rem" }}
            />
          )}
          {maxTime && (
            <Chip
              label={`Max time: ${maxTime} min`}
              onDelete={() => onMaxTimeChange("")}
              sx={{ bgcolor: "#F5F3EE", fontSize: "0.9rem" }}
            />
          )}
          {maxIngredients && (
            <Chip
              label={`Max ingredients: ${maxIngredients}`}
              onDelete={() => onMaxIngredientsChange("")}
              sx={{ bgcolor: "#F5F3EE", fontSize: "0.9rem" }}
            />
          )}
        </Box>
      )}

      {/* ── Results count ── */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" color="text.primary" fontWeight={700}>
          {loading
            ? "Loading..."
            : `${pagination.total || 0} recipe${pagination.total !== 1 ? "s" : ""} found`}
        </Typography>
      </Box>

      {/* ── Error ── */}
      {error && (
        <Typography color="error" textAlign="center" mt={4}>
          {error}
        </Typography>
      )}

      {/* ── Recipe grid ── */}
      <Box display="flex" flexWrap="wrap" gap={2}>
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))
          : recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
      </Box>

      {/* ── Empty state ── */}
      {!loading && !error && recipes.length === 0 && (
        <Box textAlign="center" mt={8}>
          <Typography fontSize="3rem">🔍</Typography>
          <Typography fontWeight={700} mt={1}>
            No recipes found
          </Typography>
          <Typography color="text.secondary" mt={0.5}>
            Try adjusting your search or filters
          </Typography>
          {hasActiveFilters && (
            <Button
              onClick={onClearFilters}
              sx={{
                mt: 2,
                color: "#1E6B52",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Clear all filters
            </Button>
          )}
        </Box>
      )}

      {/* ── Pagination ── */}
      {!loading && pagination.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={6}>
          <Pagination
            count={pagination.totalPages}
            page={page}
            onChange={(_, val) => onPageChange(val)}
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: "#1E6B52",
                color: "white",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default RecipeGrid;
