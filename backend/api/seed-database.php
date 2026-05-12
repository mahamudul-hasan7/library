<?php
// seed-database.php - Insert sample data into database

require_once '../config.php';

try {
    ensureBookCatalogColumns($conn);
    ensureBorrowedBookColumns($conn);

    // Insert books
    $books = [
        ['The Kite Runner', 'Khaled Hosseini', 'Drama', 'A powerful story of friendship and redemption', 'free'],
        ['Atomic Habits', 'James Clear', 'Productivity', 'Transform your life through small habits', 'free'],
        ['Educated', 'Tara Westover', 'Biography', 'A memoir about a young woman who grows up in a survivalist family', 'free'],
        ['Dune', 'Frank Herbert', 'Science Fiction', 'Epic sci-fi novel about politics and power', 'paid'],
        ['The Silent Patient', 'Alex Michaelides', 'Thriller', 'A psychological thriller about a woman who refuses to speak', 'paid'],
        ['Why We Sleep', 'Matthew Walker', 'Science', 'Understanding the power of sleep and dreams', 'free'],
        ['The Digital Archive', 'Various', 'Technology', 'A comprehensive guide to digital preservation', 'free'],
        ['Urban Rhythms', 'Jane Jacobs', 'Urban Planning', 'How cities function and evolve', 'paid'],
        ['Minimalist Logic', 'Joshua Fields Millburn', 'Philosophy', 'Living with less, gaining more', 'paid'],
        ['Green Horizons', 'Rachel Carson', 'Environment', 'The environmental movement begins', 'free']
    ];
    
    $insertBookQuery = "INSERT IGNORE INTO books (title, author, category, description, access_type) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($insertBookQuery);
    
    foreach ($books as $book) {
        $stmt->bind_param("sssss", $book[0], $book[1], $book[2], $book[3], $book[4]);
        $stmt->execute();
    }
    
    echo "✅ Books inserted successfully\n";
    
    ensureDefaultBookCoverImages($conn);

    // Insert test user (password: Test@123)
    $hashedPassword = password_hash('Test@123', PASSWORD_BCRYPT);
    $insertUserQuery = "INSERT IGNORE INTO users (email, password, name, plan_type) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($insertUserQuery);
    $email = 'test@example.com';
    $name = 'Test User';
    $plan = 'free';
    $stmt->bind_param("ssss", $email, $hashedPassword, $name, $plan);
    $stmt->execute();
    
    echo "✅ Test user inserted successfully\n";
    echo "   Email: test@example.com\n";
    echo "   Password: Test@123\n";
    
    // Add test collection
    $getBookQuery = "SELECT id FROM books LIMIT 3";
    $result = $conn->query($getBookQuery);
    $getUserQuery = "SELECT id FROM users WHERE email = 'test@example.com'";
    $userResult = $conn->query($getUserQuery);
    
    if ($userResult && $userResult->num_rows > 0) {
        $user = $userResult->fetch_assoc();
        $userId = $user['id'];
        
        $collectionValues = [
            [$userId, 1, 45, 80],
            [$userId, 3, 20, 70]
        ];
        
        $insertCollectionQuery = "INSERT IGNORE INTO collections (user_id, book_id, progress, importance) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($insertCollectionQuery);
        
        foreach ($collectionValues as $collection) {
            $stmt->bind_param("iiii", $collection[0], $collection[1], $collection[2], $collection[3]);
            $stmt->execute();
        }

        $historyCheckQuery = "SELECT COUNT(*) AS history_count FROM borrowed_books WHERE user_id = ? AND book_id IN (1, 2, 3)";
        $stmt = $conn->prepare($historyCheckQuery);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $historyCount = (int) ($stmt->get_result()->fetch_assoc()['history_count'] ?? 0);

        if ($historyCount === 0) {
            $insertBorrowHistoryQuery = "
                INSERT INTO borrowed_books (user_id, book_id, borrowed_at, due_at, returned_at) VALUES
                (?, 1, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_ADD(NOW(), INTERVAL 4 DAY), NULL),
                (?, 2, DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
                (?, 3, DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 16 DAY), NULL)
            ";
            $stmt = $conn->prepare($insertBorrowHistoryQuery);
            $stmt->bind_param("iii", $userId, $userId, $userId);
            $stmt->execute();
        }
        
        echo "✅ Sample collections added\n";
    }
    
    echo "\n✨ Database seeded successfully!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

$conn->close();
?>
