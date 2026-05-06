-- Brainroot Library Database Schema

CREATE DATABASE IF NOT EXISTS brainroot_library;
USE brainroot_library;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
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
  returned_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE KEY unique_active_borrow (user_id, book_id, returned_at)
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
