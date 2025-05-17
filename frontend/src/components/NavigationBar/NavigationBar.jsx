// src/components/NavigationBar/NavigationBar.jsx
import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  TextField,
  InputAdornment,
  Button,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Favorite as FavoriteIcon,
  ChatBubble as ChatBubbleIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { useNotifications } from "../../context/NotificationContext";
import { AuthContext } from "../../context/AuthContext";
import LogoImage from "../../assets/logo.png";

/**
 * NavigationBar component that provides the main app navigation.
 * Includes logo, search, navigation links, notifications, and user menu.
 */
export default function NavigationBar() {
  // Navigation and context hooks
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();
  
  // State for menu anchors and search
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Notification menu handlers
  const handleNotifMenuOpen = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifMenuClose = () => {
    setNotifAnchorEl(null);
  };

  // Handle notification click and navigation
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    handleNotifMenuClose();
    
    switch(notification.type) {
      case 'like':
      case 'comment':
        navigate(`/post/${notification.postId}`);
        break;
      case 'follow':
        navigate(`/profile/${notification.userId}`);
        break;
      default:
        break;
    }
  };

  // User menu handlers
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  // User menu actions
  const handleViewProfile = () => {
    handleUserMenuClose();
    navigate('/profile');
  };

  const handleSettings = () => {
    handleUserMenuClose();
    navigate('/settings');
  };

  const handleSignOut = async () => {
    handleUserMenuClose();
    setUser(null);
    navigate('/login');
  };

  // Logo click handler
  const handleLogoClick = () => {
    navigate('/');
  };

  // Search handlers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Helper functions for notifications
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'like': return <FavoriteIcon color="error" />;
      case 'comment': return <ChatBubbleIcon color="primary" />;
      case 'follow': return <PersonAddIcon color="success" />;
      default: return null;
    }
  };

  const getNotificationText = (notification) => {
    switch(notification.type) {
      case 'like':
        return `${notification.userName} liked your post`;
      case 'comment':
        return `${notification.userName} commented on your post`;
      case 'follow':
        return `${notification.userName} started following you`;
      default:
        return 'New notification';
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{ 
        bgcolor: 'black', 
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      {/* Main toolbar */}
      <Toolbar sx={{ 
        justifyContent: 'space-between', 
        maxWidth: 1280, 
        mx: 'auto', 
        width: '100%',
        py: 1
      }}>
        {/* Logo section */}
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleLogoClick}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>FitPro</Typography>
        </Box>

        {/* Search bar */}
        <Box sx={{ flexGrow: 1, maxWidth: 400, mx: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search..."
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            InputProps={{
              sx: {
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                }
              },
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: 'white' }} />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              sx: {
                color: 'white',
              },
            }}
            sx={{
              '& .MuiInputBase-input': {
                color: 'white',
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* Navigation buttons and user controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user ? (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/"
                sx={{ 
                  textTransform: 'none', 
                  display: { xs: 'none', md: 'inline-flex' },
                  fontWeight: 500,
                  color: 'white'
                }}
              >
                Posts
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/workout-plans"
                sx={{ textTransform: 'none', display: { xs: 'none', md: 'inline-flex' }, color: '#fff' }}
              >
                Workouts
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/meal-plans"
                sx={{ textTransform: 'none', display: { xs: 'none', md: 'inline-flex' }, color: '#fff' }}
              >
                Meal Plans
              </Button>
              <IconButton
                color="inherit"
                onClick={handleNotifMenuOpen}
                sx={{ p: 1, color: 'white' }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton 
                onClick={handleUserMenuOpen} 
                color="inherit"
                sx={{ p: 0.5, color: 'white' }}
              >
                {user.avatar ? (
                  <Avatar src={user.avatar} alt={user.name} sx={{ width: 36, height: 36 }} />
                ) : (
                  <AccountCircleIcon sx={{ fontSize: 36, color: 'white' }} />
                )}
              </IconButton>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{ 
                textTransform: 'none', 
                fontWeight: 'bold',
                borderRadius: 2,
                backgroundColor: 'white',
                color: 'black',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notifAnchorEl}
        open={Boolean(notifAnchorEl)}
        onClose={handleNotifMenuClose}
        PaperProps={{ 
          sx: { 
            width: 400,
            maxHeight: 500,
            overflow: 'auto',
            mt: 1,
            bgcolor: 'black',
            color: 'white',
            '& .MuiDivider-root': {
              borderColor: 'rgba(255, 255, 255, 0.12)',
            }
          } 
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: 'white' }}>Notifications</Typography>
          <Button 
            size="small" 
            onClick={() => {
              markAllAsRead();
              handleNotifMenuClose();
            }}
            sx={{ textTransform: 'none', color: 'white' }}
          >
            Mark all as read
          </Button>
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List dense>
            {notifications.map(notification => (
              <ListItem 
                key={notification.id} 
                disablePadding
                secondaryAction={getNotificationIcon(notification.type)}
                sx={{
                  bgcolor: notification.read ? 'inherit' : 'rgba(255, 255, 255, 0.08)'
                }}
              >
                <ListItemButton onClick={() => handleNotificationClick(notification)}>
                  <ListItemAvatar>
                    <Avatar src={notification.userAvatar} alt={notification.userName} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={getNotificationText(notification)}
                    secondary={new Date(notification.createdAt).toLocaleString()}
                    primaryTypographyProps={{ color: 'white' }}
                    secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Menu>

      {/* User Menu */}
      {user && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleUserMenuClose}
          PaperProps={{ 
            sx: { 
              width: 240,
              mt: 1,
              bgcolor: 'black',
              color: 'white',
              '& .MuiDivider-root': {
                borderColor: 'rgba(255, 255, 255, 0.12)',
              }
            } 
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            {user.avatar ? (
              <Avatar src={user.avatar} alt={user.name} sx={{ width: 48, height: 48, mr: 2 }} />
            ) : (
              <AccountCircleIcon sx={{ fontSize: 48, mr: 2, color: 'white' }} />
            )}
            <Box>
              <Typography sx={{ fontWeight: 'bold', color: 'white' }}>{user.name}</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{user.email}</Typography>
            </Box>
          </Box>
          <Divider />
          <MenuItem onClick={handleViewProfile} sx={{ color: 'white' }}>View profile</MenuItem>
          <MenuItem onClick={handleSettings} sx={{ color: 'white' }}>Settings</MenuItem>
          <Divider />
          <MenuItem onClick={handleSignOut} sx={{ color: 'white' }}>Sign out</MenuItem>
        </Menu>
      )}
    </AppBar>
  );
}