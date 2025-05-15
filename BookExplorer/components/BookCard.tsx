import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip, Avatar, useTheme } from 'react-native-paper';

export default function BookCard({ book }: { book: any }) {
  const theme = useTheme();
  
  return (
    <Card style={styles.card} elevation={3}>
        {book.imageLinks?.thumbnail && (
            <Card.Cover 
            source={{ uri: book.imageLinks.thumbnail }} 
            style={styles.cover} 
            resizeMode="cover" 
            />
        )}
      <Card.Title 
        title={book.title} 
        titleStyle={styles.title}
        subtitle={book.authors?.join(', ') || 'Unknown Author'}
        subtitleStyle={styles.subtitle}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon="book"
            color={theme.colors.primary}
            style={{ backgroundColor: theme.colors.primaryContainer }}
          />
        )}
      />
      <Card.Content>
        <Text variant="bodyMedium" style={styles.description}>
          {book.description?.substring(0, 150) + (book.description?.length > 150 ? '...' : '') || 'No description available.'}
        </Text>
        
        <View style={styles.chipContainer}>
          {book.categories?.slice(0, 3).map((category: string, idx: number) => (
            <Chip key={idx} style={styles.chip} textStyle={styles.chipText}>
              {category}
            </Chip>
          ))}
          {book.pageCount && (
            <Chip icon="file-document-outline" style={styles.chip} textStyle={styles.chipText}>
              {book.pageCount} pages
            </Chip>
          )}
        </View>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Text variant="labelSmall" style={styles.publishInfo}>
          {book.publisher ? `Published by ${book.publisher}` : ''} 
          {book.publishedDate ? (book.publisher ? ' · ' : '') + book.publishedDate : ''}
        </Text>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    marginHorizontal: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cover: {
    height: 0,
    resizeMode: 'cover',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  subtitle: {
    opacity: 0.8,
  },
  description: {
    marginTop: 8,
    marginBottom: 12,
    lineHeight: 20,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
  },
  actions: {
    justifyContent: 'flex-end',
    paddingTop: 0,
  },
  publishInfo: {
    opacity: 0.6,
    fontStyle: 'italic',
  },
});