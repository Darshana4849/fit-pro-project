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
  Alert,
  List,
  ListItem,
  ListItemIcon,
  Divider
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import PostFeed from '../../components/PostFeed/PostFeed';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

/**
 * Home component - Main page of the application with stories, posts, and media upload functionality
 * @returns {JSX.Element} The home page component
 */
export default function Home() {
  // Router hooks
  const location = useLocation();
  const navigate = useNavigate();
  
  // Refs for file inputs
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  
  // State management
  const [stories, setStories] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isNewMedia, setIsNewMedia] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true' || false);
  
  // Ref for story cleanup interval
  const storyCleanupIntervalRef = useRef(null);

  /**
   * Effect hook to load stories from localStorage and set up cleanup interval
   */
  useEffect(() => {
    const savedStories = localStorage.getItem('stories');
    if (savedStories) {
      try {
        const parsedStories = JSON.parse(savedStories);
        setStories(parsedStories);
      } catch (e) {
        console.error('Failed to parse saved stories', e);
        localStorage.removeItem('stories');
      }
    }

    // Set up interval to check for expired stories (runs every minute)
    storyCleanupIntervalRef.current = setInterval(() => {
      cleanUpExpiredStories();
    }, 60 * 1000);

    // Cleanup interval on component unmount
    return () => {
      if (storyCleanupIntervalRef.current) {
        clearInterval(storyCleanupIntervalRef.current);
      }
    };
  }, []);

  /**
   * Effect hook to persist stories to localStorage when they change
   */
  useEffect(() => {
    if (stories.length > 0) {
      localStorage.setItem('stories', JSON.stringify(stories));
    } else {
      localStorage.removeItem('stories');
    }
  }, [stories]);

  /**
   * Cleans up expired stories (older than 24 hours)
   */
  const cleanUpExpiredStories = () => {
    const now = new Date();
    setStories(prevStories => {
      const updatedStories = prevStories.filter(story => {
        const storyDate = new Date(story.timestamp);
        const hoursDiff = (now - storyDate) / (1000 * 60 * 60);
        return hoursDiff < 24; // Keep stories younger than 24 hours
      });
      
      // Only update if some stories were removed
      if (updatedStories.length !== prevStories.length) {
        return updatedStories;
      }
      return prevStories;
    });
  };

  /**
   * Effect hook to handle token from URL and apply dark mode
   */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) localStorage.setItem('token', token);

    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [location, darkMode]);

  /**
   * Toggles dark mode state and persists to localStorage
   */
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  /**
   * Triggers file input click for image upload
   */
  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  /**
   * Triggers file input click for video upload
   */
  const handleVideoUpload = () => {
    videoInputRef.current.click();
  };

  /**
   * Handles file selection and validation
   * @param {Event} e - File input change event
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);

    /**
     * Determines media type based on file type or extension
     * @param {File} file - The file to check
     * @returns {string|null} 'image', 'video', or null if unsupported
     */
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

    const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
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

  /**
   * Adds the selected media as a new story
   */
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

  /**
   * Removes a story by ID
   * @param {string} id - The ID of the story to remove
   */
  const handleRemoveStory = (id) => {
    setStories(stories.filter(story => story.id !== id));
  };

  /**
   * Closes the media preview and resets related state
   */
  const handleClosePreview = () => {
    setSelectedMedia(null);
    setMediaType(null);
    setShowMediaPreview(false);
    setIsNewMedia(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  /**
   * Handles clicking on a story to view it
   * @param {Object} story - The story object to view
   */
  const handleStoryClick = (story) => {
    setSelectedMedia(story.url);
    setMediaType(story.type);
    setIsNewMedia(false);
    setShowMediaPreview(true);
  };

  /**
   * Closes the error snackbar
   */
  const handleCloseError = () => {
    setError(null);
  };

  /**
   * Dark mode style definitions
   */
  const darkModeStyles = {
    backgroundColor: darkMode ? '#121212' : '#f5f5f5',
    color: darkMode ? '#ffffff' : '#000000',
    borderColor: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    paperBg: darkMode ? '#1e1e1e' : '#ffffff',
    primaryButtonBg: darkMode ? '#1976d2' : '#1976d2',
    primaryButtonColor: darkMode ? '#ffffff' : '#ffffff',
    secondaryButtonBg: darkMode ? '#333333' : '#e0e0e0',
    secondaryButtonColor: darkMode ? '#ffffff' : '#000000',
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
        bgcolor: darkModeStyles.backgroundColor,
        margin: 0,
        overflowX: 'hidden',
        transition: 'background-color 0.3s ease'
      }}
    >
      {/* Hidden file inputs for media upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={videoInputRef}
        onChange={handleFileChange}
        accept="video/*"
        style={{ display: 'none' }}
      />

      {/* Left Sidebar (currently empty) */}
      <Box sx={{ 
        display: { xs: 'none', md: 'block' },
        flexBasis: '25%',
        maxWidth: 300,
        position: 'sticky',
        top: 16,
        height: 'fit-content',
        bgcolor: darkModeStyles.paperBg,
        borderRadius: 2,
        boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
        transition: 'background-color 0.3s ease'
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
            bgcolor: darkModeStyles.paperBg,
            boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            overflowX: 'auto',
            gap: 2,
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            transition: 'background-color 0.3s ease'
          }}
        >
          {/* Your Story (upload button) */}
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
                    bgcolor: darkModeStyles.paperBg,
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
                  bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }}
              />
            </Badge>
            <Typography variant="caption" sx={{ mt: 1, color: darkModeStyles.color }}>
              Your Story
            </Typography>
          </Box>

          {/* Existing Stories */}
          {stories.map((story) => {
            const storyDate = new Date(story.timestamp);
            const now = new Date();
            const hoursDiff = (now - storyDate) / (1000 * 60 * 60);
            const timeLeft = Math.max(0, 24 - hoursDiff).toFixed(1);
            
            return (
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
                    borderColor: hoursDiff < 24 ? 'primary.main' : 'error.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative'
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
                        objectFit: 'cover',
                        opacity: hoursDiff < 24 ? 1 : 0.7
                      }} 
                    />
                  ) : (
                    <video
                      src={story.url}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: hoursDiff < 24 ? 1 : 0.7
                      }}
                    />
                  )}
                  {hoursDiff < 24 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        bgcolor: 'rgba(0,0,0,0.3)',
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: `${(1 - hoursDiff / 24) * 100}%`,
                          bgcolor: 'primary.main',
                          transition: 'width 0.5s linear'
                        }}
                      />
                    </Box>
                  )}
                </Box>
                <Typography variant="caption" sx={{ mt: 1, color: darkModeStyles.color }}>
                  {hoursDiff < 24 ? `${timeLeft}h left` : 'Expired'}
                </Typography>
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bgcolor: darkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
                    color: darkMode ? 'white' : 'black',
                    '&:hover': {
                      bgcolor: darkMode ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)'
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
            );
          })}
        </Paper>

        {/* Create Post Card */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: darkModeStyles.paperBg,
            boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            transition: 'background-color 0.3s ease'
          }}
        >
          <Typography variant="h6" sx={{ color: darkModeStyles.color, fontWeight: 600 }}>
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
                borderColor: darkModeStyles.borderColor,
                color: darkModeStyles.color,
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                }
              }}
            >
              What's on your mind?
            </Button>
            
            <IconButton
              onClick={handleImageUpload}
              sx={{
                border: '1px solid',
                borderColor: darkModeStyles.borderColor,
                borderRadius: 2,
                p: 1.5,
                color: darkModeStyles.color,
                '&:hover': {
                  bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
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
                borderColor: darkModeStyles.borderColor,
                borderRadius: 2,
                p: 1.5,
                color: darkModeStyles.color,
                '&:hover': {
                  bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
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
              backgroundColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
              borderRadius: '3px'
            }
          }}
        >
          <PostFeed limit={20} onEdit={null} onDelete={null} darkMode={darkMode} />
        </Box>
      </Box>

      {/* Right Sidebar (Dark Mode Toggle) */}
      <Box sx={{ 
        display: { xs: 'none', lg: 'block' },
        flexBasis: '25%',
        maxWidth: 80,
        position: 'sticky',
        top: 16,
        height: 'fit-content',
        bgcolor: darkModeStyles.paperBg,
        borderRadius: 2,
        boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
        transition: 'background-color 0.3s ease',
        p: 2
      }}>
        <List>
          <ListItem sx={{ p: 0 }}>
            <IconButton 
              onClick={toggleDarkMode} 
              size="small"
              sx={{
                color: darkMode ? 'warning.main' : 'text.primary',
                '&:hover': {
                  bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                }
              }}
            >
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </ListItem>
        </List>
      </Box>

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
              bgcolor: darkModeStyles.paperBg,
              borderRadius: 2,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0px 0px 30px rgba(0,0,0,0.8)',
              transition: 'background-color 0.3s ease'
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
            bgcolor: darkMode ? '#1E1E1E' : '#f5f5f5',
            color: darkMode ? 'white' : 'black',
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