// src/components/ProfileBanner.jsx
import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

/**
 * ProfileBanner component displays a user's profile banner with avatar and basic information.
 * 
 * @param {Object} user - User data containing avatar, name, and subtitle
 * @param {string} user.avatar - URL of the user's avatar image
 * @param {string} user.name - User's display name
 * @param {string} user.subtitle - User's subtitle or brief description
 * @returns {JSX.Element} The rendered profile banner component
 */
function ProfileBanner({ user }) {
  return (
    // Main container with relative positioning
    <Box sx={{ position: 'relative', mx: 12 }}> {/* Increased horizontal margin for better spacing */}
      
      {/* Banner background section */}
      <Box
        sx={{
          height: 200, // Increased banner height for more prominent display
          backgroundColor: '#DCE6F1', // Light blue background color
        }}
      />
      
      {/* Avatar and user info container */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center', // Vertically center items
          position: 'absolute', // Absolute positioning relative to parent
          top: 120, // Adjusted top position to align with taller banner
          left: 24, // Left spacing from the edge
        }}
      >
        {/* User avatar with white border */}
        <Avatar
          src={user.avatar} // Avatar image source
          alt={user.name} // Alt text for accessibility
          sx={{ 
            width: 80, 
            height: 80, 
            border: '2px solid white' // White border around avatar
          }}
        />
        
        {/* User name and subtitle container */}
        <Box sx={{ marginLeft: 2 }}> {/* Spacing between avatar and text */}
          {/* User name with bold styling */}
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {user.name}
          </Typography>
          
          {/* User subtitle with secondary text color */}
          <Typography variant="body2" color="text.secondary">
            {user.subtitle}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default ProfileBanner;