import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { getFeed, getPostsByUser } from '../../services/postService';
import PostCard from '../Post/PostCard';

export default function PostFeed({ userId, limit, onEdit, onDelete, darkMode = false }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = userId
          ? await getPostsByUser(userId)
          : await getFeed();
        setPosts(res.data);
      } catch (err) {
        console.error('Error loading posts:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  const displayPosts = typeof limit === 'number'
    ? posts.slice(0, limit)
    : posts;

  // Styles based on dark mode
  const styles = {
    container: {
      maxWidth: 600,
      mx: 'auto',
      mt: 0.5,
      px: 1,
      bgcolor: darkMode ? '#121212' : '#f5f5f5',
      color: darkMode ? 'white' : 'black',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    },
    refreshBar: {
      position: 'sticky',
      top: 0,
      zIndex: 10,
      bgcolor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      py: 0.5,
      mb: 0.5,
      borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)'
    },
    scrollContainer: {
      maxHeight: '100vh',
      overflowY: 'auto',
      mt: 0,
      '&::-webkit-scrollbar': {
        width: '6px'
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
        borderRadius: '3px'
      }
    },
    emptyText: {
      mt: 1,
      color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
    },
    refreshButton: {
      bgcolor: 'primary.main',
      color: 'black',
      '&:hover': {
        bgcolor: 'primary.dark'
      }
    }
  };

  return (
    <Box sx={styles.container}>
      {/* Optional Refresh button */}
      {!userId && (
        <Box sx={styles.refreshBar}>
          {/* <Button 
            variant="contained" 
            fullWidth 
            onClick={() => window.location.reload()}
            sx={styles.refreshButton}
          >
            Refresh Feed
          </Button> */}
        </Box>
      )}

      {/* Scrollable feed */}
      <Box sx={styles.scrollContainer}>
        {loading ? (
          <Box sx={{ 
            textAlign: 'center', 
            mt: 0.5 
          }}>
            <CircularProgress 
              size={24} 
              sx={{ color: 'primary.main' }} 
            />
          </Box>
        ) : displayPosts.length === 0 ? (
          <Typography 
            align="center" 
            sx={styles.emptyText}
          >
            No posts yet.
          </Typography>
        ) : (
          displayPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={() => onEdit && onEdit(post)}
              onDelete={() => onDelete && onDelete(post)}
              darkMode={darkMode}
            />
          ))
        )}
      </Box>
    </Box>
  );
}