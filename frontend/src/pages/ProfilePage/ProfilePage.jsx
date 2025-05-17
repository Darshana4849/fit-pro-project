import React, { useState, useEffect } from 'react';
import { Box, Container, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProfileBanner from '../../components/Profile/ProfileBanner';
import ProfileActions from '../../components/Profile/ProfileActions';
import EditProfileDialog from '../../components/Profile/EditProfileDialog';
import PostFeed from '../../components/PostFeed/PostFeed';
import EditPostDialog from '../../components/Post/EditPostDialog';
import {
  getUserProfile,
  updateProfile,
  deleteProfile
} from '../../services/authService';
import { deletePost } from '../../services/postService';

/**
 * ProfilePage component displays the user's profile with their posts
 * and provides functionality to edit profile and posts.
 */
export default function ProfilePage() {
  // State management:
  const [user, setUser] = useState(null); // Stores user profile data
  const [openEditDialog, setOpenEditDialog] = useState(false); // Controls edit profile dialog visibility
  const [loading, setLoading] = useState(true); // Loading state
  const [editingPost, setEditingPost] = useState(null); // Stores the post being edited
  const navigate = useNavigate(); // Navigation hook

  // 1) Load current user's profile when component mounts
  useEffect(() => {
    (async () => {
      try {
        const res = await getUserProfile();
        setUser(res.data); // Set user data from API response
      } catch (err) {
        console.error('Error fetching profile:', err);
        setUser(null); // Reset user state on error
      } finally {
        setLoading(false); // Always set loading to false when done
      }
    })();
  }, []); // Empty dependency array means this runs only once on mount

  // Loading state UI - shows a circular progress indicator
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mt: 10,
        bgcolor: 'black',
        minHeight: '100vh'
      }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  // Error state UI - shows when user data couldn't be loaded
  if (!user) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        mt: 10,
        bgcolor: 'black',
        minHeight: '100vh',
        color: 'white'
      }}>
        <Typography variant="h6">Error: User not found</Typography>
      </Box>
    );
  }

  // 2) Profile edit handlers
  const handleOpenEditProfile = () => setOpenEditDialog(true);
  const handleCloseEditProfile = () => setOpenEditDialog(false);
  
  /**
   * Handles saving the updated profile
   * @param {Object} formData - The updated profile data
   */
  const handleSaveProfile = async formData => {
    try {
      const res = await updateProfile(formData);
      setUser(res.data || res); // Update user state with response data
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setOpenEditDialog(false); // Close dialog regardless of success/failure
    }
  };

  /**
   * Handles profile deletion after confirmation
   */
  const handleDeleteProfile = async () => {
    if (!window.confirm('Are you sure you want to delete your profile?')) return;
    try {
      await deleteProfile();
      navigate('/login'); // Redirect to login after deletion
    } catch (err) {
      console.error('Error deleting profile:', err);
    }
  };

  // 3) Per-post edit/delete handlers
  /**
   * Sets the post to be edited
   * @param {Object} post - The post to edit
   */
  const handleEditPost = post => {
    setEditingPost(post);
  };

  /**
   * Handles post deletion after confirmation
   * @param {Object} post - The post to delete
   */
  const handleDeletePost = async post => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(post.id);
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  /**
   * Callback after a post is saved
   */
  const handlePostSaved = () => {
    setEditingPost(null); // Reset editing state
  };

  // Main component render
  return (
    <Box sx={{ 
      backgroundColor: '#000000', 
      minHeight: '100vh',
      color: 'white'
    }}>
      {/* Top banner with user profile information */}
      <ProfileBanner user={user} />

      {/* Main content container */}
      <Container sx={{ 
        mt: 2, 
        mx: { xs: 2, sm: 4 }, // Responsive margins
        bgcolor: '#121212', // Dark background
        borderRadius: 2,
        p: 3, // Padding
        boxShadow: '0px 2px 10px rgba(0,0,0,0.5)' // Shadow effect
      }}>
        {/* Profile action buttons (Edit/Delete) */}
        <ProfileActions
          onEdit={handleOpenEditProfile}
          onDelete={handleDeleteProfile}
        />

        {/* Edit Profile dialog/modal */}
        <EditProfileDialog
          open={openEditDialog}
          handleClose={handleCloseEditProfile}
          user={user}
          onSave={handleSaveProfile}
          onDelete={handleDeleteProfile}
        />

        {/* User's posts feed */}
        <Box sx={{ mt: 3 }}>
          <PostFeed
            userId={user.id}
            limit={10} // Limit to 10 posts
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
        </Box>
      </Container>

      {/* Edit Post dialog (shown when editingPost state is set) */}
      {editingPost && (
        <EditPostDialog
          open={Boolean(editingPost)}
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSaved={handlePostSaved}
        />
      )}
    </Box>
  );
}