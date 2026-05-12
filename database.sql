-- Brainroot Library Database Schema

CREATE DATABASE IF NOT EXISTS brainroot_library;
USE brainroot_library;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  institution VARCHAR(255),
  role VARCHAR(100),
  plan_type VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Books catalog
CREATE TABLE books (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) UNIQUE NOT NULL,
  author VARCHAR(255),
  category VARCHAR(100),
  description TEXT,
  access_type VARCHAR(50) DEFAULT 'free',
  image_url VARCHAR(500),
  rating_average DECIMAL(3,2) DEFAULT 0.00,
  rating_count INT DEFAULT 0,
  published_year INT,
  language VARCHAR(80) DEFAULT 'English',
  format VARCHAR(80) DEFAULT 'Digital',
  pages INT,
  file_url VARCHAR(500),
  sample_url VARCHAR(500),
  section_name VARCHAR(80) DEFAULT 'collection',
  status VARCHAR(50) DEFAULT 'Available',
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  featured_section ENUM('trending', 'top_reading', 'most_liked', 'none') DEFAULT 'none',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Collections (books user has in their collection)
CREATE TABLE collections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  progress INT DEFAULT 0,
  importance INT DEFAULT 60,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_book (user_id, book_id)
);

-- User Wishlist
CREATE TABLE wishlist (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_wish (user_id, book_id)
);

-- Borrowed Books (tracking who borrowed what)
CREATE TABLE borrowed_books (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  borrowed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_at TIMESTAMP NULL,
  returned_at TIMESTAMP NULL,
  active_borrow_book_id INT GENERATED ALWAYS AS (CASE WHEN returned_at IS NULL THEN book_id ELSE NULL END) STORED,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE KEY unique_active_borrow_open (user_id, active_borrow_book_id)
);

-- Book views history (for recommendations)
CREATE TABLE book_views (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  view_source VARCHAR(100),
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  INDEX idx_user_date (user_id, viewed_at)
);

-- Create indexes for better performance
CREATE INDEX idx_user_collections ON collections(user_id);
CREATE INDEX idx_book_title ON books(title);
CREATE INDEX idx_user_wishlist ON wishlist(user_id);
CREATE INDEX idx_borrowed_user ON borrowed_books(user_id);
CREATE INDEX idx_borrowed_active ON borrowed_books(returned_at);
CREATE INDEX idx_borrowed_due ON borrowed_books(due_at);

-- Insert sample books
INSERT INTO books (title, author, category, description, access_type, rating_average, rating_count, published_year, language, format, pages, section_name, status) VALUES
('The Kite Runner', 'Khaled Hosseini', 'Drama', 'A powerful story of friendship and redemption', 'free', 4.7, 128, 2003, 'English', 'Digital', 371, 'trending', 'Available'),
('Atomic Habits', 'James Clear', 'Productivity', 'Transform your life through small habits', 'free', 4.8, 214, 2018, 'English', 'Digital', 320, 'topReading', 'Available'),
('Educated', 'Tara Westover', 'Biography', 'A memoir about a young woman who grows up in a survivalist family', 'free', 4.6, 96, 2018, 'English', 'Digital', 352, 'topReading', 'Available'),
('Dune', 'Frank Herbert', 'Sci-Fi', 'Epic sci-fi novel about politics and power', 'paid', 4.8, 178, 1965, 'English', 'Digital', 688, 'trending', 'Available'),
('The Silent Patient', 'Alex Michaelides', 'Mystery', 'A psychological thriller about a woman who refuses to speak', 'paid', 4.2, 87, 2019, 'English', 'Digital', 336, 'topReading', 'Available'),
('Why We Sleep', 'Matthew Walker', 'Health', 'Understanding the power of sleep and dreams', 'free', 4.5, 74, 2017, 'English', 'Digital', 368, 'mostLiked', 'Available'),
('The Digital Archive', 'Digital Curators', 'Technology', 'A comprehensive guide to digital preservation', 'free', 4.1, 42, 2021, 'English', 'Digital', 286, 'collection', 'Available'),
('Urban Rhythms', 'Kenzo Tange', 'Urbanism', 'How cities function and evolve', 'paid', 4.3, 52, 2020, 'English', 'Digital', 304, 'collection', 'Available'),
('Minimalist Logic', 'Ludwig Mies', 'Design', 'Living with less while gaining more clarity and structure', 'paid', 4.0, 38, 2019, 'English', 'Digital', 248, 'collection', 'Available'),
('Green Horizons', 'Landscape Institute', 'Environment', 'A design-led introduction to sustainable landscapes', 'free', 4.4, 61, 2022, 'English', 'Digital', 276, 'collection', 'Available');

UPDATE books
SET image_url = CASE title
  WHEN 'The Kite Runner' THEN 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80'
  WHEN 'Atomic Habits' THEN 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80'
  WHEN 'Educated' THEN 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=80'
  WHEN 'Dune' THEN 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=700&q=80'
  WHEN 'The Silent Patient' THEN 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=700&q=80'
  WHEN 'Why We Sleep' THEN 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=700&q=80'
  WHEN 'The Digital Archive' THEN 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80'
  WHEN 'Urban Rhythms' THEN 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80'
  WHEN 'Minimalist Logic' THEN 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80'
  WHEN 'Green Horizons' THEN 'https://images.unsplash.com/photo-1469122312224-c5846569feb1?auto=format&fit=crop&w=900&q=80'
  ELSE image_url
END
WHERE image_url IS NULL OR image_url = '';

-- Insert test user (password: Test@123)
INSERT INTO users (email, password, name, plan_type) VALUES
('test@example.com', '$2y$10$XxV8gP3pZ0K9qL2mN3bQ.u0L0K9qL2mN3bQ0K9qL2mN3bQ0K9qL', 'Test User', 'free');

-- Insert sample collection for test user
INSERT INTO collections (user_id, book_id, progress, importance) VALUES
(1, 1, 45, 80),
(1, 3, 20, 70);

-- Insert sample borrow history for test user
INSERT INTO borrowed_books (user_id, book_id, borrowed_at, due_at, returned_at) VALUES
(1, 1, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_ADD(NOW(), INTERVAL 4 DAY), NULL),
(1, 2, DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(1, 3, DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 16 DAY), NULL);
