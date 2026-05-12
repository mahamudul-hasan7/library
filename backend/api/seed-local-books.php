<?php
// backend/api/seed-local-books.php - Add PDFs from Assets/books to database

require_once '../config.php';

try {
    // Books from local Assets/books folder
    $localBooks = [
        [
            'title' => 'Atomic Habits',
            'author' => 'James Clear',
            'filename' => 'Atomic Habits Original.pdf',
            'category' => 'Productivity',
            'description' => 'Transform your habits with small, incremental changes. Learn proven strategies for habit formation and breaking bad habits.',
            'published_year' => 2018,
            'pages' => 320,
            'image_url' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80'
        ],
        [
            'title' => 'Deep Work',
            'author' => 'Cal Newport',
            'filename' => 'Deep-Work-Cal-Newport.pdf',
            'category' => 'Productivity',
            'description' => 'Master the ability to focus without distraction. Discover how to achieve more meaningful work in less time through deep focus.',
            'published_year' => 2016,
            'pages' => 296,
            'image_url' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80'
        ],
        [
            'title' => 'The Origin of Species',
            'author' => 'Charles Darwin',
            'filename' => 'origin_of_species.pdf',
            'category' => 'Science',
            'description' => 'Darwin\'s groundbreaking work on evolution and natural selection. A cornerstone of modern biological science.',
            'published_year' => 1859,
            'pages' => 502,
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],
        [
            'title' => 'Sample Architecture Guide',
            'author' => 'Architecture Institute',
            'filename' => 'sample-architecture-guide.pdf',
            'category' => 'Architecture',
            'description' => 'A comprehensive guide to architectural principles, design patterns, and construction techniques.',
            'published_year' => 2020,
            'pages' => 256,
            'image_url' => 'https://images.unsplash.com/photo-1480714378408-67cf0d5c46f6?auto=format&fit=crop&w=700&q=80'
        ],
        [
            'title' => 'The Great Gatsby',
            'author' => 'F. Scott Fitzgerald',
            'filename' => 'TheGreatGatsby.pdf',
            'category' => 'Classic Literature',
            'description' => 'A timeless tale of wealth, love, and the American Dream during the Jazz Age.',
            'published_year' => 1925,
            'pages' => 180,
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ]
    ];

    $insertCount = 0;
    $skipCount = 0;
    $errorCount = 0;

    foreach ($localBooks as $book) {
        // Build file URL - pointing to local PDF
        $fileUrl = '../Assets/books/' . urlencode($book['filename']);

        // Check if file exists
        $filePath = realpath(dirname(__FILE__)) . '/../../Assets/books/' . $book['filename'];
        if (!file_exists($filePath)) {
            echo "✗ File not found: " . $book['filename'] . "\n";
            $errorCount++;
            continue;
        }

        try {
            // Use INSERT IGNORE to skip duplicates
            $query = "INSERT IGNORE INTO books 
                      (title, author, category, description, access_type, image_url, file_url, published_year, pages, language, format, section_name, status) 
                      VALUES (?, ?, ?, ?, 'free', ?, ?, ?, ?, 'English', 'Digital', 'collection', 'Available')";
            
            $stmt = $conn->prepare($query);
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $conn->error);
            }
            
            $stmt->bind_param(
                "ssssssii", 
                $book['title'],
                $book['author'],
                $book['category'],
                $book['description'],
                $book['image_url'],
                $fileUrl,
                $book['published_year'],
                $book['pages']
            );
            
            // Convert to integers
            $published_year = (int)$book['published_year'];
            $pages = (int)$book['pages'];
            
            $stmt->bind_param(
                "sssssiii", 
                $book['title'],
                $book['author'],
                $book['category'],
                $book['description'],
                $book['image_url'],
                $fileUrl,
                $published_year,
                $pages
            );

            if ($stmt->execute()) {
                if ($stmt->affected_rows > 0) {
                    $insertCount++;
                    echo "✓ Added: " . $book['title'] . " by " . $book['author'] . "\n";
                } else {
                    $skipCount++;
                    echo "- Skipped (duplicate): " . $book['title'] . "\n";
                }
            } else {
                throw new Exception("Execute failed: " . $stmt->error);
            }
            $stmt->close();

        } catch (Exception $error) {
            $errorCount++;
            echo "✗ Error adding " . $book['title'] . ": " . $error->getMessage() . "\n";
        }
    }

    echo "\n\n=== SEEDING COMPLETE ===\n";
    echo "Books added: $insertCount\n";
    echo "Books skipped (duplicates): $skipCount\n";
    echo "Errors: $errorCount\n";
    echo "Total: " . ($insertCount + $skipCount + $errorCount) . "\n\n";

    sendJson([
        'success' => true,
        'message' => "Local books seeded successfully",
        'books_inserted' => $insertCount,
        'books_skipped' => $skipCount,
        'errors' => $errorCount,
        'total' => $insertCount + $skipCount + $errorCount
    ]);

} catch (Exception $e) {
    echo "Fatal error: " . $e->getMessage() . "\n";
    sendJson([
        'success' => false,
        'error' => $e->getMessage()
    ], 500);
}
?>

