import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Grid, 
  Box, 
  CircularProgress,
  IconButton
} from '@mui/material';
import { createPost } from '../../services/postService';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

export default function CreatePostPage() {
  const [description, setDescription] = useState('');
  const [mediaUrls, setMediaUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const openWidget = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dffkhchiw',
        uploadPreset: 'nnccvv',
        maxFiles: 3,
        resourceType: 'auto',
        multiple: true,
        clientAllowedFormats: ['jpg', 'png', 'mp4'],
      },
      (error, result) => {
        if (!error && result.event === 'success') {
          setMediaUrls(prev => [...prev, result.info.secure_url]);
        }
      }
    );
    widget.open();
  };

  const removeMedia = (index) => {
    setMediaUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mediaUrls.length === 0) {
      alert('Please upload at least 1 media file.');
      return;
    }
    setLoading(true);
    try {
      await createPost({ description, mediaUrls });
      setDescription('');
      setMediaUrls([]);
      alert('Post created successfully!');
    } catch (err) {
      console.error('Create post failed:', err);
      alert('Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      bgcolor: '#000000',
      py: 4,
      display: 'flex',
      justifyContent: 'center'
    }}>
      <Box sx={{
        maxWidth: '800px',
        width: '100%',
        px: 2
      }}>
        <Paper elevation={0} sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: '#121212',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          <Typography variant="h5" gutterBottom sx={{ 
            color: 'white',
            fontWeight: 'bold',
            mb: 3,
            fontSize: '1.5rem'
          }}>
            Create a New Post
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="What's on your mind?"
              variant="outlined"
              value={description}
              onChange={e => setDescription(e.target.value)}
              sx={{ 
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                },
              }}
            />
            
            <Button
              variant="outlined"
              onClick={openWidget}
              startIcon={<CloudUploadIcon />}
              sx={{ 
                mb: 4,
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.23)',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)'
                },
                py: 1.5,
                fontSize: '1rem'
              }}
            >
              Upload Media
            </Button>
            
            {mediaUrls.length > 0 && (
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {mediaUrls.map((url, i) => (
                  <Grid item xs={12} sm={4} key={i}>
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '100%',
                        overflow: 'hidden',
                        borderRadius: 2,
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        bgcolor: 'rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      {/\.(mp4|webm)$/i.test(url) ? (
                        <video
                          src={url}
                          controls
                          style={{
                            position: 'absolute',
                            top: 0, 
                            left: 0,
                            width: '100%', 
                            height: '100%',
                            objectFit: 'cover',
                            backgroundColor: 'black'
                          }}
                        />
                      ) : (
                        <img
                          src={url}
                          alt=""
                          style={{
                            position: 'absolute',
                            top: 0, 
                            left: 0,
                            width: '100%', 
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      )}
                      <IconButton
                        onClick={() => removeMedia(i)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          }
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                fontWeight: 'bold',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                },
                textTransform: 'none'
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Post'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}