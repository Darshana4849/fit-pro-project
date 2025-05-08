// src/components/PostFeed.jsx
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { getFeed, getPostsByUser } from '../../services/postService';
import PostCard from '../Post/PostCard';

export default function PostFeed({ userId, limit, onEdit, onDelete }) {
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

  return (
    <Box sx={{ 
      maxWidth: 600, 
      mx: 'auto', 
      mt: 0.5, 
      px: 1,
      bgcolor: 'black',
      color: 'white'
    }}>
      {/* Optional Refresh button */}
      {!userId && (
        <Box sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: 'rgba(30, 30, 30, 0.8)',
          py: 0.5,
          mb: 0.5,
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          {/* <Button 
            variant="contained" 
            fullWidth 
            onClick={() => window.location.reload()}
            sx={{
              bgcolor: 'primary.main',
              color: 'black',
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }}
          >
            Refresh Feed
          </Button> */}
        </Box>
      )}

      {/* Scrollable feed */}
      <Box sx={{ 
        maxHeight: '100vh', 
        overflowY: 'auto', 
        mt: 0,
        '&::-webkit-scrollbar': {
          width: '6px'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '3px'
        }
      }}>
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
            sx={{ 
              mt: 1,
              color: 'rgba(255, 255, 255, 0.7)'
            }}
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
            />
          ))
        )}
      </Box>
    </Box>
  );
}