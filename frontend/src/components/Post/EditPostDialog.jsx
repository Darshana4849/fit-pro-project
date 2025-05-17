// src/components/Post/EditPostDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, TextField,
  DialogActions, Button, Stack
} from '@mui/material';
import { updatePost } from '../../services/postService';

/**
 * Dialog component for editing a post's description.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.post - The post object being edited
 * @param {boolean} props.open - Controls whether the dialog is open
 * @param {Function} props.onClose - Callback when dialog is closed
 * @param {Function} props.onSaved - Callback when post is successfully saved
 * @returns {JSX.Element} The EditPostDialog component
 */
export default function EditPostDialog({ post, open, onClose, onSaved }) {
  // State for edited description and saving status
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  // Initialize description when post changes
  useEffect(() => {
    if (post) setDescription(post.description || '');
  }, [post]);

  // Handle saving the edited post
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updatePost(post.id, { description, mediaUrls: post.mediaUrls });
      onSaved(res.data);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Post</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt:1 }}>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          {/* if you want to re-upload media, add it here */}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}