import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { TextInput, Button, Appbar, Text, ActivityIndicator, Chip, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { fetchBooks } from '../../services/api';
import { sendPushNotification, registerForPushNotificationsAsync } from '../../services/notification';
import { useAppTheme } from '../../src/theme';

// BookCard component with bookmark functionality
const BookCard = ({ book }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const { theme } = useAppTheme();
  
  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };
  
  return (
    <View style={[styles.bookCard, { backgroundColor: theme.colors.surfaceVariant }]}>
      <View style={styles.bookCardHeader}>
        <View style={styles.bookCardTitleContainer}>
          <Text variant="titleMedium" style={styles.bookCardTitle} numberOfLines={2}>
            {book.title}
          </Text>
          <Text variant="bodySmall" style={styles.bookCardAuthor}>
            {book.authors ? book.authors.join(', ') : 'Unknown Author'}
          </Text>
        </View>
        <Button
          icon={bookmarked ? 'bookmark' : 'bookmark-outline'}
          mode="text"
          onPress={toggleBookmark}
          contentStyle={styles.bookmarkButton}
        />
      </View>
      <Divider style={styles.cardDivider} />
      <Text variant="bodyMedium" numberOfLines={3} style={styles.bookCardDescription}>
        {book.description || 'No description available.'}
      </Text>
      <View style={styles.bookCardActions}>
        <Button mode="outlined" style={styles.bookCardButton}>Details</Button>
        <Button mode="contained" style={styles.bookCardButton}>Preview</Button>
      </View>
    </View>
  );
};

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const { theme, isDarkMode, toggleTheme } = useAppTheme();

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    
    try {
      const results = await fetchBooks(query);
      setBooks(results);
      
      // Add to recent searches
      if (query.trim() && !recentSearches.includes(query.trim())) {
        setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
      }
      
      sendPushNotification('Search complete!', `Found ${results.length} books related to "${query}"`);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecentSearch = (searchTerm) => {
    setQuery(searchTerm);
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Book Explorer" titleStyle={styles.headerTitle} />
        <Appbar.Action 
          icon={isDarkMode ? 'white-balance-sunny' : 'moon-waning-crescent'} 
          onPress={toggleTheme} 
          color={theme.colors.onSurface}
        />
      </Appbar.Header>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.searchContainer}>
          <TextInput
            label="Search Books"
            value={query}
            onChangeText={setQuery}
            mode="outlined"
            left={<TextInput.Icon icon="magnify" />}
            right={query ? <TextInput.Icon icon="close" onPress={() => setQuery('')} /> : null}
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            autoCapitalize="none"
          />
          <Button 
            mode="contained" 
            onPress={handleSearch} 
            style={styles.searchButton}
            disabled={loading || !query.trim()}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>

          {recentSearches.length > 0 && !books.length && (
            <View style={styles.recentSearchesContainer}>
              <Text variant="labelMedium" style={styles.recentSearchesTitle}>Recent Searches</Text>
              <View style={styles.chipContainer}>
                {recentSearches.map((term, idx) => (
                  <Chip 
                    key={idx} 
                    icon="history" 
                    onPress={() => handleRecentSearch(term)}
                    style={styles.recentSearchChip}
                  >
                    {term}
                  </Chip>
                ))}
              </View>
            </View>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Searching for books...</Text>
          </View>
        ) : (
          <>
            {books.length > 0 && (
              <View style={styles.resultsContainer}>
                <Text variant="titleMedium" style={styles.resultsTitle}>
                  {books.length} results for "{query}"
                </Text>
                <Divider style={styles.divider} />
                
                {books.map((book, idx) => (
                  <BookCard key={idx} book={book} />
                ))}
              </View>
            )}
            
            {!loading && books.length === 0 && query.trim() && (
              <View style={styles.emptyContainer}>
                <Ionicons name="book-outline" size={64} color={theme.colors.outline} />
                <Text variant="titleMedium" style={styles.emptyTitle}>No books found</Text>
                <Text variant="bodyMedium" style={styles.emptySubtitle}>
                  Try another search term or check your spelling
                </Text>
              </View>
            )}
            
            {!query.trim() && !books.length && (
              <View style={styles.welcomeContainer}>
                <Ionicons name="library-outline" size={80} color={theme.colors.primary} />
                <Text variant="headlineSmall" style={styles.welcomeTitle}>Welcome to Book Explorer</Text>
                <Text variant="bodyMedium" style={styles.welcomeText}>
                  Search for books by title, author, or keywords to explore the world of literature.
                </Text>
                <Divider style={[styles.divider, {width: '60%'}]} />
                <Text variant="labelMedium" style={styles.suggestionsTitle}>Try searching for:</Text>
                <View style={styles.chipContainer}>
                  {['Harry Potter', 'Stephen King', 'Science Fiction', 'Cooking'].map((suggestion, idx) => (
                    <Chip 
                      key={idx} 
                      onPress={() => {
                        setQuery(suggestion);
                        setTimeout(handleSearch, 100);
                      }}
                      style={styles.suggestionChip}
                    >
                      {suggestion}
                    </Chip>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    elevation: 2,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 12,
  },
  searchButton: {
    borderRadius: 8,
    paddingVertical: 6,
  },
  recentSearchesContainer: {
    marginTop: 16,
  },
  recentSearchesTitle: {
    marginBottom: 8,
    opacity: 0.7,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recentSearchChip: {
    margin: 4,
  },
  suggestionChip: {
    margin: 4,
  },
  resultsContainer: {
    marginTop: 8,
  },
  resultsTitle: {
    fontWeight: '500',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  welcomeTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  welcomeText: {
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    opacity: 0.7,
  },
  suggestionsTitle: {
    marginTop: 20,
    marginBottom: 8,
  },
  // BookCard styles
  bookCard: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
  },
  bookCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookCardTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  bookCardTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  bookCardAuthor: {
    opacity: 0.7,
  },
  bookmarkButton: {
    margin: 0,
    padding: 0,
  },
  cardDivider: {
    marginVertical: 12,
  },
  bookCardDescription: {
    marginBottom: 16,
  },
  bookCardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  bookCardButton: {
    minWidth: 100,
  },
});