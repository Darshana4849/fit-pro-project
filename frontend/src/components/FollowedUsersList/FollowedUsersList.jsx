// src/components/FollowedUsersList.jsx
import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import UserCard from '../UserCard/UserCard';

/**
 * Component that displays a list of users the current user is following.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.followedUsers - Array of user objects being followed
 * @param {Function} props.onUnfollow - Callback when unfollow action is triggered
 * @param {Function} props.onViewProfile - Callback when view profile action is triggered
 * @returns {JSX.Element} The FollowedUsersList component
 */
function FollowedUsersList({ followedUsers, onUnfollow, onViewProfile }) {
  return (
    <Box sx={{ mt: 4 }}>
      {/* Section heading */}
      <Typography variant="h5" sx={{ mb: 2 }}>Following</Typography>
      
      {/* Conditional rendering based on whether user is following anyone */}
      {followedUsers && followedUsers.length > 0 ? (
        <Grid container spacing={2}>
          {/* Map through each followed user and render a UserCard */}
          {followedUsers.map((user) => (
            <Grid item key={user.id} xs={12} sm={6} md={4}>
              <UserCard
                user={user}
                isFollowed={true}
                onFollowToggle={() => onUnfollow(user)}
                onViewProfile={() => onViewProfile(user.id)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        /* Empty state message */
        <Typography variant="body1" color="text.secondary">
          You are not following anyone yet.
        </Typography>
      )}
    </Box>
  );
}

export default FollowedUsersList;