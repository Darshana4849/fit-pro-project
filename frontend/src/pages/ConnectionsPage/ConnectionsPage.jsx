// src/pages/ConnectionsPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FollowedUsersList from '../../components/FollowedUsersList/FollowedUsersList';
import SuggestedUsersList from '../../components/SuggestedUsersList/SuggestedUsersList';
import { getFollowing, getSuggestions, followUser, unfollowUser } from '../../services/connectionService';

/**
 * ConnectionsPage component displays the user's connections and suggestions
 * @returns {JSX.Element} The connections page component
 */
function ConnectionsPage() {
  // State for storing followed users
  const [followedUsers, setFollowedUsers] = useState([]);
  // State for storing suggested users
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  // Loading state
  const [loading, setLoading] = useState(true);
  // Navigation hook
  const navigate = useNavigate();

  /**
   * Effect hook to fetch connections data when component mounts
   */
  useEffect(() => {
    async function fetchConnections() {
      try {
        // Fetch followed users and suggestions in parallel
        const followingResponse = await getFollowing();
        const suggestionsResponse = await getSuggestions();
        // Update state with fetched data (fallback to empty array if null)
        setFollowedUsers(followingResponse.data || []);
        setSuggestedUsers(suggestionsResponse.data || []);
      } catch (error) {
        console.error("Error fetching connections:", error);
      } finally {
        // Set loading to false regardless of success/failure
        setLoading(false);
      }
    }
    fetchConnections();
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Handles following a user
   * @param {Object} user - User to follow
   */
  const handleFollow = async (user) => {
    try {
      await followUser(user.id);
      // Add user to followed list and remove from suggestions
      setFollowedUsers(prev => Array.isArray(prev) ? [...prev, user] : [user]);
      setSuggestedUsers(prev => Array.isArray(prev) ? prev.filter(u => u.id !== user.id) : []);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  /**
   * Handles unfollowing a user
   * @param {Object} user - User to unfollow
   */
  const handleUnfollow = async (user) => {
    try {
      await unfollowUser(user.id);
      // Remove user from followed list and add to suggestions
      setFollowedUsers(prev => Array.isArray(prev) ? prev.filter(u => u.id !== user.id) : []);
      setSuggestedUsers(prev => Array.isArray(prev) ? [...prev, user] : [user]);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  /**
   * Handles navigation to user profile
   * @param {string} userId - ID of the user to view
   */
  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  // Loading state UI
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Main component UI
  return (
    <Container sx={{ mt: 4 }}>
      {/* Page title */}
      <Typography variant="h4" gutterBottom>Connections</Typography>

      {/* Followed users list component */}
      <FollowedUsersList
        followedUsers={followedUsers}
        onUnfollow={handleUnfollow}
        onViewProfile={handleViewProfile}
      />

      {/* Suggested users list component */}
      <SuggestedUsersList
        suggestedUsers={suggestedUsers}
        onFollow={handleFollow}
        onViewProfile={handleViewProfile}
      />
    </Container>
  );
}

export default ConnectionsPage;