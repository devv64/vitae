"use client";

import React, { useState } from "react";
import {
  TextField,
  Slider,
  Typography,
  Button,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import { AddCircle, Delete } from "@mui/icons-material"; // MUI Icons
import Header from "../components/Header"; // Import the updated Header component
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Custom MUI theme for a consistent green color scheme
const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50", // Consistent green color
    },
    secondary: {
      main: "#d32f2f", // Red color for delete button
    },
  },
});

export default function PreferencesPage() {
  // State for general preferences
  const [preferences, setPreferences] = useState({
    wakeup_time: "07:00",
    sleep_time: "22:00",
    early_bird: 3,
    night_owl: 3,
    activity_level: 3,
    mental_health: 3,
  });

  // State for goals
  const [goals, setGoals] = useState([
    { title: "", goal_date: "", priority: 3, practice_time: "" },
  ]);

  // Handle input changes for preferences
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  // Handle slider changes for preferences
  const handleSliderChange = (name) => (event, newValue) => {
    setPreferences((prev) => ({ ...prev, [name]: newValue }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...preferences, goals }),
      });

      if (response.ok) {
        alert("Preferences and goals updated successfully!");
      } else {
        alert("Failed to update preferences.");
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  // Handle changes for goals input
  const handleGoalChange = (index, field, value) => {
    const updatedGoals = [...goals];
    updatedGoals[index][field] = value;
    setGoals(updatedGoals);
  };

  // Add a new goal
  const addGoal = () => {
    setGoals([
      ...goals,
      { title: "", goal_date: "", priority: 3, practice_time: "" },
    ]);
  };

  // Remove a goal
  const removeGoal = (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: "green.50",
          minHeight: "100vh",
          py: 8,
        }}
      >
        <Box
          sx={{
            maxWidth: "900px",
            mx: "auto",
            backgroundColor: "white",
            p: 5,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
            Set Your Preferences
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
              {/* Wakeup Time */}
              <TextField
                label="Wakeup Time"
                name="wakeup_time"
                type="time"
                value={preferences.wakeup_time}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                sx={{ gridColumn: "1 / 2" }}
              />

              {/* Sleep Time */}
              <TextField
                label="Sleep Time"
                name="sleep_time"
                type="time"
                value={preferences.sleep_time}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                sx={{ gridColumn: "2 / 3" }}
              />

              {/* Early Bird Preference Slider */}
              <Box sx={{ gridColumn: "1 / 2" }}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Early Bird Preference
                </Typography>
                <Slider
                  value={preferences.early_bird}
                  onChange={handleSliderChange("early_bird")}
                  min={1}
                  max={5}
                  valueLabelDisplay="auto"
                  color="primary"
                />
              </Box>

              {/* Night Owl Preference Slider */}
              <Box sx={{ gridColumn: "2 / 3" }}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Night Owl Preference
                </Typography>
                <Slider
                  value={preferences.night_owl}
                  onChange={handleSliderChange("night_owl")}
                  min={1}
                  max={5}
                  valueLabelDisplay="auto"
                  color="primary"
                />
              </Box>

              {/* Activity Level Slider */}
              <Box sx={{ gridColumn: "1 / 2" }}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Desired Activity Level
                </Typography>
                <Slider
                  value={preferences.activity_level}
                  onChange={handleSliderChange("activity_level")}
                  min={1}
                  max={5}
                  valueLabelDisplay="auto"
                  color="primary"
                />
              </Box>

              {/* Mental Health Slider */}
              <Box sx={{ gridColumn: "2 / 3" }}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Mental Health Priority
                </Typography>
                <Slider
                  value={preferences.mental_health}
                  onChange={handleSliderChange("mental_health")}
                  min={1}
                  max={5}
                  valueLabelDisplay="auto"
                  color="primary"
                />
              </Box>
            </Box>

            {/* Goals Section */}
            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              Goals
            </Typography>

            {goals.map((goal, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 1,
                  mb: 2,
                  position: "relative",
                }}
              >
                {/* Goal Title */}
                <TextField
                  label={`Goal Title ${index + 1}`}
                  value={goal.title}
                  onChange={(e) => handleGoalChange(index, "title", e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                />

                {/* Goal Date */}
                <TextField
                  label="Goal Date (Optional)"
                  type="date"
                  value={goal.goal_date}
                  onChange={(e) =>
                    handleGoalChange(index, "goal_date", e.target.value)
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />

                {/* Priority Level Slider */}
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Priority Level
                </Typography>
                <Slider
                  value={goal.priority}
                  onChange={(e, newValue) =>
                    handleGoalChange(index, "priority", newValue)
                  }
                  min={1}
                  max={5}
                  valueLabelDisplay="auto"
                  sx={{ mb: 2 }}
                  color="primary"
                />

                {/* Practice Time */}
                <TextField
                  label="Estimated Practice Time (Hours)"
                  value={goal.practice_time}
                  onChange={(e) =>
                    handleGoalChange(index, "practice_time", e.target.value)
                  }
                  fullWidth
                  required
                />

                {/* Remove Goal Button */}
                {goals.length > 1 && (
                  <IconButton
                    onClick={() => removeGoal(index)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: "secondary.main",
                    }}
                  >
                    <Delete />
                  </IconButton>
                )}
              </Box>
            ))}

            {/* Add Goal Button */}
            <Button
              onClick={addGoal}
              variant="contained"
              startIcon={<AddCircle />}
              sx={{ mb: 4, display: "block", mx: "auto" }}
            >
              Add Goal
            </Button>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ backgroundColor: "primary.main", color: "white", py: 1.5 }}
            >
              Save Preferences
            </Button>
          </form>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
