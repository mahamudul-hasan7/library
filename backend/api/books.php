<?php
// backend/api/books.php - Public book catalog

require_once '../config.php';

ensureBookCatalogColumns($conn);

$method = $_SERVER['REQUEST_METHOD'];

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
            image_url = IF(image_url IS NULL OR image_url = '', VALUES(image_url), image_url),
            rating_average = IF(rating_average IS NULL OR rating_average = 0, VALUES(rating_average), rating_average),
            rating_count = IF(rating_count IS NULL OR rating_count = 0, VALUES(rating_count), rating_count),
            published_year = IF(published_year IS NULL, VALUES(published_year), published_year),
            language = IF(language IS NULL OR language = '', VALUES(language), language),
            format = IF(format IS NULL OR format = '', VALUES(format), format),
            pages = IF(pages IS NULL OR pages = 0, VALUES(pages), pages),
            section_name = IF(section_name IS NULL OR section_name = '', VALUES(section_name), section_name),
            status = IF(status IS NULL OR status = '', VALUES(status), status)
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

if ($method !== 'GET') {
    sendJson(['success' => false, 'error' => 'Method not allowed'], 405);
}

seedBookCatalog($conn);

$query = "
    SELECT
        id,
        title,
        author,
        category,
        description,
        access_type,
        access_type AS access,
        image_url,
        image_url AS image,
        rating_average,
        rating_count,
        published_year,
        language,
        format,
        pages,
        file_url,
        sample_url,
        section_name,
        status
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

sendJson([
    'success' => true,
    'data' => $books
]);
?>
