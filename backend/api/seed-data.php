<?php
// backend/api/seed-data.php - Seed initial data into database

require_once '../config.php';

try {
    // Insert Books
    $books = [
        // Featured/Trending
        ['The Form of Space', 'Christopher Alexander', 'Architecture', 'free', 'https://images.unsplash.com/photo-1480714378408-67cf0d5c46f6?auto=format&fit=crop&w=900&q=80'],
        ['Urban Rhythms', 'Kenzo Tange', 'Urbanism', 'paid', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80'],
        ['The Digital Archive', 'Digital Curators', 'History', 'free', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80'],
        ['Lost Collections', 'Archaeological Review', 'History', 'paid', 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80'],
        ['Minimalist Logic', 'Ludwig Mies', 'Design', 'paid', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80'],
        ['Future Structures', 'Futurist Society', 'Architecture', 'free', 'https://images.unsplash.com/photo-1480714378408-67cf0d5c46f6?auto=format&fit=crop&w=900&q=80'],
        ['Green Horizons', 'Landscape Institute', 'Design', 'free', 'https://images.unsplash.com/photo-1469122312224-c5846569feb1?auto=format&fit=crop&w=900&q=80'],
        
        // Popular books
        ['The Kite Runner', 'Khaled Hosseini', 'Drama', 'free', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80'],
        ['Atomic Habits', 'James Clear', 'Productivity', 'free', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80'],
        ['The Silent Patient', 'Alex Michaelides', 'Mystery', 'free', 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=700&q=80'],
        ['Educated', 'Tara Westover', 'Memoir', 'free', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=80'],
        ['Why We Sleep', 'Matthew Walker', 'Health', 'free', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=700&q=80'],
        
        // Architecture
        ['Metropolitan Tunnels', 'Urban Systems Review', 'Architecture', 'free', 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=700&q=80'],
        ['Concrete Poetry', 'Tadao Ando', 'Theory', 'free', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=700&q=80'],
        ['Vascular Cities', 'Urban Planning Journal', 'Urbanism', 'free', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=700&q=80'],
        ['Silent Archives', 'Curation Lab', 'History', 'free', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=700&q=80'],
        ['The Geometry of Silence', 'Elena V. Kostova', 'Architecture', 'paid', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=1200&q=80'],
        ['Structure & Light', 'Louis Kahn', 'Architecture', 'paid', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=700&q=80'],
        ['Urban Metabolism', 'Kenzo Tange', 'Urbanism', 'paid', 'https://images.unsplash.com/photo-1469122312224-c5846569feb1?auto=format&fit=crop&w=700&q=80'],
        ['The Modular Man', 'Design Institute', 'Design', 'paid', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=700&q=80'],
        
        // More popular
        ['Dune', 'Frank Herbert', 'Sci-Fi', 'paid', 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=700&q=80'],
        ['The Power of Habit', 'Charles Duhigg', 'Productivity', 'free', 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=700&q=80'],
        ['Deep Work', 'Cal Newport', 'Productivity', 'free', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80'],
        ['Sapiens', 'Yuval Noah Harari', 'History', 'paid', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=700&q=80'],
        ['Hidden Figures', 'Margot Lee Shetterly', 'Biography', 'free', 'https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=700&q=80'],
        ['The Lean Startup', 'Eric Ries', 'Business', 'free', 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=700&q=80'],
    ];
    
    $insertCount = 0;
    foreach ($books as $book) {
        $query = "INSERT IGNORE INTO books (title, author, category, access_type, image_url) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $stmt->bind_param("sssss", $book[0], $book[1], $book[2], $book[3], $book[4]);
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                $insertCount++;
            }
        } else {
            throw new Exception("Execute failed: " . $stmt->error);
        }
    }
    
    sendJson([
        'success' => true,
        'message' => "Data seeded successfully",
        'books_inserted' => $insertCount,
        'total_books' => count($books)
    ]);

} catch (Exception $e) {
    sendJson([
        'success' => false,
        'error' => $e->getMessage()
    ], 500);
}
?>
