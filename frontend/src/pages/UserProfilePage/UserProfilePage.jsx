// src/pages/UserProfilePage/UserProfilePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Avatar,
  Button,
} from '@mui/material';
import { getUserProfileById, followUser, unfollowUser } from '../../services/connectionService';
import PostFeed from '../../components/PostFeed/PostFeed';
import { AuthContext } from '../../context/AuthContext';

/**
 * UserProfilePage component displays a user's profile including:
 * - Profile information (avatar, name, email)
 * - Follow/unfollow functionality (for other users)
 * - The user's post feed
 */
export default function UserProfilePage() {
  // Get the user ID from URL parameters
  const { id } = useParams();
  // Get the current authenticated user from context
  const { user: currentUser } = useContext(AuthContext);

  // State management:
  const [viewedUser, setViewedUser] = useState(null); // The user whose profile is being viewed
  const [loadingUser, setLoadingUser] = useState(true); // Loading state for user data
  const [isFollowing, setIsFollowing] = useState(false); // Follow status of current user
  const [followLoading, setFollowLoading] = useState(false); // Loading state for follow actions

  // Load the profile data when component mounts or ID changes
  useEffect(() => {
    let mounted = true; // Flag to prevent state updates after unmount
    (async () => {
      try {
        const res = await getUserProfileById(id);
        if (!mounted) return;
        setViewedUser(res.data);
      } catch (err) {
        console.error('Error fetching viewed user:', err);
      } finally {
        if (mounted) setLoadingUser(false);
      }
    })();
    return () => { mounted = false; }; // Cleanup function
  }, [id]);

  // Check follow status when both currentUser and viewedUser are available
  useEffect(() => {
    if (loadingUser || !currentUser || !viewedUser) return;
    setIsFollowing(viewedUser.followers?.includes(currentUser.id));
  }, [loadingUser, currentUser, viewedUser]);

  /**
   * Handles following a user
   */
  const handleFollow = async () => {
    if (!viewedUser) return;
    setFollowLoading(true);
    try {
      await followUser(viewedUser.id);
      setIsFollowing(true);
      // Update the viewedUser's followers list optimistically
      setViewedUser(u => ({
        ...u,
        followers: [...(u.followers||[]), currentUser.id]
      }));
    } catch (err) {
      console.error('Error following:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  /**
   * Handles unfollowing a user
   */
  const handleUnfollow = async () => {
    if (!viewedUser) return;
    setFollowLoading(true);
    try {
      await unfollowUser(viewedUser.id);
      setIsFollowing(false);
      // Update the viewedUser's followers list optimistically
      setViewedUser(u => ({
        ...u,
        followers: (u.followers||[]).filter(fid => fid !== currentUser.id)
      }));
    } catch (err) {
      console.error('Error unfollowing:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  // Loading state UI
  if (loadingUser) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state UI (user not found)
  if (!viewedUser) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">User not found</Typography>
      </Container>
    );
  }

  // Check if this is the current user's own profile
  const isOwnProfile = currentUser?.id === viewedUser.id;

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      {/* PROFILE HEADER SECTION */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {/* User avatar */}
        <Avatar
          src={viewedUser.avatar}
          alt={viewedUser.name}
          sx={{ width: 120, height: 120 }}
        />
        
        {/* User name and email */}
        <Typography variant="h4">{viewedUser.name}</Typography>
        <Typography variant="body1" color="text.secondary">{viewedUser.email}</Typography>

        {/* Follow/Unfollow button (only shown for other users) */}
        {!isOwnProfile && (
          <Box sx={{ mt: 1 }}>
            {followLoading
              ? <CircularProgress size={24} /> // Loading state
              : isFollowing
                ? <Button variant="outlined" onClick={handleUnfollow}>Unfollow</Button>
                : <Button variant="contained" onClick={handleFollow}>Follow</Button>
            }
          </Box>
        )}
      </Box>

      {/* USER'S POSTS SECTION */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          {isOwnProfile ? 'Your Posts' : `${viewedUser.name}’s Posts`}
        </Typography>
        
        {/* Post feed component */}
        <PostFeed
          userId={viewedUser.id}
          onEdit={isOwnProfile ? post => console.log('edit', post) : null} // Edit callback for own posts
          onDelete={isOwnProfile ? post => console.log('delete', post) : null} // Delete callback for own posts
        />
      </Box>
    </Container>
  );
}