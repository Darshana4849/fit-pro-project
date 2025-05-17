import React, { useState, useContext, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Box,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
  Link as LinkIcon
} from '@mui/icons-material';

import { AuthContext } from '../../context/AuthContext';
import { likePost, unlikePost } from '../../services/interactionService';
import CommentSection from './CommentSection';

/**
 * PostCard component displays a single post with media, likes, comments, and sharing options.
 * 
 * @param {Object} post - The post data to display
 * @param {Function} onEdit - Callback for edit action
 * @param {Function} onDelete - Callback for delete action
 * @param {Boolean} darkMode - Whether dark mode is enabled
 * @returns {JSX.Element} The rendered post card component
 */
export default function PostCard({ post, onEdit, onDelete, darkMode = false }) {
  // Navigation hook for routing
  const navigate = useNavigate();
  // Authentication context for current user data
  const { user } = useContext(AuthContext);

  // State for dropdown menu anchor
  const [anchorEl, setAnchorEl] = useState(null);
  // State for share menu anchor
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  // State for current media index (for posts with multiple media)
  const [currentIndex, setCurrentIndex] = useState(0);
  // State for likes count
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  // State for tracking if current user liked the post
  const [isLiked, setIsLiked] = useState(false);
  // State for showing/hiding comments section
  const [showComments, setShowComments] = useState(false);

  // Menu open state
  const menuOpen = Boolean(anchorEl);
  // Share menu open state
  const shareMenuOpen = Boolean(shareAnchorEl);
  // Function to open dropdown menu
  const openMenu = e => setAnchorEl(e.currentTarget);
  // Function to close dropdown menu
  const closeMenu = () => setAnchorEl(null);

  /**
   * Handles click on share button to open share menu
   * @param {Event} event - The click event
   */
  const handleShareClick = (event) => {
    setShareAnchorEl(event.currentTarget);
  };

  /**
   * Handles closing of share menu
   */
  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  /**
   * Handles edit action and closes menu
   */
  const handleEdit = () => { closeMenu(); onEdit && onEdit(post); };
  
  /**
   * Handles delete action and closes menu
   */
  const handleDelete = () => { closeMenu(); onDelete && onDelete(post); };

  // Effect to check if current user liked the post
  useEffect(() => {
    if (user && Array.isArray(post.likes)) {
      setIsLiked(post.likes.includes(user.id));
    }
  }, [user, post.likes]);

  /**
   * Toggles like status for the post
   */
  const toggleLike = async () => {
    if (!user) return;
    try {
      if (isLiked) {
        await unlikePost(post.id);
        setLikesCount(c => c - 1);
      } else {
        await likePost(post.id);
        setLikesCount(c => c + 1);
      }
      setIsLiked(l => !l);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  // Get media URLs from post
  const media = post.mediaUrls || [];
  // Total media count
  const total = media.length;
  // Current media URL
  const url = media[currentIndex] || '';
  // Check if current media is a video
  const isVideo = /\.(mp4|webm)$/i.test(url);
  // Function to go to previous media
  const goPrev = () => setCurrentIndex(i => Math.max(0, i - 1));
  // Function to go to next media
  const goNext = () => setCurrentIndex(i => Math.min(total - 1, i + 1));

  /**
   * Navigates to user's profile page
   */
  const goToProfile = () => navigate(`/profile/${post.userId}`);

  /**
   * Constructs full avatar URL
   * @param {String} avatar - Avatar path or URL
   * @returns {String} Full avatar URL
   */
  const getAvatarUrl = (avatar) => {
    if (!avatar) return '';
    if (avatar.startsWith('http')) return avatar;
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${avatar}`;
  };

  // Post URL for sharing
  const postUrl = `${window.location.origin}/post/${post.id}`;
  // Post title for sharing
  const postTitle = `${post.userName}'s post`;
  // Post description for sharing (truncated if needed)
  const postDescription = post.description.length > 100 
    ? `${post.description.substring(0, 100)}...` 
    : post.description;

  /**
   * Shares post on specified platform
   * @param {String} platform - Platform to share on
   */
  const shareOnPlatform = (platform) => {
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postDescription)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(postTitle)}&summary=${encodeURIComponent(postDescription)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${postTitle}: ${postUrl}`)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(postTitle)}&body=${encodeURIComponent(`${postDescription}\n\nRead more: ${postUrl}`)}`;
        break;
      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      handleShareClose();
    }
  };

  /**
   * Copies post URL to clipboard
   */
  const copyToClipboard = () => {
    navigator.clipboard.writeText(postUrl);
    handleShareClose();
    console.log('Link copied to clipboard');
  };

  // Styles based on dark mode
  const styles = {
    card: {
      mb: 2,
      borderRadius: 2,
      boxShadow: darkMode ? '0px 2px 10px rgba(0,0,0,0.5)' : '0px 2px 10px rgba(0,0,0,0.1)',
      bgcolor: darkMode ? 'rgba(30, 30, 30, 0.8)' : '#ffffff',
      color: darkMode ? 'white' : 'text.primary',
      transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
    },
    cardHeader: {
      '& .MuiCardHeader-action': {
        alignSelf: 'center'
      }
    },
    subheader: {
      color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
    },
    cardContent: {
      pt: 0,
      color: darkMode ? 'white' : 'text.primary'
    },
    mediaContainer: {
      position: 'relative',
      bgcolor: darkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.05)'
    },
    navButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      bgcolor: darkMode ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)',
      color: 'white',
      '&:hover': { 
        bgcolor: darkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)',
        color: 'primary.main'
      }
    },
    cardActions: {
      bgcolor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'
    },
    menuPaper: {
      bgcolor: darkMode ? 'rgba(30, 30, 30, 0.9)' : '#ffffff',
      color: darkMode ? 'white' : 'text.primary',
      '& .MuiMenuItem-root': {
        '&:hover': {
          bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)'
        }
      }
    },
    popoverPaper: {
      bgcolor: darkMode ? 'rgba(30, 30, 30, 0.95)' : '#ffffff',
      color: darkMode ? 'white' : 'text.primary',
      boxShadow: darkMode ? '0px 4px 20px rgba(0,0,0,0.5)' : '0px 4px 20px rgba(0,0,0,0.1)'
    },
    listItem: {
      '&:hover': {
        bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)'
      }
    },
    divider: {
      bgcolor: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'
    },
    commentSection: {
      bgcolor: darkMode ? 'rgba(20, 20, 20, 0.7)' : 'rgba(0, 0, 0, 0.03)',
      color: darkMode ? 'white' : 'text.primary',
      '& .MuiInputBase-root': {
        color: darkMode ? 'white' : 'text.primary',
        '&::placeholder': {
          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)',
          opacity: 1
        }
      },
      '& .MuiTypography-root': {
        color: darkMode ? 'white' : 'text.primary'
      },
      '& .MuiDivider-root': {
        bgcolor: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'
      }
    }
  };

  return (
    <Card sx={styles.card}>
      {/* Post header with user info and actions */}
      <CardHeader
        avatar={
          <Avatar
            src={getAvatarUrl(post.userAvatar)}
            alt={post.userName}
            sx={{ cursor: 'pointer' }}
            onClick={goToProfile}
          />
        }
        action={
          user?.id === post.userId && (
            <>
              <IconButton onClick={openMenu} sx={{ color: darkMode ? 'white' : 'text.primary' }}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={closeMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ sx: styles.menuPaper }}
              >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </>
          )
        }
        title={
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ 
              cursor: 'pointer', 
              color: darkMode ? 'white' : 'text.primary'
            }}
            onClick={goToProfile}
          >
            {post.userName}
          </Typography>
        }
        subheader={
          <Typography variant="caption" sx={styles.subheader}>
            {new Date(post.createdAt).toLocaleString()}
          </Typography>
        }
        sx={styles.cardHeader}
      />

      {/* Post content (description) */}
      <CardContent sx={styles.cardContent}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
          {post.description}
        </Typography>
      </CardContent>

      {/* Media section (images/videos) */}
      {total > 0 && (
        <Box sx={styles.mediaContainer}>
          <CardMedia
            component={isVideo ? 'video' : 'img'}
            src={getAvatarUrl(url)}
            controls={isVideo}
            alt={isVideo ? undefined : `media-${currentIndex}`}
            sx={{ 
              width: '100%', 
              height: 'auto', 
              borderRadius: 1
            }}
          />

          {/* Navigation buttons for multiple media */}
          {total > 1 && (
            <>
              {currentIndex > 0 && (
                <IconButton
                  onClick={goPrev}
                  sx={{ ...styles.navButton, left: 8 }}
                >
                  <ChevronLeftIcon />
                </IconButton>
              )}
              {currentIndex < total - 1 && (
                <IconButton
                  onClick={goNext}
                  sx={{ ...styles.navButton, right: 8 }}
                >
                  <ChevronRightIcon />
                </IconButton>
              )}
            </>
          )}
        </Box>
      )}

      {/* Post actions (like, comment, share) */}
      <CardActions disableSpacing sx={styles.cardActions}>
        {/* Like button */}
        <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
          <IconButton onClick={toggleLike} sx={{ color: darkMode ? 'white' : 'text.primary' }}>
            <Badge badgeContent={likesCount} color="primary">
              {isLiked
                ? <FavoriteIcon color="error" />
                : <FavoriteBorderIcon />
              }
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Comments button */}
        <Tooltip title="Comments">
          <IconButton 
            onClick={() => setShowComments(s => !s)} 
            sx={{ color: darkMode ? 'white' : 'text.primary' }}
          >
            <Badge badgeContent={post.comments?.length || 0} color="primary">
              <ChatBubbleOutlineIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Share button */}
        <Tooltip title="Share">
          <IconButton onClick={handleShareClick} sx={{ color: darkMode ? 'white' : 'text.primary' }}>
            <ShareIcon />
          </IconButton>
        </Tooltip>

        {/* Share popover menu */}
        <Popover
          open={shareMenuOpen}
          anchorEl={shareAnchorEl}
          onClose={handleShareClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          PaperProps={{ sx: styles.popoverPaper }}
        >
          <List sx={{ width: 200 }}>
            <ListItem 
              button 
              onClick={() => shareOnPlatform('facebook')}
              sx={styles.listItem}
            >
              <ListItemIcon>
                <FacebookIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Facebook" />
            </ListItem>
            <ListItem 
              button 
              onClick={() => shareOnPlatform('twitter')}
              sx={styles.listItem}
            >
              <ListItemIcon>
                <TwitterIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Twitter" />
            </ListItem>
            <ListItem 
              button 
              onClick={() => shareOnPlatform('linkedin')}
              sx={styles.listItem}
            >
              <ListItemIcon>
                <LinkedInIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="LinkedIn" />
            </ListItem>
            <ListItem 
              button 
              onClick={() => shareOnPlatform('whatsapp')}
              sx={styles.listItem}
            >
              <ListItemIcon>
                <WhatsAppIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="WhatsApp" />
            </ListItem>
            <ListItem 
              button 
              onClick={() => shareOnPlatform('email')}
              sx={styles.listItem}
            >
              <ListItemIcon>
                <EmailIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Email" />
            </ListItem>
            <Divider sx={styles.divider} />
            <ListItem 
              button 
              onClick={copyToClipboard}
              sx={styles.listItem}
            >
              <ListItemIcon>
                <LinkIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Copy link" />
            </ListItem>
          </List>
        </Popover>
      </CardActions>

      {/* Comments section (shown when toggled) */}
      {showComments && (
        <CommentSection 
          postId={post.id} 
          sx={styles.commentSection}
          darkMode={darkMode}
        />
      )}
    </Card>
  );
}