// src/components/SuggestedUsersList.jsx
import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import UserCard from '../UserCard/UserCard';

/**
 * SuggestedUsersList component displays a list of recommended users to follow.
 * 
 * @param {Array} suggestedUsers - Array of user objects to display as suggestions
 * @param {Function} onFollow - Callback function when follow action is triggered
 * @param {Function} onViewProfile - Callback function when viewing a profile
 * @returns {JSX.Element} The rendered suggested users list component
 */
function SuggestedUsersList({ suggestedUsers, onFollow, onViewProfile }) {
  return (
    // Main container with top margin
    <Box sx={{ mt: 4 }}>
      {/* Section title */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Suggested Users
      </Typography>

      {/* Conditional rendering based on suggestedUsers availability */}
      {suggestedUsers && suggestedUsers.length > 0 ? (
        // Grid container for responsive layout
        <Grid container spacing={2}>
          {/* Map through suggested users array */}
          {suggestedUsers.map((user) => (
            // Grid item with responsive breakpoints
            <Grid item key={user.id} xs={12} sm={6} md={4}>
              {/* UserCard component for each suggested user */}
              <UserCard 
                user={user} 
                isFollowed={false} // Default to not followed for suggested users
                onFollowToggle={() => onFollow(user)} // Follow callback with user object
                onViewProfile={() => onViewProfile(user.id)} // View profile callback with user id
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        // Fallback text when no suggested users available
        <Typography variant="body1" color="text.secondary">
          No suggested users available at the moment.
        </Typography>
      )}
    </Box>
  );
}

export default SuggestedUsersList;