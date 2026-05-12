<?php
// backend/api/books.php - Complete book catalog CRUD API

// Set JSON header immediately
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Prevent any output before JSON
ob_start();
ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once '../config.php';

ensureBookCatalogColumns($conn);

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$bookId = $_GET['id'] ?? null;
$section = $_GET['section'] ?? null;

// Handle different HTTP methods
if ($method === 'GET' && $action === 'list') {
    // Get all books
    getBooks($conn);
} else if ($method === 'GET' && $section) {
    // Get books by featured section
    getBooksBySection($conn, $section);
} else if ($method === 'POST') {
    // Add new book
    addBook($conn);
} else if ($method === 'PUT' && $bookId) {
    // Update book
    updateBook($conn, $bookId);
} else if ($method === 'DELETE' && $bookId) {
    // Delete book
    deleteBook($conn, $bookId);
} else if ($method === 'GET') {
    // Default: get all books for public view
    getPublicBooks($conn);
} else {
    sendJson(['success' => false, 'error' => 'Method not allowed'], 405);
}

function getPublicBooks($conn) {
    seedBookCatalog($conn);

    $query = "
        SELECT
            id, title, author, category, description, access_type,
            image_url, rating_average, rating_count, published_year,
            language, format, pages, file_url, sample_url,
            section_name, status, created_at
        FROM books
        ORDER BY
            FIELD(section_name, 'trending', 'topReading', 'mostLiked', 'collection'),
            rating_average DESC,
            title ASC
    ";

    $result = $conn->query($query);
    $books = [];

    while ($row = $result->fetch_assoc()) {
        $row['rating_average'] = (float) $row['rating_average'];
        $row['rating_count'] = (int) $row['rating_count'];
        $row['published_year'] = $row['published_year'] === null ? null : (int) $row['published_year'];
        $row['pages'] = $row['pages'] === null ? null : (int) $row['pages'];
        $books[] = $row;
    }

    sendJson(['success' => true, 'data' => $books]);
}

function getBooks($conn) {
    $query = "
        SELECT
            id, title, author, category, description, access_type,
            image_url, published_year, pages, file_url, sample_url,
            section_name, status, view_count, like_count, featured_section,
            created_at
        FROM books
        ORDER BY title ASC
    ";

    $result = $conn->query($query);
    $books = [];

    while ($row = $result->fetch_assoc()) {
        $row['id'] = (int) $row['id'];
        $row['published_year'] = $row['published_year'] ? (int) $row['published_year'] : null;
        $row['pages'] = $row['pages'] ? (int) $row['pages'] : null;
        $books[] = $row;
    }

    sendJson([
        'success' => true,
        'books' => $books,
        'count' => count($books)
    ]);
}

function getBooksBySection($conn, $section) {
    // Validate section
    $valid_sections = ['trending', 'top_reading', 'most_liked'];
    if (!in_array($section, $valid_sections)) {
        sendJson(['success' => false, 'error' => 'Invalid section'], 400);
        return;
    }

    $query = "
        SELECT
            id, title, author, category, description, access_type,
            image_url, rating_average, rating_count, published_year,
            language, format, pages, file_url, sample_url,
            section_name, status, view_count, like_count, featured_section,
            created_at
        FROM books
        WHERE featured_section = ?
        ORDER BY 
            CASE featured_section
                WHEN 'trending' THEN view_count
                WHEN 'most_liked' THEN like_count
                WHEN 'top_reading' THEN view_count
                ELSE 0
            END DESC,
            rating_average DESC,
            title ASC
    ";

    $stmt = $conn->prepare($query);
    if (!$stmt) {
        sendJson(['success' => false, 'error' => 'Query prepare failed'], 500);
        return;
    }

    $stmt->bind_param('s', $section);
    if (!$stmt->execute()) {
        sendJson(['success' => false, 'error' => 'Query execution failed'], 500);
        return;
    }

    $result = $stmt->get_result();
    $books = [];

    while ($row = $result->fetch_assoc()) {
        $row['id'] = (int) $row['id'];
        $row['rating_average'] = (float) $row['rating_average'];
        $row['rating_count'] = (int) $row['rating_count'];
        $row['published_year'] = $row['published_year'] ? (int) $row['published_year'] : null;
        $row['pages'] = $row['pages'] ? (int) $row['pages'] : null;
        $row['view_count'] = (int) $row['view_count'];
        $row['like_count'] = (int) $row['like_count'];
        $books[] = $row;
    }

    sendJson([
        'success' => true,
        'section' => $section,
        'books' => $books,
        'count' => count($books)
    ]);
}

function addBook($conn) {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!is_array($input)) {
        sendJson(['success' => false, 'error' => 'Invalid JSON'], 400);
    }

    $title = trim($input['title'] ?? '');
    $author = trim($input['author'] ?? '');
    $category = trim($input['category'] ?? '');
    $description = trim($input['description'] ?? '');
    $access_type = trim($input['access_type'] ?? 'free');
    $image_url = trim($input['image_url'] ?? '');
    $file_url = trim($input['file_url'] ?? '');
    $published_year = intval($input['published_year'] ?? 0) ?: null;
    $pages = intval($input['pages'] ?? 0) ?: null;
    $featured_section = trim($input['featured_section'] ?? 'none');

    // Validate featured_section
    $valid_sections = ['trending', 'top_reading', 'most_liked', 'none'];
    if (!in_array($featured_section, $valid_sections)) {
        $featured_section = 'none';
    }

    if (!$title) {
        sendJson(['success' => false, 'error' => 'Title is required'], 400);
    }

    try {
        $query = "
            INSERT INTO books
            (title, author, category, description, access_type, image_url, file_url, 
             published_year, pages, language, format, section_name, status, featured_section, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'English', 'Digital', 'collection', 'Available', ?, NOW())
        ";

        $stmt = $conn->prepare($query);
        
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }

        $stmt->bind_param(
            'ssssssssiss',
            $title,
            $author,
            $category,
            $description,
            $access_type,
            $image_url,
            $file_url,
            $published_year,
            $pages,
            $featured_section
        );

        if (!$stmt->execute()) {
            throw new Exception("Execute failed: " . $stmt->error);
        }

        $newId = $stmt->insert_id;

        sendJson([
            'success' => true,
            'message' => 'Book added successfully',
            'book_id' => $newId
        ]);

    } catch (Exception $error) {
        if ($error->getCode() == 1062) {
            sendJson(['success' => false, 'error' => 'Book with this title already exists'], 409);
        }
        sendJson(['success' => false, 'error' => $error->getMessage()], 500);
    }
}

function updateBook($conn, $bookId) {
    $bookId = intval($bookId);
    $input = json_decode(file_get_contents('php://input'), true);

    if (!is_array($input)) {
        sendJson(['success' => false, 'error' => 'Invalid JSON'], 400);
    }

    $title = $input['title'] ?? null;
    $author = $input['author'] ?? null;
    $category = $input['category'] ?? null;
    $description = $input['description'] ?? null;
    $access_type = $input['access_type'] ?? null;
    $image_url = $input['image_url'] ?? null;
    $file_url = $input['file_url'] ?? null;
    $published_year = intval($input['published_year'] ?? 0) ?: null;
    $pages = intval($input['pages'] ?? 0) ?: null;
    $featured_section = $input['featured_section'] ?? null;
    $view_count = intval($input['view_count'] ?? 0) ?: null;
    $like_count = intval($input['like_count'] ?? 0) ?: null;

    // Validate featured_section if provided
    if ($featured_section !== null) {
        $valid_sections = ['trending', 'top_reading', 'most_liked', 'none'];
        if (!in_array($featured_section, $valid_sections)) {
            $featured_section = null;
        }
    }

    $updates = [];
    $params = [];
    $types = '';

    if ($title !== null) {
        $updates[] = 'title = ?';
        $params[] = trim($title);
        $types .= 's';
    }
    if ($author !== null) {
        $updates[] = 'author = ?';
        $params[] = trim($author);
        $types .= 's';
    }
    if ($category !== null) {
        $updates[] = 'category = ?';
        $params[] = trim($category);
        $types .= 's';
    }
    if ($description !== null) {
        $updates[] = 'description = ?';
        $params[] = trim($description);
        $types .= 's';
    }
    if ($access_type !== null) {
        $updates[] = 'access_type = ?';
        $params[] = trim($access_type);
        $types .= 's';
    }
    if ($image_url !== null) {
        $updates[] = 'image_url = ?';
        $params[] = trim($image_url);
        $types .= 's';
    }
    if ($file_url !== null) {
        $updates[] = 'file_url = ?';
        $params[] = trim($file_url);
        $types .= 's';
    }
    if ($published_year !== null) {
        $updates[] = 'published_year = ?';
        $params[] = $published_year;
        $types .= 'i';
    }
    if ($pages !== null) {
        $updates[] = 'pages = ?';
        $params[] = $pages;
        $types .= 'i';
    }
    if ($featured_section !== null) {
        $updates[] = 'featured_section = ?';
        $params[] = $featured_section;
        $types .= 's';
    }
    if ($view_count !== null) {
        $updates[] = 'view_count = ?';
        $params[] = $view_count;
        $types .= 'i';
    }
    if ($like_count !== null) {
        $updates[] = 'like_count = ?';
        $params[] = $like_count;
        $types .= 'i';
    }

    if (empty($updates)) {
        sendJson(['success' => false, 'error' => 'No fields to update'], 400);
    }

    $params[] = $bookId;
    $types .= 'i';

    try {
        $query = 'UPDATE books SET ' . implode(', ', $updates) . ' WHERE id = ?';
        $stmt = $conn->prepare($query);
        
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }

        $stmt->bind_param($types, ...$params);
        
        if (!$stmt->execute()) {
            throw new Exception("Execute failed: " . $stmt->error);
        }

        sendJson([
            'success' => true,
            'message' => 'Book updated successfully'
        ]);

    } catch (Exception $error) {
        sendJson(['success' => false, 'error' => $error->getMessage()], 500);
    }
}

function deleteBook($conn, $bookId) {
    $bookId = intval($bookId);

    try {
        $query = 'DELETE FROM books WHERE id = ?';
        $stmt = $conn->prepare($query);
        
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }

        $stmt->bind_param('i', $bookId);
        
        if (!$stmt->execute()) {
            throw new Exception("Execute failed: " . $stmt->error);
        }

        if ($stmt->affected_rows === 0) {
            sendJson(['success' => false, 'error' => 'Book not found'], 404);
        } else {
            sendJson([
                'success' => true,
                'message' => 'Book deleted successfully'
            ]);
        }

    } catch (Exception $error) {
        sendJson(['success' => false, 'error' => $error->getMessage()], 500);
    }
}

function seedBookCatalog($conn) {
    $books = [
        ['The Design of Everyday Things', 'Don Norman', 'Design', 'A classic guide to user-centered design and why everyday objects succeed or fail.', 'paid', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80', 4.6, 132, 2013, 'English', 'Digital', 368, 'trending', 'Available'],
        ['A Pattern Language', 'Christopher Alexander', 'Architecture', 'A foundational book on architecture and urban planning through reusable design patterns.', 'paid', 'https://images.unsplash.com/photo-1480714378408-67cf0d5c46f6?auto=format&fit=crop&w=900&q=80', 4.8, 94, 1977, 'English', 'Digital', 1171, 'trending', 'Available'],
        ['Delirious New York', 'Rem Koolhaas', 'Urbanism', 'A manifesto on the architecture and culture of Manhattan as a modern city.', 'free', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80', 4.3, 57, 1978, 'English', 'Digital', 320, 'trending', 'Available'],
        ['Thinking, Fast and Slow', 'Daniel Kahneman', 'Psychology', 'A deep look at the two systems that shape human decision-making.', 'free', 'https://images.unsplash.com/photo-1495427513693-3f82f2e7f1e2?auto=format&fit=crop&w=900&q=80', 4.6, 186, 2011, 'English', 'Digital', 499, 'trending', 'Available'],
        ['The Architecture of Happiness', 'Alain de Botton', 'Architecture', 'An exploration of how buildings shape mood, identity, and the way we live.', 'free', 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80', 4.2, 49, 2006, 'English', 'Digital', 280, 'trending', 'Available'],
        ['The Kite Runner', 'Khaled Hosseini', 'Drama', 'A moving story of friendship, guilt, and redemption across decades.', 'free', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80', 4.7, 128, 2003, 'English', 'Digital', 371, 'trending', 'Available'],
        ['Dune', 'Frank Herbert', 'Sci-Fi', 'A landmark science fiction novel of ecology, power, and survival.', 'paid', 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=700&q=80', 4.8, 178, 1965, 'English', 'Digital', 688, 'trending', 'Available'],
        ['The Power of Habit', 'Charles Duhigg', 'Productivity', 'How habits work and how they can be changed through simple loops.', 'free', 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=700&q=80', 4.4, 73, 2012, 'English', 'Digital', 371, 'topReading', 'Available'],
        ['Atomic Habits', 'James Clear', 'Productivity', 'Tiny improvements that compound into meaningful change over time.', 'free', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80', 4.8, 214, 2018, 'English', 'Digital', 320, 'topReading', 'Available'],
        ['Deep Work', 'Cal Newport', 'Productivity', 'A guide to focused work in a distracted digital world.', 'free', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80', 4.5, 111, 2016, 'English', 'Digital', 304, 'topReading', 'Available'],
        ['The Silent Patient', 'Alex Michaelides', 'Mystery', 'A psychological thriller centered on silence, secrets, and revelation.', 'paid', 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=700&q=80', 4.2, 87, 2019, 'English', 'Digital', 336, 'topReading', 'Available'],
        ['Educated', 'Tara Westover', 'Memoir', 'A memoir about self-education, resilience, and transformation.', 'free', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=80', 4.6, 96, 2018, 'English', 'Digital', 352, 'topReading', 'Available'],
        ['Sapiens', 'Yuval Noah Harari', 'History', 'A broad history of humanity from ancient hunter-gatherers to the present.', 'paid', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=700&q=80', 4.7, 201, 2011, 'English', 'Digital', 443, 'mostLiked', 'Available'],
        ['Why We Sleep', 'Matthew Walker', 'Health', 'Why sleep matters and how it affects health, learning, and longevity.', 'free', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=700&q=80', 4.5, 74, 2017, 'English', 'Digital', 368, 'mostLiked', 'Available'],
        ['The Lean Startup', 'Eric Ries', 'Business', 'A practical framework for building businesses through experimentation.', 'free', 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=700&q=80', 4.1, 64, 2011, 'English', 'Digital', 336, 'mostLiked', 'Available'],
        ['Hidden Figures', 'Margot Lee Shetterly', 'Biography', "The true story of the women mathematicians behind NASA's success.", 'free', 'https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=700&q=80', 4.4, 81, 2016, 'English', 'Digital', 368, 'mostLiked', 'Available'],
        ['The Psychology of Money', 'Morgan Housel', 'Finance', 'Lessons on money, behavior, and long-term thinking.', 'paid', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80', 4.6, 119, 2020, 'English', 'Digital', 256, 'mostLiked', 'Available'],
        ['The Death and Life of Great American Cities', 'Jane Jacobs', 'Urbanism', 'A landmark critique of urban planning and a defense of lively city streets.', 'paid', 'https://images.unsplash.com/photo-1469122312224-c5846569feb1?auto=format&fit=crop&w=900&q=80', 4.5, 66, 1961, 'English', 'Digital', 458, 'collection', 'Available'],
        ['How Buildings Learn', 'Stewart Brand', 'Architecture', 'How buildings change over time and adapt to the people who use them.', 'free', 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=700&q=80', 4.4, 55, 1994, 'English', 'Digital', 243, 'collection', 'Borrowed'],
        ['The Story of Art', 'E. H. Gombrich', 'History', 'A clear and enduring introduction to the history of visual art.', 'free', 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=700&q=80', 4.3, 78, 1950, 'English', 'Digital', 688, 'collection', 'Available'],
        ['On the Origin of Species', 'Charles Darwin', 'Science', 'The foundational work that transformed how we understand life on Earth.', 'paid', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80', 4.2, 72, 1859, 'English', 'Digital', 502, 'collection', 'Available'],
        ['The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', 'A glittering novel of ambition, longing, and illusion.', 'free', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80', 4.1, 140, 1925, 'English', 'Digital', 180, 'collection', 'Available'],
        ['The Book Thief', 'Markus Zusak', 'Drama', 'A moving story of words, loss, and survival in wartime Germany.', 'free', 'https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&w=900&q=80', 4.6, 154, 2005, 'English', 'Digital', 552, 'collection', 'Available']
    ];

    $query = "
        INSERT INTO books (
            title, author, category, description, access_type, image_url, rating_average,
            rating_count, published_year, language, format, pages, section_name, status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            author = IF(author IS NULL OR author = '', VALUES(author), author),
            category = IF(category IS NULL OR category = '', VALUES(category), category),
            description = IF(description IS NULL OR description = '', VALUES(description), description),
            access_type = IF(access_type IS NULL OR access_type = '', VALUES(access_type), access_type),
            image_url = IF(image_url IS NULL OR image_url = '', VALUES(image_url), image_url)
    ";

    $stmt = $conn->prepare($query);

    foreach ($books as $book) {
        $stmt->bind_param(
            "ssssssdiississ",
            $book[0],
            $book[1],
            $book[2],
            $book[3],
            $book[4],
            $book[5],
            $book[6],
            $book[7],
            $book[8],
            $book[9],
            $book[10],
            $book[11],
            $book[12],
            $book[13]
        );
        $stmt->execute();
    }
}
?>
