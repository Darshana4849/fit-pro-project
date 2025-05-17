// src/components/UserCard/UserCard.jsx
import React from 'react';
import { Card, CardContent, CardActions, Avatar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

/**
 * UserCard component displays a user profile card with follow/unfollow functionality.
 * 
 * @param {Object} user - User data object
 * @param {string} user.id - Unique identifier for the user
 * @param {string} user.name - User's display name
 * @param {string} user.avatar - URL of the user's avatar image
 * @param {boolean} isFollowed - Indicates if the current user follows this user
 * @param {Function} onFollowToggle - Callback function for follow/unfollow action
 * @returns {JSX.Element} The rendered user card component
 */
function UserCard({ user, isFollowed, onFollowToggle }) {
  // Hook for programmatic navigation
  const navigate = useNavigate();

  /**
   * Handles click on user profile to navigate to their profile page
   */
  const handleProfileClick = () => {
    // Navigate to the user's profile page using their ID
    navigate(`/profile/${user.id}`);
  };

  return (
    // Card container with max width and margin
    <Card sx={{ maxWidth: 345, m: 1 }}>
      {/* Clickable card content area */}
      <CardContent 
        onClick={handleProfileClick} 
        sx={{ cursor: 'pointer' }} // Show pointer cursor on hover
      >
        {/* Flex container for avatar and name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Conditional avatar rendering */}
          {user.avatar ? (
            // Avatar with image if available
            <Avatar src={user.avatar} alt={user.name} />
          ) : (
            // Fallback avatar icon if no image
            <Avatar>
              <AccountCircleIcon />
            </Avatar>
          )}
          {/* User name */}
          <Typography variant="h6">{user.name}</Typography>
        </Box>
      </CardContent>

      {/* Card actions section */}
      <CardActions>
        {/* Follow/Unfollow button */}
        <Button 
          size="small" 
          variant="contained" 
          onClick={() => onFollowToggle(user)} // Pass user object to callback
        >
          {/* Button text changes based on follow state */}
          {isFollowed ? 'Unfollow' : 'Follow'}
        </Button>
      </CardActions>
    </Card>
  );
}

export default UserCard;