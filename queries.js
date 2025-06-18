// queries.js - Script to insert 10 books into MongoDB and perform basic queries

// Import MongoDB client and chalk for colorful console output
const { MongoClient } = require('mongodb');
const chalk = require('chalk');

// Connection URI
const uri = 'mongodb://localhost:27017';

// Database and collection names
const dbName = 'plp_bookstore';
const collectionName = 'books';

// 10 new books with tech-finesse and classic mix
const newBooks = [
  {
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    published_year: 1965,
    price: 15.99,
    in_stock: true,
    pages: 412,
    publisher: 'Chilton Books'
  },
  {
    title: 'Foundation',
    author: 'Isaac Asimov',
    genre: 'Science Fiction',
    published_year: 1951,
    price: 11.49,
    in_stock: true,
    pages: 255,
    publisher: 'Gnome Press'
  },
  {
    title: 'Do Androids Dream of Electric Sheep?',
    author: 'Philip K. Dick',
    genre: 'Science Fiction',
    published_year: 1968,
    price: 12.99,
    in_stock: true,
    pages: 210,
    publisher: 'Doubleday'
  },
  {
    title: 'Frankenstein',
    author: 'Mary Shelley',
    genre: 'Gothic Fiction',
    published_year: 1818,
    price: 8.99,
    in_stock: true,
    pages: 280,
    publisher: 'Lackington, Hughes, Harding, Mavor & Jones'
  },
  {
    title: 'The Martian',
    author: 'Andy Weir',
    genre: 'Science Fiction',
    published_year: 2011,
    price: 14.99,
    in_stock: false,
    pages: 369,
    publisher: 'Crown Publishing'
  },
  {
    title: 'Ready Player One',
    author: 'Ernest Cline',
    genre: 'Science Fiction',
    published_year: 2011,
    price: 13.50,
    in_stock: true,
    pages: 374,
    publisher: 'Random House'
  },
  {
    title: 'The Time Machine',
    author: 'H.G. Wells',
    genre: 'Science Fiction',
    published_year: 1895,
    price: 7.99,
    title: 'The Time Machine',
    author: 'H.G. Wells',
    genre: 'Science Fiction',
    published_year: 1895,
    price: 7.99,
    in_stock: true,
    pages: 118,
    publisher: 'William Heinemann'
  },
  {
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    genre: 'Dystopian',
    published_year: 1953,
    price: 10.99,
    in_stock: true,
    pages: 249,
    publisher: 'Ballantine Books'
  },
  {
    title: 'The Handmaid\'s Tale',
    author: 'Margaret Atwood',
    genre: 'Dystopian',
    published_year: 1985,
    price: 12.49,
    in_stock: false,
    pages: 311,
    publisher: 'McClelland & Stewart'
  },
  {
    title: 'Hyperion',
    author: 'Dan Simmons',
    genre: 'Science Fiction',
    published_year: 1989,
    price: 16.99,
    in_stock: true,
    pages: 482,
    publisher: 'Doubleday'
  }
];

// Function to insert books and display summary
async function addBooks() {
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log(chalk.green('Connected to MongoDB server'));

    // Get database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Insert the new books
    const result = await collection.insertMany(newBooks);
    console.log(chalk.green(`${result.insertedCount} books were successfully inserted into the database`));

    // Display the inserted books
    console.log(chalk.cyan('\nNewly Inserted Books:'));
    const insertedBooks = await collection.find({ _id: { $in: Object.values(result.insertedIds) } }).toArray();
    insertedBooks.forEach((book, index) => {
      console.log(chalk.cyan(`${index + 1}. "${book.title}" by ${book.author} (${book.published_year})`));
    });

    // Display total books and genre summary
    const totalCount = await collection.countDocuments();
    console.log(chalk.magenta(`\nTotal books in collection: ${totalCount}`));
    console.log(chalk.magenta('Genre Summary:'));
    const genres = await collection.aggregate([
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();
    genres.forEach(genre => {
      console.log(chalk.magenta(`- ${genre._id}: ${genre.count} book(s)`));
    });

  } catch (err) {
    console.error(chalk.red('Error occurred:'), err);
  } finally {
    // Close the connection
    await client.close();
    console.log(chalk.green('Connection closed'));
  }
}

// Run the function
addBooks().catch(console.error);

/*
 * Example MongoDB CRUD queries to try after running this script:
 *
 * Create: Insert another book
 *   db.books.insertOne({ title: "I, Robot", author: "Isaac Asimov", genre: "Science Fiction", published_year: 1950, price: 9.99, in_stock: true, pages: 253, publisher: "Gnome Press" })
 *
 * Read: Find all books or filter by criteria
 *   db.books.find().pretty()
 *   db.books.find({ genre: "Science Fiction" }).pretty()
 *   db.books.find({ published_year: { $lt: 1900 } }).pretty()
 *
 * Update: Update a book's stock status
 *   db.books.updateOne({ title: "The Martian" }, { $set: { in_stock: true } })
 *
 * Delete: Delete a book
 *   db.books.deleteOne({ title: "Fahrenheit 451" })
 * Task 2: Basic CRUD Operations
 * Find all books in a specific genre
 * db.books.find({ genre: "Science Fiction" }).pretty()
 * Find books published after a certain year
 * db.books.find({ published_year: { $gt: 1900 } }).pretty()
 * Find books by a specific author
 * db.books.find({ author: "Isaac Asimov" }).pretty() 
 * Update the price of a specific book
 * db.books.updateOne({ title: "The Martian" }, { $set: { price: 16.99 } })
 * Delete: Delete a book
 * db.books.deleteOne({ title: "Fahrenheit 451" })
 * Task 3: Advanced Queries
 * find books that are both in stock and published after 2010
 * db.books.find(
  { in_stock: true, published_year: { $gt: 2010 } },
  { title: 1, author: 1, price: 1, _id: 0 }
).pretty()

Use projection to return only the title, author, and price fields in your queries
db.books.find(
  { in_stock: true, published_year: { $gt: 2010 } },
  { title: 1, author: 1, price: 1, _id: 0 }
).pretty()

// Sort by price ascending (cheapest first)
db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
).sort({ price: 1 }).pretty()

// Sort by price descending (most expensive first)
db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
).sort({ price: -1 }).pretty()

Use the limit and skip methods to implement pagination (5 books per page)
* Display page 1 (books 1–5)
* db.books.find(
    {},
    { title: 1, author: 1, price: 1, _id: 0 }
  ).sort({ title: 1 }).skip(0).limit(5).pretty()

* Display page 2 (books 6–10)
* db.books.find(
    {},
    { title: 1, author: 1, price: 1, _id: 0 }
  ).sort({ title: 1 }).skip(5).limit(5).pretty()

* Display page 3 (books 11–15)
* db.books.find(
    {},
    { title: 1, author: 1, price: 1, _id: 0 }
  ).sort({ title: 1 }).skip(10).limit(5).pretty()

Task 4: Aggregation Pipeline
1. Average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", averagePrice: { $avg: "$price" } } },
  { $sort: { averagePrice: -1 } }
]).pretty()

2. Author with the most books
db.books.aggregate([
  { $group: { _id: "$author", bookCount: { $sum: 1 } } },
  { $sort: { bookCount: -1 } },
  { $limit: 1 }
]).pretty()

3. Group books by publication decade
db.books.aggregate([
  { $addFields: { decade: { $floor: { $divide: ["$published_year", 10] } } } },
  { $group: { _id: "$decade", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]).pretty()

Task 5: Indexing in mongosh

1. Create index on title field
db.books.createIndex({ title: 1 })

2. Create compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 })

3. Explain query performance with title index
db.books.explain("executionStats").find({ title: "The Martian" })


 */