import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, Button, Chip, Divider, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { fetchBooks } from '../../services/api';
import { registerForPushNotificationsAsync, sendPushNotification } from '../../services/notification';

// Improved BookCard component with MaterialCommunityIcons
const BookCard = ({ book }) => {
  const [bookmarked, setBookmarked] = useState(false);
  
  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };
  
  return (
    <View style={[styles.bookCard, { backgroundColor: Colors.surface, borderColor: Colors.border }]}>
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
          icon={({size, color}) => (
            <MaterialCommunityIcons 
              name={bookmarked ? 'bookmark' : 'bookmark-outline'} 
              size={size} 
              color={bookmarked ? Colors.tint : color} 
            />
          )}
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
        <Button 
          mode="outlined" 
          style={styles.bookCardButton}
          icon={({size, color}) => (
            <MaterialCommunityIcons name="information-outline" size={size} color={color} />
          )}
        >
          Details
        </Button>
        <Button 
          mode="contained" 
          style={styles.bookCardButton}
          buttonColor={Colors.tint}
          icon={({size, color}) => (
            <MaterialCommunityIcons name="eye-outline" size={size} color={color} />
          )}
        >
          Preview
        </Button>
      </View>
    </View>
  );
};

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const theme = useTheme();

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
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]} edges={['top']}>
      <Appbar.Header style={[styles.header, { backgroundColor: Colors.background }]}>
        <Appbar.Content 
          title="Book Explorer" 
          titleStyle={[styles.headerTitle, { color: Colors.tint }]} 
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
            left={
              <TextInput.Icon 
                icon={({size, color}) => (
                  <MaterialCommunityIcons name="book-search" size={size} color={Colors.tint} />
                )} 
              />
            }
            right={
              query ? 
              <TextInput.Icon 
                icon={({size}) => (
                  <MaterialCommunityIcons name="close" size={size} color={Colors.icon} />
                )} 
                onPress={() => setQuery('')} 
              /> 
              : null
            }
            style={styles.searchInput}
            outlineStyle={styles.searchInputOutline}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            autoCapitalize="none"
            theme={{ colors: { onSurfaceVariant: Colors.icon } }}
          />
          <Button 
            mode="contained" 
            onPress={handleSearch} 
            style={styles.searchButton}
            buttonColor={Colors.tint}
            textColor="#fff"
            disabled={loading || !query.trim()}
            icon={({size, color}) => (
              <MaterialCommunityIcons name="magnify" size={size} color={color} />
            )}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>

          {recentSearches.length > 0 && !books.length && (
            <View style={styles.recentSearchesContainer}>
              <Text variant="labelMedium" style={[styles.recentSearchesTitle, { color: Colors.text }]}>
                Recent Searches
              </Text>
              <View style={styles.chipContainer}>
                {recentSearches.map((term, idx) => (
                  <Chip 
                    key={idx} 
                    icon={({size, color}) => (
                      <MaterialCommunityIcons name="history" size={size} color={color} />
                    )}
                    onPress={() => handleRecentSearch(term)}
                    style={styles.recentSearchChip}
                    textStyle={{ color: Colors.tint }}
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
            <ActivityIndicator size="large" color={Colors.tint} />
            <Text style={[styles.loadingText, { color: Colors.text }]}>
              Searching for books...
            </Text>
          </View>
        ) : (
          <>
            {books.length > 0 && (
              <View style={styles.resultsContainer}>
                <Text variant="titleMedium" style={[styles.resultsTitle, { color: Colors.text }]}>
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
                <MaterialCommunityIcons name="book-alert" size={64} color={Colors.icon} />
                <Text variant="titleMedium" style={[styles.emptyTitle, { color: Colors.text }]}>
                  No books found
                </Text>
                <Text variant="bodyMedium" style={[styles.emptySubtitle, { color: Colors.icon }]}>
                  Try another search term or check your spelling
                </Text>
              </View>
            )}
            
            {!query.trim() && !books.length && (
              <View style={styles.hintContainer}>
                <MaterialCommunityIcons name="book-search" size={64} color={Colors.tint} />
                <Text variant="titleMedium" style={[styles.hintTitle, { color: Colors.text }]}>
                  Search for books
                </Text>
                <Text variant="bodyMedium" style={[styles.hintSubtitle, { color: Colors.icon }]}>
                  Enter a title, author, or topic to discover books
                </Text>
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
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    marginBottom: 12,
    backgroundColor: Colors.background,
  },
  searchInputOutline: {
    borderRadius: 8,
    borderColor: Colors.border,
  },
  searchButton: {
    borderRadius: 8,
    marginBottom: 16,
  },
  recentSearchesContainer: {
    marginVertical: 12,
  },
  recentSearchesTitle: {
    marginBottom: 8,
    fontWeight: '500',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 4,
  },
  recentSearchChip: {
    margin: 4,
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  resultsContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  resultsTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  divider: {
    marginBottom: 16,
    backgroundColor: Colors.border,
  },
  bookCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
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
    color: Colors.text,
  },
  cardDivider: {
    marginVertical: 12,
    backgroundColor: Colors.border,
  },
  bookCardAuthor: {
    marginTop: 2,
    color: Colors.icon,
  },
  bookCardDescription: {
    marginBottom: 16,
    lineHeight: 20,
    color: Colors.text,
  },
  bookmarkButton: {
    margin: 0,
    marginTop: -8,
    marginRight: -8,
  },
  bookCardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  bookCardButton: {
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    marginHorizontal: 20,
  },
  hintContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  hintTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  hintSubtitle: {
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
});