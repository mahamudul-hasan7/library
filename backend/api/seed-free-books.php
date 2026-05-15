<?php
// backend/api/seed-free-books.php - Add legitimate copyright-free books from Project Gutenberg

require_once '../config.php';

if (isProductionEnvironment()) {
    sendJson(['success' => false, 'error' => 'Not found'], 404);
}

requireAdminUser($conn);

try {
    // Books from Project Gutenberg (public domain - copyright-free)
    $freeBooks = [
        // Classic Literature
        [
            'title' => 'Pride and Prejudice',
            'author' => 'Jane Austen',
            'category' => 'Classic Literature',
            'description' => 'A romantic novel of manners and marriage from the Regency era.',
            'published_year' => 1813,
            'pages' => 432,
            'file_url' => 'https://www.gutenberg.org/files/1342/1342-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],
        [
            'title' => 'Wuthering Heights',
            'author' => 'Emily Brontë',
            'category' => 'Classic Literature',
            'description' => 'A dark and passionate love story set on the Yorkshire moors.',
            'published_year' => 1847,
            'pages' => 352,
            'file_url' => 'https://www.gutenberg.org/files/768/768-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],
        [
            'title' => 'Jane Eyre',
            'author' => 'Charlotte Brontë',
            'category' => 'Classic Literature',
            'description' => 'A novel of passion, social criticism, and a woman\'s search for independence.',
            'published_year' => 1847,
            'pages' => 448,
            'file_url' => 'https://www.gutenberg.org/files/1260/1260-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],
        [
            'title' => 'The Great Gatsby',
            'author' => 'F. Scott Fitzgerald',
            'category' => 'Classic Literature',
            'description' => 'A tale of wealth, love, and the American Dream in the Jazz Age.',
            'published_year' => 1925,
            'pages' => 180,
            'file_url' => 'https://www.gutenberg.org/files/4300/4300-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],
        [
            'title' => 'Moby Dick',
            'author' => 'Herman Melville',
            'category' => 'Classic Literature',
            'description' => 'An epic tale of obsession and the sea, following Captain Ahab and the white whale.',
            'published_year' => 1851,
            'pages' => 625,
            'file_url' => 'https://www.gutenberg.org/files/2701/2701-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],
        [
            'title' => 'Frankenstein',
            'author' => 'Mary Wollstonecraft Shelley',
            'category' => 'Horror',
            'description' => 'The classic tale of Victor Frankenstein and his monster.',
            'published_year' => 1818,
            'pages' => 280,
            'file_url' => 'https://www.gutenberg.org/files/84/84-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],
        [
            'title' => 'The Picture of Dorian Gray',
            'author' => 'Oscar Wilde',
            'category' => 'Classic Literature',
            'description' => 'A philosophical novel about beauty, morality, and corruption.',
            'published_year' => 1890,
            'pages' => 254,
            'file_url' => 'https://www.gutenberg.org/files/4078/4078-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],
        [
            'title' => 'Alice\'s Adventures in Wonderland',
            'author' => 'Lewis Carroll',
            'category' => 'Fantasy',
            'description' => 'A whimsical journey through a magical world.',
            'published_year' => 1865,
            'pages' => 96,
            'file_url' => 'https://www.gutenberg.org/files/11/11-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],
        [
            'title' => 'The Count of Monte Cristo',
            'author' => 'Alexandre Dumas',
            'category' => 'Adventure',
            'description' => 'A thrilling tale of betrayal, imprisonment, and revenge.',
            'published_year' => 1844,
            'pages' => 928,
            'file_url' => 'https://www.gutenberg.org/files/1155/1155-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],
        [
            'title' => 'Les Misérables',
            'author' => 'Victor Hugo',
            'category' => 'Classic Literature',
            'description' => 'An epic novel set in 19th century France following Jean Valjean.',
            'published_year' => 1862,
            'pages' => 1232,
            'file_url' => 'https://www.gutenberg.org/files/24280/24280-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],

        // Philosophy & Essays
        [
            'title' => 'A Treatise of Human Nature',
            'author' => 'David Hume',
            'category' => 'Philosophy',
            'description' => 'A philosophical work examining human nature and knowledge.',
            'published_year' => 1739,
            'pages' => 528,
            'file_url' => 'https://www.gutenberg.org/files/4705/4705-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],
        [
            'title' => 'Meditations',
            'author' => 'Marcus Aurelius',
            'category' => 'Philosophy',
            'description' => 'Personal writings on Stoic philosophy and wisdom.',
            'published_year' => 170,
            'pages' => 216,
            'file_url' => 'https://www.gutenberg.org/files/2680/2680-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],

        // Science & Non-Fiction
        [
            'title' => 'The Origin of Species',
            'author' => 'Charles Darwin',
            'category' => 'Science',
            'description' => 'Darwin\'s groundbreaking work on evolution and natural selection.',
            'published_year' => 1859,
            'pages' => 502,
            'file_url' => 'https://www.gutenberg.org/files/2009/2009-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],
        [
            'title' => 'An Enquiry Concerning Human Understanding',
            'author' => 'David Hume',
            'category' => 'Philosophy',
            'description' => 'An influential work on empiricism and human understanding.',
            'published_year' => 1748,
            'pages' => 232,
            'file_url' => 'https://www.gutenberg.org/files/9662/9662-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],

        // Adventure & Mystery
        [
            'title' => 'Treasure Island',
            'author' => 'Robert Louis Stevenson',
            'category' => 'Adventure',
            'description' => 'A thrilling adventure story of pirates and hidden treasure.',
            'published_year' => 1882,
            'pages' => 292,
            'file_url' => 'https://www.gutenberg.org/files/120/120-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],
        [
            'title' => 'The Adventures of Sherlock Holmes',
            'author' => 'Arthur Conan Doyle',
            'category' => 'Mystery',
            'description' => 'A collection of detective stories featuring the famous Sherlock Holmes.',
            'published_year' => 1892,
            'pages' => 307,
            'file_url' => 'https://www.gutenberg.org/files/1661/1661-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],
        [
            'title' => 'The Strange Case of Dr Jekyll and Mr Hyde',
            'author' => 'Robert Louis Stevenson',
            'category' => 'Mystery',
            'description' => 'A psychological thriller about the duality of human nature.',
            'published_year' => 1886,
            'pages' => 138,
            'file_url' => 'https://www.gutenberg.org/files/42/42-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],

        // Classics - More
        [
            'title' => 'A Tale of Two Cities',
            'author' => 'Charles Dickens',
            'category' => 'Classic Literature',
            'description' => 'Set during the French Revolution, a tale of love and sacrifice.',
            'published_year' => 1859,
            'pages' => 489,
            'file_url' => 'https://www.gutenberg.org/files/98/98-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],
        [
            'title' => 'David Copperfield',
            'author' => 'Charles Dickens',
            'category' => 'Classic Literature',
            'description' => 'The semi-autobiographical journey of David Copperfield through Victorian England.',
            'published_year' => 1850,
            'pages' => 624,
            'file_url' => 'https://www.gutenberg.org/files/766/766-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],
        [
            'title' => 'Great Expectations',
            'author' => 'Charles Dickens',
            'category' => 'Classic Literature',
            'description' => 'A coming-of-age story set in Victorian England.',
            'published_year' => 1860,
            'pages' => 505,
            'file_url' => 'https://www.gutenberg.org/files/580/580-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],
        [
            'title' => 'Oliver Twist',
            'author' => 'Charles Dickens',
            'category' => 'Classic Literature',
            'description' => 'A social novel about an orphan boy in Victorian London.',
            'published_year' => 1837,
            'pages' => 497,
            'file_url' => 'https://www.gutenberg.org/files/730/730-0.txt',
            'image_url' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=700&q=80'
        ],
    ];

    $insertCount = 0;
    $skipCount = 0;

    foreach ($freeBooks as $book) {
        // Use INSERT IGNORE to skip duplicates
        $query = "INSERT IGNORE INTO books 
                  (title, author, category, description, access_type, image_url, file_url, published_year, pages, language, format, section_name, status) 
                  VALUES (?, ?, ?, ?, 'free', ?, ?, ?, ?, 'English', 'Digital', 'collection', 'Available')";
        
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $stmt->bind_param(
            "ssssssi", 
            $book['title'],
            $book['author'],
            $book['category'],
            $book['description'],
            $book['image_url'],
            $book['file_url'],
            $book['published_year'],
            $book['pages']
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
            throw new Exception("Execute failed for " . $book['title'] . ": " . $stmt->error);
        }
        $stmt->close();
    }

    echo "\n\n=== SEEDING COMPLETE ===\n";
    echo "Books added: $insertCount\n";
    echo "Books skipped (duplicates): $skipCount\n";
    echo "Total: " . ($insertCount + $skipCount) . "\n\n";
    echo "All books are from Project Gutenberg (public domain - no copyright issues)\n";
    echo "File URLs point to plain text versions from gutenberg.org\n";

    sendJson([
        'success' => true,
        'message' => "Free books seeded successfully",
        'books_inserted' => $insertCount,
        'books_skipped' => $skipCount,
        'total' => $insertCount + $skipCount,
        'note' => 'All books are copyright-free from Project Gutenberg'
    ]);

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    sendJson([
        'success' => false,
        'error' => $e->getMessage()
    ], 500);
}
?>
