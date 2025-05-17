// src/components/Profile/ProfileActions.jsx
import React from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * ProfileActions component renders action buttons for user profile interactions.
 * 
 * @param {Function} onEdit - Callback function to handle edit profile action
 * @returns {JSX.Element} The rendered profile action buttons component
 */
function ProfileActions({ onEdit }) {
  // Hook for programmatic navigation
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,  // Spacing between buttons
        flexWrap: 'wrap',  // Allow buttons to wrap on small screens
        mx: 8,  // Horizontal margin
        mt: 4,  // Top margin
      }}
    >
      {/* Edit Profile Button */}
      <Button 
        variant="outlined"  // Outlined style
        onClick={onEdit}  // Click handler from props
      >
        Edit profile
      </Button>

      {/* Connections Button */}
      <Button 
        variant="outlined"  // Outlined style
        onClick={() => navigate('/connections')}  // Navigate to connections page
      >
        Connections
      </Button>
    </Box>
  );
}

export default ProfileActions;