import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper,
  IconButton,
  Avatar,
  Badge,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import PostFeed from '../../components/PostFeed/PostFeed';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [stories, setStories] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isNewMedia, setIsNewMedia] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) localStorage.setItem('token', token);
  }, [location]);

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const handleVideoUpload = () => {
    videoInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);

    const determineMediaType = (file) => {
      if (file.type.startsWith('image/')) return 'image';
      if (file.type.startsWith('video/')) return 'video';
      
      const extension = file.name.split('.').pop().toLowerCase();
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'tiff'];
      const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'mkv'];
      
      if (imageExtensions.includes(extension)) return 'image';
      if (videoExtensions.includes(extension)) return 'video';
      
      return null;
    };

    const detectedType = determineMediaType(file);
    if (!detectedType) {
      setError('Unsupported file type. Please use images (JPEG, PNG, GIF) or videos (MP4, WebM)');
      return;
    }

    const MAX_FILE_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setError('File size too large (max 25MB allowed)');
      return;
    }

    setIsLoading(true);
    setIsNewMedia(true);
    const reader = new FileReader();

    reader.onloadstart = () => {
      setSelectedMedia(null);
      setMediaType(null);
    };

    reader.onload = (event) => {
      setSelectedMedia(event.target.result);
      setMediaType(detectedType);
      setShowMediaPreview(true);
      setIsLoading(false);
    };

    reader.onerror = () => {
      setError('Error reading file. Please try another file.');
      setIsLoading(false);
      setIsNewMedia(false);
    };

    reader.readAsDataURL(file);
  };

  const handleAddStory = () => {
    if (selectedMedia && mediaType) {
      const newStory = {
        id: Date.now(),
        url: selectedMedia,
        type: mediaType,
        timestamp: new Date().toISOString()
      };
      setStories([newStory, ...stories]);
      handleClosePreview();
    }
  };

  const handleRemoveStory = (id) => {
    setStories(stories.filter(story => story.id !== id));
  };

  const handleClosePreview = () => {
    setSelectedMedia(null);
    setMediaType(null);
    setShowMediaPreview(false);
    setIsNewMedia(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleStoryClick = (story) => {
    setSelectedMedia(story.url);
    setMediaType(story.type);
    setIsNewMedia(false);
    setShowMediaPreview(true);
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        px: { xs: 1, sm: 2 },
        py: 2,
        gap: 2,
        bgcolor: '#000000',
        color: 'white',
        margin: 0,
        overflowX: 'hidden'
      }}
    >
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/,video/"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={videoInputRef}
        onChange={handleFileChange}
        accept="video/*"
        style={{ display: 'none' }}
      />

      {/* Left Sidebar */}
      <Box sx={{ 
        display: { xs: 'none', md: 'block' },
        flexBasis: '25%',
        maxWidth: 300,
        position: 'sticky',
        top: 16,
        height: 'fit-content',
        bgcolor: '#121212',
        borderRadius: 2
      }} />

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          maxWidth: 800,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          margin: '0 auto'
        }}
      >
        {/* Stories Section */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: '#121212',
            boxShadow: '0px 4px 12px rgba(0,0,0,0.5)',
            display: 'flex',
            overflowX: 'auto',
            gap: 2,
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }}
        >
          {/* Your Story */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              minWidth: 80,
              cursor: 'pointer'
            }}
            onClick={handleImageUpload}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <AddCircleOutlineIcon 
                  color="primary" 
                  sx={{ 
                    bgcolor: '#121212',
                    borderRadius: '50%',
                  }} 
                />
              }
            >
              <Avatar 
                sx={{ 
                  width: 60, 
                  height: 60,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }}
              />
            </Badge>
            <Typography variant="caption" sx={{ mt: 1, color: 'white' }}>
              Your Story
            </Typography>
          </Box>

          {/* Existing Stories */}
          {stories.map((story) => (
            <Box 
              key={story.id} 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                minWidth: 80,
                position: 'relative'
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
                onClick={() => handleStoryClick(story)}
              >
                {story.type === 'image' ? (
                  <img 
                    src={story.url} 
                    alt="Story" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }} 
                  />
                ) : (
                  <video
                    src={story.url}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </Box>
              <Typography variant="caption" sx={{ mt: 1, color: 'white' }}>
                Your Story
              </Typography>
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.9)'
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveStory(story.id);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Paper>

        {/* Create Post Card */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: '#121212',
            boxShadow: '0px 4px 12px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Create Post
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1
          }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/create-post')}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(255,255,255,0.05)'
                }
              }}
            >
              What's on your mind?
            </Button>
            
            <IconButton
              onClick={handleImageUpload}
              sx={{
                border: '1px solid',
                borderColor: 'rgba(255,255,255,0.2)',
                borderRadius: 2,
                p: 1.5,
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.05)',
                  borderColor: 'primary.main'
                }
              }}
            >
              <AddPhotoAlternateIcon />
            </IconButton>
            
            <IconButton
              onClick={handleVideoUpload}
              sx={{
                border: '1px solid',
                borderColor: 'rgba(255,255,255,0.2)',
                borderRadius: 2,
                p: 1.5,
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.05)',
                  borderColor: 'primary.main'
                }
              }}
            >
              <VideoCameraBackIcon />
            </IconButton>
          </Box>
        </Paper>

        {/* Post Feed */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: '3px'
            }
          }}
        >
          <PostFeed limit={20} onEdit={null} onDelete={null} />
        </Box>
      </Box>

      {/* Right Sidebar */}
      <Box sx={{ 
        display: { xs: 'none', lg: 'block' },
        flexBasis: '25%',
        maxWidth: 300,
        position: 'sticky',
        top: 16,
        height: 'fit-content',
        bgcolor: '#121212',
        borderRadius: 2
      }} />

      {/* Media Preview Modal */}
      {showMediaPreview && selectedMedia && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.9)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}
          onClick={handleClosePreview}
        >
          <Box
            sx={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              bgcolor: '#121212',
              borderRadius: 2,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0px 0px 30px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.8)'
                }
              }}
              onClick={handleClosePreview}
            >
              <CloseIcon />
            </IconButton>
            
            {isLoading ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                width: '100%',
                height: 400,
                flex: 1
              }}>
                <CircularProgress color="primary" />
              </Box>
            ) : mediaType === 'image' ? (
              <Box sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img 
                  src={selectedMedia} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: 'calc(90vh - 72px)',
                    objectFit: 'contain',
                    display: 'block'
                  }} 
                />
              </Box>
            ) : (
              <Box sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
              }}>
                <video
                  src={selectedMedia}
                  controls
                  autoPlay
                  style={{
                    maxWidth: '100%',
                    maxHeight: 'calc(90vh - 72px)',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </Box>
            )}
            
            {isNewMedia && (
              <Box sx={{ 
                p: 3, 
                textAlign: 'center',
                flexShrink: 0
              }}>
                <Button 
                  variant="contained" 
                  onClick={handleAddStory}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    width: '100%',
                    maxWidth: 300,
                    bgcolor: 'primary.main',
                    color: 'black',
                    '&:hover': {
                      bgcolor: 'primary.dark'
                    }
                  }}
                >
                  Add to Stories
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          sx={{ 
            width: '100%',
            bgcolor: '#1E1E1E',
            color: 'white',
            border: '1px solid rgba(255,0,0,0.3)',
            '& .MuiAlert-icon': {
              color: 'error.main'
            }
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}