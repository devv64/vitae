"use client";

import React, { useState } from "react";
import {
  TextField,
  Slider,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { AddCircle, Delete } from "@mui/icons-material"; // Make sure MUI Icons are installed
import Header from "../components/Header"; // Import the updated Header component
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Custom MUI theme for the green color scheme
const theme = createTheme({
  palette: {
    primary: {
      main: "#86efac", // Green color (bg-green-300)
    },
  },
});

export default function PreferencesPage() {
  // Form state for general preferences
  const [preferences, setPreferences] = useState({
    wakeup_time: "07:00",
    sleep_time: "22:00",
    early_bird: 3,
    night_owl: 3,
  });

  // Form state for goals
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
      <div>
        <Header /> {/* Header added */}
        <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg">
          <Typography
            variant="h5"
            className="text-center mb-6 font-bold text-black"
          >
            Preferences
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Wakeup Time */}
            <TextField
              label="Wakeup Time"
              name="wakeup_time"
              type="time"
              value={preferences.wakeup_time}
              onChange={handleInputChange}
              fullWidth
              className="mb-4"
              InputLabelProps={{ shrink: true }}
            />

            {/* Sleep Time */}
            <TextField
              label="Sleep Time"
              name="sleep_time"
              type="time"
              value={preferences.sleep_time}
              onChange={handleInputChange}
              fullWidth
              className="mb-4"
              InputLabelProps={{ shrink: true }}
            />

            {/* Early Bird Preference Slider */}
            <Typography className="mb-2 font-bold text-black">
              Early Bird (1 to 5):
            </Typography>
            <Slider
              value={preferences.early_bird}
              onChange={handleSliderChange("early_bird")}
              min={1}
              max={5}
              valueLabelDisplay="auto"
              className="mb-6"
              color="primary" // Green theme applied to Slider
            />

            {/* Night Owl Preference Slider */}
            <Typography className="mb-2 font-bold text-black">
              Night Owl (1 to 5):
            </Typography>
            <Slider
              value={preferences.night_owl}
              onChange={handleSliderChange("night_owl")}
              min={1}
              max={5}
              valueLabelDisplay="auto"
              className="mb-6"
              color="primary" // Green theme applied to Slider
            />

            {/* Goals Section */}
            <Typography variant="h6" className="mb-4 font-bold text-black">
              Goals
            </Typography>

            {goals.map((goal, index) => (
              <div
                key={index}
                className="mb-6 border border-gray-200 p-4 rounded-lg"
              >
                {/* Goal Title */}
                <TextField
                  label={`Goal Title ${index + 1}`}
                  value={goal.title}
                  onChange={(e) =>
                    handleGoalChange(index, "title", e.target.value)
                  }
                  fullWidth
                  className="mb-4"
                  required
                />

                {/* Goal Date (Optional) */}
                <TextField
                  label="Goal Date (Optional)"
                  type="date"
                  value={goal.goal_date}
                  onChange={(e) =>
                    handleGoalChange(index, "goal_date", e.target.value)
                  }
                  fullWidth
                  className="mb-4"
                  InputLabelProps={{ shrink: true }}
                />

                {/* Priority Level */}
                <Typography className="mb-2 font-bold text-black">
                  Priority Level (1 to 5):
                </Typography>
                <Slider
                  value={goal.priority}
                  onChange={(e, newValue) =>
                    handleGoalChange(index, "priority", newValue)
                  }
                  min={1}
                  max={5}
                  valueLabelDisplay="auto"
                  color="primary"
                  className="mb-4"
                />

                {/* Estimated Practice Time */}
                <TextField
                  label="Estimated Practice Time (Hours)"
                  value={goal.practice_time}
                  onChange={(e) =>
                    handleGoalChange(index, "practice_time", e.target.value)
                  }
                  fullWidth
                  className="mb-4"
                  required
                />

                {/* Remove Goal Button */}
                {goals.length > 1 && (
                  <IconButton
                    onClick={() => removeGoal(index)}
                    color="secondary"
                  >
                    <Delete />
                  </IconButton>
                )}
              </div>
            ))}

            {/* Add Goal Button */}
            <Button
              onClick={addGoal}
              variant="outlined"
              startIcon={<AddCircle />}
              className="mb-6"
              color="primary"
            >
              Add Goal
            </Button>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="bg-green-300 hover:bg-green-400 text-white"
            >
              Save Preferences
            </Button>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );
}
