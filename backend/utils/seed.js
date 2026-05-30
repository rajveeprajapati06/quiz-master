import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
import Attempt from '../models/Attempt.js';
import connectDB from '../config/db.js';

dotenv.config();

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quizmaster';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Quiz.deleteMany();
    await Attempt.deleteMany();

    console.log('Existing data cleared.');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@quizmaster.com',
      password: 'admin123',
      role: 'admin',
    });

    const standardUser = await User.create({
      name: 'John Doe',
      email: 'user@quizmaster.com',
      password: 'user123',
      role: 'user',
    });

    console.log('Users seeded.');

    // 2. Create Quizzes
    const quizzes = [
      {
        title: 'JavaScript Essentials',
        description: 'Test your knowledge on modern JavaScript concepts, variables, scopes, and array helper methods.',
        category: 'Technology',
        difficulty: 'Easy',
        creator: adminUser._id,
        attemptsCount: 2,
        questions: [
          {
            questionText: 'Which of the following is NOT a JavaScript data type?',
            options: ['String', 'Boolean', 'Float', 'Undefined'],
            correctAnswer: 2, // Float
          },
          {
            questionText: 'What is the correct way to write a comment in JavaScript?',
            options: ['<!-- Comment -->', '// Comment', '/* Comment */', '# Comment'],
            correctAnswer: 1, // // Comment
          },
          {
            questionText: 'Which method adds one or more elements to the end of an array and returns the new length?',
            options: ['push()', 'pop()', 'shift()', 'unshift()'],
            correctAnswer: 0, // push()
          },
          {
            questionText: 'What does the triple equals sign "===" check for in JavaScript comparisons?',
            options: ['Value equality only', 'Reference check only', 'Value and type equality', 'Assignment operation'],
            correctAnswer: 2, // Value and type equality
          }
        ]
      },
      {
        title: 'Science and Astronomy Quiz',
        description: 'Challenge yourself with fascinating questions about our solar system, physics, and natural science.',
        category: 'Science',
        difficulty: 'Medium',
        creator: adminUser._id,
        attemptsCount: 1,
        questions: [
          {
            questionText: 'Which planet is known as the Red Planet?',
            options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
            correctAnswer: 1, // Mars
          },
          {
            questionText: 'What is the approximate speed of light?',
            options: ['300,000 km/s', '150,000 km/s', '1,000,000 km/s', '50,000 km/s'],
            correctAnswer: 0, // 300,000 km/s
          },
          {
            questionText: 'What gas makes up the majority of Earth\'s atmosphere?',
            options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
            correctAnswer: 2, // Nitrogen
          },
          {
            questionText: 'Which of the following particles has a positive charge?',
            options: ['Electron', 'Neutron', 'Proton', 'Positron'],
            correctAnswer: 2, // Proton
          }
        ]
      },
      {
        title: 'World War II History',
        description: 'An advanced trivia challenge covering significant events, dates, and strategies from World War II.',
        category: 'History',
        difficulty: 'Hard',
        creator: standardUser._id,
        attemptsCount: 0,
        questions: [
          {
            questionText: 'In which year did World War II end?',
            options: ['1939', '1941', '1945', '1950'],
            correctAnswer: 2, // 1945
          },
          {
            questionText: 'Who was the Prime Minister of Great Britain during the majority of WWII?',
            options: ['Neville Chamberlain', 'Winston Churchill', 'Clement Attlee', 'Franklin D. Roosevelt'],
            correctAnswer: 1, // Winston Churchill
          },
          {
            questionText: 'What was the code name for the Allied invasion of Normandy on June 6, 1944?',
            options: ['Operation Barbarossa', 'Operation Torch', 'Operation Overlord', 'Operation Sea Lion'],
            correctAnswer: 2, // Operation Overlord
          },
          {
            questionText: 'Which treaty ended World War I but is widely cited as an underlying cause of World War II?',
            options: ['Treaty of Versailles', 'Treaty of Paris', 'Treaty of Berlin', 'Treaty of Geneva'],
            correctAnswer: 0, // Treaty of Versailles
          }
        ]
      },
      {
        title: 'Global Capitals Trivia',
        description: 'Test your geography skills with this quiz on world capital cities across different continents.',
        category: 'General Knowledge',
        difficulty: 'Easy',
        creator: adminUser._id,
        attemptsCount: 0,
        questions: [
          {
            questionText: 'What is the capital city of Australia?',
            options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
            correctAnswer: 2, // Canberra
          },
          {
            questionText: 'Which city serves as the capital of Canada?',
            options: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'],
            correctAnswer: 3, // Ottawa
          },
          {
            questionText: 'What is the capital of Japan?',
            options: ['Kyoto', 'Osaka', 'Tokyo', 'Hiroshima'],
            correctAnswer: 2, // Tokyo
          },
          {
            questionText: 'Which of the following is the capital of Brazil?',
            options: ['Rio de Janeiro', 'Sao Paulo', 'Brasilia', 'Salvador'],
            correctAnswer: 2, // Brasilia
          }
        ]
      },
      {
        title: 'Algebra and Logic Puzzles',
        description: 'A challenge focusing on equations, number patterns, and problem-solving reasoning.',
        category: 'Mathematics',
        difficulty: 'Medium',
        creator: standardUser._id,
        attemptsCount: 0,
        questions: [
          {
            questionText: 'Solve for x: 3x - 7 = 14.',
            options: ['x = 3', 'x = 7', 'x = 9', 'x = 5'],
            correctAnswer: 1, // x = 7
          },
          {
            questionText: 'What is the next number in the Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, ...?',
            options: ['9', '11', '13', '15'],
            correctAnswer: 2, // 13
          },
          {
            questionText: 'If a triangle has sides of length 3 and 4, and is a right-angled triangle, what is the length of the hypotenuse?',
            options: ['5', '6', '7', '12'],
            correctAnswer: 0, // 5
          },
          {
            questionText: 'What is the value of 2 to the power of 8 (2^8)?',
            options: ['64', '128', '256', '512'],
            correctAnswer: 2, // 256
          }
        ]
      },
      {
        title: 'Classic English Literature',
        description: 'An advanced test checking your knowledge of classic writers, quotes, novels, and dramatic plays.',
        category: 'Literature',
        difficulty: 'Hard',
        creator: adminUser._id,
        attemptsCount: 0,
        questions: [
          {
            questionText: 'Who wrote the tragedy play "Hamlet"?',
            options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
            correctAnswer: 1, // William Shakespeare
          },
          {
            questionText: 'What is the opening line of the famous novel "Moby-Dick"?',
            options: ['Call me Ishmael.', 'It was the best of times.', 'All happy families resemble one another.', 'In the beginning...'],
            correctAnswer: 0, // Call me Ishmael.
          },
          {
            questionText: 'Which author wrote the masterpiece "Pride and Prejudice"?',
            options: ['Charlotte Bronte', 'Emily Bronte', 'Jane Austen', 'Mary Shelley'],
            correctAnswer: 2, // Jane Austen
          },
          {
            questionText: 'In what century was the epic poem "Paradise Lost" by John Milton published?',
            options: ['15th Century', '16th Century', '17th Century', '18th Century'],
            correctAnswer: 2, // 17th Century
          }
        ]
      },
      {
        title: 'HTML & CSS Layouts',
        description: 'Test your understanding of basic tags, elements, CSS Grid, Flexbox, and responsive styles.',
        category: 'Technology',
        difficulty: 'Easy',
        creator: standardUser._id,
        attemptsCount: 0,
        questions: [
          {
            questionText: 'What does HTML stand for?',
            options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyperlink Text Main Line', 'Hyper Transfer Model Link'],
            correctAnswer: 0, // Hyper Text Markup Language
          },
          {
            questionText: 'Which CSS property is used to change the background color of an element?',
            options: ['color', 'background-color', 'bgcolor', 'fill'],
            correctAnswer: 1, // background-color
          },
          {
            questionText: 'In CSS Flexbox, which property aligns items horizontally inside a flex container with a row direction?',
            options: ['align-items', 'justify-content', 'align-content', 'text-align'],
            correctAnswer: 1, // justify-content
          },
          {
            questionText: 'Which HTML tag is used to link an external CSS stylesheet?',
            options: ['<style>', '<script>', '<link>', '<css>'],
            correctAnswer: 2, // <link>
          }
        ]
      }
    ];

    const seededQuizzes = await Quiz.insertMany(quizzes);
    console.log('Quizzes seeded.');

    // 3. Create Sample Attempts
    const attempts = [
      {
        user: standardUser._id,
        quiz: seededQuizzes[0]._id, // JavaScript Essentials
        answers: [2, 1, 0, 0], // Correct, Correct, Correct, Incorrect (Value and type equality) -> Score: 3/4
        score: 3,
        percentage: 75,
        passed: true,
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        user: standardUser._id,
        quiz: seededQuizzes[0]._id, // JavaScript Essentials
        answers: [2, 1, 0, 2], // All correct -> 4/4
        score: 4,
        percentage: 100,
        passed: true,
        submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hrs ago
      },
      {
        user: standardUser._id,
        quiz: seededQuizzes[1]._id, // Science & Astronomy
        answers: [1, 2, 2, 0], // Mars (C), Incorrect, Nitrogen (C), Incorrect -> 2/4
        score: 2,
        percentage: 50,
        passed: false,
        submittedAt: new Date(),
      }
    ];

    await Attempt.insertMany(attempts);
    console.log('Attempts seeded.');

    console.log('Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
