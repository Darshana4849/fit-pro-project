// src/components/CommentSection/CommentSection.jsx
import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Button,
  CircularProgress,
  Menu,
  MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  getCommentsByPost,
  addComment,
  updateComment,
  deleteComment
} from '../../services/interactionService';

/**
 * CommentSection component for displaying and managing comments on a post.
 * Allows users to view, add, edit, and delete comments.
 * 
 * @param {Object} props - Component props
 * @param {string} props.postId - ID of the post these comments belong to
 * @param {Object} props.sx - Additional styles to apply to the component
 * @returns {JSX.Element} The CommentSection component
 */
export default function CommentSection({ postId, sx }) {
  // Context and navigation
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for comments and loading
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);

  // State for comment menu and editing
  const [anchorEl, setAnchorEl] = useState(null);
  const [selComment, setSelComment] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [processingId, setProcessingId] = useState(null);

  // Load comments when postId changes
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getCommentsByPost(postId);
        setComments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [postId]);

  // Handle submitting a new comment
  const handleSubmit = async () => {
    if (!text.trim()) return;
    setPosting(true);
    try {
      const res = await addComment(postId, text);
      setComments(c => [res.data, ...c]);
      setText('');
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  // Menu handlers
  const openMenu = (e, comment) => {
    setAnchorEl(e.currentTarget);
    setSelComment(comment);
  };
  const closeMenu = () => {
    setAnchorEl(null);
    setSelComment(null);
  };

  // Edit handlers
  const startEdit = () => {
    setEditingId(selComment.id);
    setEditText(selComment.text);
    closeMenu();
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // Save edited comment
  const saveEdit = async () => {
    setProcessingId(editingId);
    try {
      const res = await updateComment(editingId, editText);
      setComments(cs => cs.map(c => c.id === editingId ? res.data : c));
      cancelEdit();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  // Delete comment
  const handleDelete = async () => {
    const cid = selComment.id;
    closeMenu();
    if (!window.confirm('Delete this comment?')) return;
    setProcessingId(cid);
    try {
      await deleteComment(cid);
      setComments(cs => cs.filter(c => c.id !== cid));
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  // Loading state
  if (loading) {
    return <CircularProgress size={24} sx={{ py: 2, color: 'white' }} />;
  }

  return (
    <Box sx={{ 
      px: 2, 
      pb: 2,
      bgcolor: 'rgba(20, 20, 20, 0.7)',
      color: 'white',
      ...sx 
    }}>
      {/* New comment input */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <TextField
          fullWidth
          size="small"
          multiline
          placeholder="Write a comment…"
          value={text}
          onChange={e => setText(e.target.value)}
          sx={{
            '& .MuiInputBase-root': {
              color: 'white',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
                opacity: 1
              }
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.8)',
              }
            }
          }}
        />
        <IconButton
          onClick={handleSubmit}
          disabled={posting || !text.trim()}
          sx={{ ml: 1, color: 'white' }}
        >
          <SendIcon />
        </IconButton>
      </Box>

      {/* Comments list */}
      {comments.map(c => {
        const isAuthor = user && c.authorId === user.id;
        return (
          <Box key={c.id} sx={{ display: 'flex', mb: 1, position: 'relative' }}>
            <Avatar
              src={c.authorAvatar}
              alt={c.authorName}
              sx={{ width: 32, height: 32, mr: 1, cursor: 'pointer' }}
              onClick={() => navigate(`/profile/${c.authorId}`)}
            />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ 
                    cursor: 'pointer', 
                    color: 'white',
                    '&:hover': { textDecoration: 'underline' } 
                  }}
                  onClick={() => navigate(`/profile/${c.authorId}`)}
                >
                  {c.authorName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  {new Date(c.createdAt).toLocaleString()}
                </Typography>
              </Box>
              {editingId === c.id ? (
                <>
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'white',
                        '&::placeholder': {
                          color: 'rgba(255, 255, 255, 0.7)',
                          opacity: 1
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.8)',
                        }
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={saveEdit}
                      disabled={!editText.trim() || processingId === c.id}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={cancelEdit}
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        '&:hover': {
                          borderColor: 'white'
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </>
              ) : (
                <Typography variant="body2" sx={{ color: 'white' }}>
                  {c.text}
                </Typography>
              )}
            </Box>

            {/* Comment menu button (only for author) */}
            {isAuthor && (
              <IconButton
                size="small"
                onClick={e => openMenu(e, c)}
                disabled={processingId === c.id}
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  right: 0,
                  color: 'white'
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        );
      })}

      {/* Comment action menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
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
        <MenuItem onClick={startEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </Box>
  );
}