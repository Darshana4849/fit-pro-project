import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress, Grid } from '@mui/material';
import { searchUsers } from '../../services/connectionService';
import UserCard from '../../components/UserCard/UserCard';

/**
 * SearchPage component displays search results for user queries.
 * It fetches and shows matching users based on the search query parameter.
 */
function SearchPage() {
  // Get search query from URL parameters
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  
  // State management:
  const [loading, setLoading] = useState(true); // Loading state
  const [results, setResults] = useState([]); // Search results storage

  // Fetch search results when query changes
  useEffect(() => {
    /**
     * Fetches search results from the API
     */
    async function fetchSearchResults() {
      try {
        const response = await searchUsers(query);
        setResults(response.data); // Set results from API response
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false); // Always set loading to false when done
      }
    }

    // Only fetch if there's a query, otherwise reset results
    if (query) {
      fetchSearchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]); // Dependency array ensures effect runs when query changes

  // Loading state UI - shows a circular progress indicator
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Main component render
  return (
    <Container sx={{ mt: 4 }}>
      {/* Search results header */}
      <Typography variant="h4" gutterBottom>
        Search Results for "{query}"
      </Typography>

      {/* Conditional rendering based on results */}
      {results.length === 0 ? (
        // No results found message
        <Typography>No users found.</Typography>
      ) : (
        // Grid layout for user cards
        <Grid container spacing={2}>
          {results.map(user => (
            <Grid item key={user.id} xs={12} sm={6} md={4}>
              {/* User card component for each result */}
              <UserCard 
                user={user} 
                isFollowed={false} 
                onFollowToggle={() => {}} // Empty callback (could be implemented later)
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default SearchPage;