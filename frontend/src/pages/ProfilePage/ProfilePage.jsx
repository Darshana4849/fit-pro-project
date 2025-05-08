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

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const navigate = useNavigate();

  // 1) Load current user's profile
  useEffect(() => {
    (async () => {
      try {
        const res = await getUserProfile();
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
  const handleSaveProfile = async formData => {
    try {
      const res = await updateProfile(formData);
      setUser(res.data || res);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setOpenEditDialog(false);
    }
  };
  const handleDeleteProfile = async () => {
    if (!window.confirm('Are you sure you want to delete your profile?')) return;
    try {
      await deleteProfile();
      navigate('/login');
    } catch (err) {
      console.error('Error deleting profile:', err);
    }
  };

  // 3) Per-post edit/delete handlers
  const handleEditPost = post => {
    setEditingPost(post);
  };
  const handleDeletePost = async post => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(post.id);
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };
  const handlePostSaved = () => {
    setEditingPost(null);
  };

  return (
    <Box sx={{ 
      backgroundColor: '#000000', 
      minHeight: '100vh',
      color: 'white'
    }}>
      {/* Top banner */}
      <ProfileBanner user={user} />

      {/* Main container */}
      <Container sx={{ 
        mt: 2, 
        mx: { xs: 2, sm: 4 },
        bgcolor: '#121212',
        borderRadius: 2,
        p: 3,
        boxShadow: '0px 2px 10px rgba(0,0,0,0.5)'
      }}>
        {/* Profile actions */}
        <ProfileActions
          onEdit={handleOpenEditProfile}
          onDelete={handleDeleteProfile}
        />

        {/* Edit Profile modal */}
        <EditProfileDialog
          open={openEditDialog}
          handleClose={handleCloseEditProfile}
          user={user}
          onSave={handleSaveProfile}
          onDelete={handleDeleteProfile}
        />

        {/* User's posts */}
        <Box sx={{ mt: 3 }}>
          <PostFeed
            userId={user.id}
            limit={10}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
        </Box>
      </Container>

      {/* Edit Post dialog */}
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