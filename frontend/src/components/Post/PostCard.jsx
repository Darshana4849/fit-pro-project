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

export default function PostCard({ post, onEdit, onDelete }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const menuOpen = Boolean(anchorEl);
  const shareMenuOpen = Boolean(shareAnchorEl);
  const openMenu = e => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const handleShareClick = (event) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  const handleEdit = () => { closeMenu(); onEdit && onEdit(post); };
  const handleDelete = () => { closeMenu(); onDelete && onDelete(post); };

  useEffect(() => {
    if (user && Array.isArray(post.likes)) {
      setIsLiked(post.likes.includes(user.id));
    }
  }, [user, post.likes]);

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

  const media = post.mediaUrls || [];
  const total = media.length;
  const url = media[currentIndex] || '';
  const isVideo = /\.(mp4|webm)$/i.test(url);
  const goPrev = () => setCurrentIndex(i => Math.max(0, i - 1));
  const goNext = () => setCurrentIndex(i => Math.min(total - 1, i + 1));

  const goToProfile = () => navigate(`/profile/${post.userId}`);

  const getAvatarUrl = (avatar) => {
    if (!avatar) return '';
    if (avatar.startsWith('http')) return avatar;
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${avatar}`;
  };

  const postUrl = `${window.location.origin}/post/${post.id}`;
  const postTitle = `${post.userName}'s post`;
  const postDescription = post.description.length > 100 
    ? `${post.description.substring(0, 100)}...` 
    : post.description;

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(postUrl);
    handleShareClose();
    console.log('Link copied to clipboard');
  };

  return (
    <Card sx={{ 
      mb: 2, 
      borderRadius: 2, 
      boxShadow: '0px 2px 10px rgba(0,0,0,0.5)',
      bgcolor: 'rgba(30, 30, 30, 0.8)',
      color: 'white'
    }}>
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
              <IconButton onClick={openMenu} sx={{ color: 'white' }}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={closeMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                  sx: {
                    bgcolor: 'rgba(30, 30, 30, 0.9)',
                    color: 'white',
                    '& .MuiMenuItem-root': {
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }
                  }
                }}
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
            sx={{ cursor: 'pointer', color: 'white' }}
            onClick={goToProfile}
          >
            {post.userName}
          </Typography>
        }
        subheader={
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {new Date(post.createdAt).toLocaleString()}
          </Typography>
        }
        sx={{
          '& .MuiCardHeader-action': {
            alignSelf: 'center'
          }
        }}
      />

      <CardContent sx={{ pt: 0 }}>
        <Typography variant="body1" sx={{ 
          whiteSpace: 'pre-wrap', 
          mb: 2,
          color: 'white'
        }}>
          {post.description}
        </Typography>
      </CardContent>

      {total > 0 && (
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component={isVideo ? 'video' : 'img'}
            src={getAvatarUrl(url)}
            controls={isVideo}
            alt={isVideo ? undefined : `media-${currentIndex}`}
            sx={{ 
              width: '100%', 
              height: 'auto', 
              borderRadius: 1,
              bgcolor: 'rgba(0,0,0,0.5)'
            }}
          />

          {total > 1 && (
            <>
              {currentIndex > 0 && (
                <IconButton
                  onClick={goPrev}
                  sx={{
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    '&:hover': { 
                      bgcolor: 'rgba(0,0,0,0.8)',
                      color: 'primary.main'
                    }
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
              )}
              {currentIndex < total - 1 && (
                <IconButton
                  onClick={goNext}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    '&:hover': { 
                      bgcolor: 'rgba(0,0,0,0.8)',
                      color: 'primary.main'
                    }
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              )}
            </>
          )}
        </Box>
      )}

      <CardActions disableSpacing sx={{ bgcolor: 'rgba(0,0,0,0.2)' }}>
        <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
          <IconButton onClick={toggleLike} sx={{ color: 'white' }}>
            <Badge badgeContent={likesCount} color="primary">
              {isLiked
                ? <FavoriteIcon color="error" />
                : <FavoriteBorderIcon />
              }
            </Badge>
          </IconButton>
        </Tooltip>

        <Tooltip title="Comments">
          <IconButton 
            onClick={() => setShowComments(s => !s)} 
            sx={{ color: 'white' }}
          >
            <Badge badgeContent={post.comments?.length || 0} color="primary">
              <ChatBubbleOutlineIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Tooltip title="Share">
          <IconButton onClick={handleShareClick} sx={{ color: 'white' }}>
            <ShareIcon />
          </IconButton>
        </Tooltip>

        {/* Share Popover */}
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
          PaperProps={{
            sx: {
              bgcolor: 'rgba(30, 30, 30, 0.95)',
              color: 'white',
              boxShadow: '0px 4px 20px rgba(0,0,0,0.5)'
            }
          }}
        >
          <List sx={{ width: 200 }}>
            <ListItem 
              button 
              onClick={() => shareOnPlatform('facebook')}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <ListItemIcon>
                <FacebookIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Facebook" />
            </ListItem>
            <ListItem 
              button 
              onClick={() => shareOnPlatform('twitter')}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <ListItemIcon>
                <TwitterIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Twitter" />
            </ListItem>
            <ListItem 
              button 
              onClick={() => shareOnPlatform('linkedin')}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <ListItemIcon>
                <LinkedInIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="LinkedIn" />
            </ListItem>
            <ListItem 
              button 
              onClick={() => shareOnPlatform('whatsapp')}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <ListItemIcon>
                <WhatsAppIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="WhatsApp" />
            </ListItem>
            <ListItem 
              button 
              onClick={() => shareOnPlatform('email')}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <ListItemIcon>
                <EmailIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Email" />
            </ListItem>
            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
            <ListItem 
              button 
              onClick={copyToClipboard}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <ListItemIcon>
                <LinkIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Copy link" />
            </ListItem>
          </List>
        </Popover>
      </CardActions>

      {showComments && (
        <CommentSection 
          postId={post.id} 
          sx={{
            bgcolor: 'rgba(20, 20, 20, 0.7)',
            color: 'white',
            '& .MuiInputBase-root': {
              color: 'white',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
                opacity: 1
              }
            },
            '& .MuiTypography-root': {
              color: 'white'
            },
            '& .MuiDivider-root': {
              bgcolor: 'rgba(255, 255, 255, 0.12)'
            }
          }}
        />
      )}
    </Card>
  );
}