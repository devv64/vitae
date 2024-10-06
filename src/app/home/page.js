"use client"; // This makes the entire component a Client Component

import React from "react";
import Header from "../components/Header";
import MainContent from "../components/MainContent";

const App = () => {
  return (
    <>
      <div className="main-content-wrapper">
        <MainContent />
      </div>
      <style jsx>{`
        .main-content-wrapper {
          transform: scale(0.7); /* Scale down by 70% */
          transform-origin: top ; /* Set the scaling point */
        }

        builder-component {
          max-width: none !important;
        }
      `}</style>
    </>
  );
};

export default App;
