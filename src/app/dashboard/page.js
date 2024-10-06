"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary components from Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [heartRateData, setHeartRateData] = useState([]); // Store heart rate values
  const [loading, setLoading] = useState(true);
  const [maxHeartRate, setMaxHeartRate] = useState(100); // Placeholder max heart rate, this should be dynamic

  useEffect(() => {
    // Fetch data from your API
    async function fetchData() {
      try {
        const res = await fetch("/api/garmin/activities");
        const data = await res.json();
        if (data.heartRateValues) {
          setHeartRateData(processHeartRateData(data.heartRateValues)); // Process heart rate data
          setMaxHeartRate(data.maxHeartRate || 100); // Set max heart rate dynamically from data
        }
      } catch (error) {
        console.error("Error fetching heart rate data:", error);
        setHeartRateData([]); // In case of error, set as an empty array
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Function to process heart rate data
  const processHeartRateData = (heartRateValues) => {
    return heartRateValues
      .filter(([timestamp, heartRate]) => heartRate !== null) // Remove entries with null heart rate
      .map(([timestamp, heartRate]) => ({
        time: new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }), // Format time
        heartRate,
      }));
  };

  // Separate heart rate data based on thresholds for color coding
  const processColorCodedData = () => {
    const lowHeartRate = [];
    const moderateHeartRate = [];
    const highHeartRate = [];

    heartRateData.forEach((entry) => {
      const percentageOfMax = (entry.heartRate / maxHeartRate) * 100;

      if (percentageOfMax < 60) {
        lowHeartRate.push(entry.heartRate);
        moderateHeartRate.push(null); // null for other datasets
        highHeartRate.push(null);
      } else if (percentageOfMax < 80) {
        lowHeartRate.push(null);
        moderateHeartRate.push(entry.heartRate);
        highHeartRate.push(null);
      } else {
        lowHeartRate.push(null);
        moderateHeartRate.push(null);
        highHeartRate.push(entry.heartRate);
      }
    });

    return { lowHeartRate, moderateHeartRate, highHeartRate };
  };

  // Call color-coded data processor
  const { lowHeartRate, moderateHeartRate, highHeartRate } =
    processColorCodedData();

  // Prepare the chart data for the first chart with shrinking effect
  const shrunkChartData = {
    labels: heartRateData.map((entry) => entry.time), // Time labels
    datasets: [
      {
        label: "Heart Rate",
        data: heartRateData.map((entry) => entry.heartRate), // Heart rate values
        borderColor: "rgb(75, 192, 192)", // Line color
        tension: 0.4, // Higher tension for the shrinking effect in the middle
        fill: false, // Don't fill under the line
      },
    ],
  };

  // Prepare the chart data for color-coded heart rate analysis
  const colorCodedChartData = {
    labels: heartRateData.map((entry) => entry.time), // Time labels
    datasets: [
      {
        label: "Low Heart Rate",
        data: lowHeartRate,
        borderColor: "blue",
        fill: false,
        pointRadius: 2,
      },
      {
        label: "Moderate Heart Rate",
        data: moderateHeartRate,
        borderColor: "green",
        fill: false,
        pointRadius: 2,
      },
      {
        label: "High Heart Rate (Stressful)",
        data: highHeartRate,
        borderColor: "red",
        fill: false,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Heart Rate Over Time",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Heart Rate (bpm)",
        },
      },
    },
  };

  return (
    <div>
      <h2>Heart Rate Data</h2>
      {loading && <p>Loading...</p>}
      {!loading && heartRateData.length === 0 && (
        <p>No heart rate data available</p>
      )}
      {!loading && heartRateData.length > 0 && (
        <>
          <h3>Shrunk Heart Rate Graph</h3>
          <Line data={shrunkChartData} options={options} />
          <h3>Color-Coded Heart Rate Graph</h3>
          <Line data={colorCodedChartData} options={options} />
        </>
      )}
    </div>
  );
}
