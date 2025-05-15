import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function HomeScreen() {
    const theme = useTheme();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.content}>
                <MaterialCommunityIcons name="book-open-page-variant" size={100} color={Colors.tint} />
                
                <Text variant="headlineMedium" style={styles.title}>
                    Book Explorer
                </Text>
                
                <Text variant="bodyLarge" style={styles.subtitle}>
                    Discover your next favorite book with our easy-to-use search tool.
                </Text>
                
                <View style={styles.featureContainer}>
                    <FeatureItem 
                        icon="book-search" 
                        title="Search Books" 
                        description="Find books by title, author or keywords"
                    />
                    <FeatureItem 
                        icon="bookmark-plus" 
                        title="Save Favorites" 
                        description="Bookmark books to read later"
                    />
                    <FeatureItem 
                        icon="bookshelf" 
                        title="Huge Library" 
                        description="Access millions of books in our database"
                    />
                </View>
                
                <Button 
                    mode="contained" 
                    onPress={() => router.push('/(tabs)/explore')}
                    icon="arrow-right"
                    contentStyle={styles.buttonContent}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                >
                    Start Exploring
                </Button>
            </View>
        </SafeAreaView>
    );
}

function FeatureItem({ icon, title, description }) {
    return (
        <View style={styles.featureItem}>
            <View style={[styles.iconContainer, { backgroundColor: Colors.tint + '15' }]}>
                <MaterialCommunityIcons name={icon} size={28} color={Colors.tint} />
            </View>
            <View style={styles.featureTextContainer}>
                <Text variant="titleMedium" style={styles.featureTitle}>{title}</Text>
                <Text variant="bodySmall" style={styles.featureDescription}>{description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 8,
        textAlign: 'center',
        color: Colors.text,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 40,
        color: Colors.icon,
        maxWidth: '80%',
    },
    featureContainer: {
        width: '100%',
        flexDirection: 'column',
        marginBottom: 40,
        gap: 24,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        backgroundColor: Colors.surface,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    featureTextContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    featureTitle: {
        fontWeight: '600',
        marginBottom: 4,
        color: Colors.text,
    },
    featureDescription: {
        color: Colors.icon,
    },
    button: {
        borderRadius: 30,
        paddingHorizontal: 16,
        elevation: 2,
        backgroundColor: Colors.tint,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    buttonContent: {
        height: 50,
        flexDirection: 'row-reverse',
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
        color: '#fff',
    },
});
