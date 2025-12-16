export interface MathProblem {
  question: string;
  answer: number;
  options: number[];
  isWordProblem?: boolean;
  story?: string;
  hint?: string;
}

// Generate a random math problem based on level
export const generateMathProblem = (level: number): MathProblem => {
  // Word problems for levels 101-150
  if (level > 100) {
    return generateWordProblem(level);
  }

  const difficulty = Math.ceil(level / 20); // 1-5 difficulty tiers
  
  let num1: number, num2: number, answer: number;
  
  // Determine operation based on level
  const operations = level <= 25 ? ['+'] : 
                     level <= 50 ? ['+', '-'] : 
                     level <= 75 ? ['+', '-', '×'] : 
                     ['+', '-', '×', '÷'];
  
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  // Generate numbers based on difficulty
  const maxNum = difficulty * 10 + 5;
  
  switch (operation) {
    case '+':
      num1 = Math.floor(Math.random() * maxNum) + 1;
      num2 = Math.floor(Math.random() * maxNum) + 1;
      answer = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * maxNum) + 10;
      num2 = Math.floor(Math.random() * Math.min(num1, maxNum)) + 1;
      answer = num1 - num2;
      break;
    case '×':
      num1 = Math.floor(Math.random() * (difficulty * 3)) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 * num2;
      break;
    case '÷':
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = Math.floor(Math.random() * 10) + 1;
      num1 = num2 * answer;
      break;
    default:
      num1 = 1;
      num2 = 1;
      answer = 2;
  }
  
  // Generate wrong options
  const options = [answer];
  while (options.length < 4) {
    const wrongAnswer = answer + (Math.floor(Math.random() * 10) - 5);
    if (wrongAnswer !== answer && wrongAnswer > 0 && !options.includes(wrongAnswer)) {
      options.push(wrongAnswer);
    }
  }
  
  // Shuffle options
  options.sort(() => Math.random() - 0.5);
  
  return {
    question: `${num1} ${operation} ${num2} = ?`,
    answer,
    options,
    isWordProblem: false,
  };
};

// Word problem categories
type ProblemCategory = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'geometry' | 'money' | 'time';

const generateWordProblem = (level: number): MathProblem => {
  const categories: ProblemCategory[] = ['addition', 'subtraction', 'multiplication', 'division', 'geometry', 'money', 'time'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  // Difficulty increases with level
  const difficulty = Math.ceil((level - 100) / 10); // 1-5 for levels 101-150
  
  let story: string, question: string, answer: number, hint: string;
  
  switch (category) {
    case 'addition': {
      const templates = getAdditionTemplates(difficulty);
      const template = templates[Math.floor(Math.random() * templates.length)];
      story = template.story;
      question = template.question;
      answer = template.answer;
      hint = template.hint;
      break;
    }
    case 'subtraction': {
      const templates = getSubtractionTemplates(difficulty);
      const template = templates[Math.floor(Math.random() * templates.length)];
      story = template.story;
      question = template.question;
      answer = template.answer;
      hint = template.hint;
      break;
    }
    case 'multiplication': {
      const templates = getMultiplicationTemplates(difficulty);
      const template = templates[Math.floor(Math.random() * templates.length)];
      story = template.story;
      question = template.question;
      answer = template.answer;
      hint = template.hint;
      break;
    }
    case 'division': {
      const templates = getDivisionTemplates(difficulty);
      const template = templates[Math.floor(Math.random() * templates.length)];
      story = template.story;
      question = template.question;
      answer = template.answer;
      hint = template.hint;
      break;
    }
    case 'geometry': {
      const templates = getGeometryTemplates(difficulty);
      const template = templates[Math.floor(Math.random() * templates.length)];
      story = template.story;
      question = template.question;
      answer = template.answer;
      hint = template.hint;
      break;
    }
    case 'money': {
      const templates = getMoneyTemplates(difficulty);
      const template = templates[Math.floor(Math.random() * templates.length)];
      story = template.story;
      question = template.question;
      answer = template.answer;
      hint = template.hint;
      break;
    }
    case 'time': {
      const templates = getTimeTemplates(difficulty);
      const template = templates[Math.floor(Math.random() * templates.length)];
      story = template.story;
      question = template.question;
      answer = template.answer;
      hint = template.hint;
      break;
    }
    default: {
      const templates = getAdditionTemplates(difficulty);
      const template = templates[0];
      story = template.story;
      question = template.question;
      answer = template.answer;
      hint = template.hint;
    }
  }
  
  return {
    question,
    answer,
    options: [],
    isWordProblem: true,
    story,
    hint,
  };
};

interface WordProblemTemplate {
  story: string;
  question: string;
  answer: number;
  hint: string;
}

const getAdditionTemplates = (difficulty: number): WordProblemTemplate[] => {
  const names = ['Ravi', 'Priya', 'Amit', 'Sara', 'Meena', 'Raj', 'Anita', 'Vikram'];
  const name = names[Math.floor(Math.random() * names.length)];
  
  const baseNum = difficulty * 5;
  const num1 = Math.floor(Math.random() * baseNum) + 5;
  const num2 = Math.floor(Math.random() * baseNum) + 3;
  
  return [
    {
      story: `${name} had ${num1} apples. ${name === 'Priya' || name === 'Sara' || name === 'Meena' || name === 'Anita' ? 'She' : 'He'} bought ${num2} more apples from the market.`,
      question: `How many apples does ${name} have now?`,
      answer: num1 + num2,
      hint: 'Add the apples together to find the total!',
    },
    {
      story: `There are ${num1} red birds and ${num2} blue birds sitting on a tree.`,
      question: 'How many birds are there in total?',
      answer: num1 + num2,
      hint: 'Count all the birds by adding them!',
    },
    {
      story: `${name} collected ${num1} shells on Monday and ${num2} shells on Tuesday at the beach.`,
      question: `How many shells did ${name} collect in total?`,
      answer: num1 + num2,
      hint: 'Combine both days to get the total!',
    },
    {
      story: `A bakery made ${num1} cupcakes in the morning and ${num2} cupcakes in the afternoon.`,
      question: 'How many cupcakes were made in total?',
      answer: num1 + num2,
      hint: 'Add morning and afternoon cupcakes!',
    },
  ];
};

const getSubtractionTemplates = (difficulty: number): WordProblemTemplate[] => {
  const names = ['Ravi', 'Priya', 'Amit', 'Sara', 'Meena', 'Raj'];
  const name = names[Math.floor(Math.random() * names.length)];
  
  const baseNum = difficulty * 8;
  const num1 = Math.floor(Math.random() * baseNum) + 15;
  const num2 = Math.floor(Math.random() * Math.min(num1 - 1, baseNum / 2)) + 1;
  
  return [
    {
      story: `A bottle contains ${num1} liters of water. ${name} drinks ${num2} liters.`,
      question: 'How much water is left in the bottle?',
      answer: num1 - num2,
      hint: 'Subtract what was drunk from the total!',
    },
    {
      story: `${name} had ${num1} candies and gave ${num2} candies to friends.`,
      question: `How many candies does ${name} have left?`,
      answer: num1 - num2,
      hint: 'Take away the candies given to find what remains!',
    },
    {
      story: `There were ${num1} butterflies in a garden. ${num2} of them flew away.`,
      question: 'How many butterflies are still in the garden?',
      answer: num1 - num2,
      hint: 'Subtract the ones that flew away!',
    },
    {
      story: `A bus had ${num1} passengers. At the first stop, ${num2} passengers got off.`,
      question: 'How many passengers are still on the bus?',
      answer: num1 - num2,
      hint: 'Subtract those who left from the total!',
    },
  ];
};

const getMultiplicationTemplates = (difficulty: number): WordProblemTemplate[] => {
  const names = ['Ravi', 'Priya', 'Amit', 'Sara'];
  const name = names[Math.floor(Math.random() * names.length)];
  
  const num1 = Math.floor(Math.random() * (difficulty + 3)) + 2;
  const num2 = Math.floor(Math.random() * (difficulty + 4)) + 2;
  
  return [
    {
      story: `${name} has ${num1} boxes. Each box contains ${num2} chocolates.`,
      question: `How many chocolates does ${name} have in total?`,
      answer: num1 * num2,
      hint: 'Multiply the number of boxes by chocolates per box!',
    },
    {
      story: `There are ${num1} rows of chairs in a classroom. Each row has ${num2} chairs.`,
      question: 'How many chairs are there in total?',
      answer: num1 * num2,
      hint: 'Multiply rows by chairs in each row!',
    },
    {
      story: `A farmer plants ${num1} rows of trees. Each row has ${num2} trees.`,
      question: 'How many trees did the farmer plant?',
      answer: num1 * num2,
      hint: 'Multiply to find the total trees!',
    },
    {
      story: `${name} reads ${num2} pages every day for ${num1} days.`,
      question: `How many pages did ${name} read in total?`,
      answer: num1 * num2,
      hint: 'Multiply pages per day by number of days!',
    },
  ];
};

const getDivisionTemplates = (difficulty: number): WordProblemTemplate[] => {
  const names = ['Ravi', 'Priya', 'Amit', 'Sara'];
  const name = names[Math.floor(Math.random() * names.length)];
  
  const divisor = Math.floor(Math.random() * (difficulty + 3)) + 2;
  const quotient = Math.floor(Math.random() * (difficulty + 4)) + 2;
  const dividend = divisor * quotient;
  
  return [
    {
      story: `${name} has ${dividend} candies to share equally among ${divisor} friends.`,
      question: 'How many candies will each friend get?',
      answer: quotient,
      hint: 'Divide the total candies by the number of friends!',
    },
    {
      story: `A teacher has ${dividend} pencils to distribute equally among ${divisor} students.`,
      question: 'How many pencils will each student get?',
      answer: quotient,
      hint: 'Divide pencils by number of students!',
    },
    {
      story: `There are ${dividend} cookies to be packed equally into ${divisor} boxes.`,
      question: 'How many cookies will be in each box?',
      answer: quotient,
      hint: 'Divide total cookies by number of boxes!',
    },
    {
      story: `${name} walked ${dividend} kilometers in ${divisor} hours at a steady pace.`,
      question: `How many kilometers did ${name} walk each hour?`,
      answer: quotient,
      hint: 'Divide distance by time!',
    },
  ];
};

const getGeometryTemplates = (difficulty: number): WordProblemTemplate[] => {
  const length = Math.floor(Math.random() * (difficulty * 3)) + 5;
  const width = Math.floor(Math.random() * (difficulty * 2)) + 3;
  const side = Math.floor(Math.random() * (difficulty * 2)) + 4;
  
  return [
    {
      story: `A rectangle has a length of ${length} cm and a width of ${width} cm.`,
      question: 'What is its perimeter?',
      answer: 2 * (length + width),
      hint: 'Perimeter = 2 × (length + width)',
    },
    {
      story: `A square garden has each side measuring ${side} meters.`,
      question: 'What is the perimeter of the garden?',
      answer: 4 * side,
      hint: 'Perimeter of a square = 4 × side',
    },
    {
      story: `A rectangle has a length of ${length} cm and a width of ${width} cm.`,
      question: 'What is its area?',
      answer: length * width,
      hint: 'Area = length × width',
    },
    {
      story: `A square has each side measuring ${side} cm.`,
      question: 'What is the area of the square?',
      answer: side * side,
      hint: 'Area of a square = side × side',
    },
  ];
};

const getMoneyTemplates = (difficulty: number): WordProblemTemplate[] => {
  const names = ['Ravi', 'Priya', 'Amit', 'Sara'];
  const name = names[Math.floor(Math.random() * names.length)];
  
  const price1 = (Math.floor(Math.random() * difficulty * 5) + 5);
  const price2 = (Math.floor(Math.random() * difficulty * 3) + 3);
  const totalMoney = price1 + price2 + Math.floor(Math.random() * 10) + 5;
  
  return [
    {
      story: `${name} has ₹${totalMoney}. ${name === 'Priya' || name === 'Sara' ? 'She' : 'He'} buys a book for ₹${price1}.`,
      question: `How much money does ${name} have left?`,
      answer: totalMoney - price1,
      hint: 'Subtract the cost of the book from total money!',
    },
    {
      story: `A toy costs ₹${price1} and a ball costs ₹${price2}.`,
      question: 'How much do both items cost together?',
      answer: price1 + price2,
      hint: 'Add the prices together!',
    },
    {
      story: `${name} saved ₹${price1} each week for ${Math.floor(difficulty) + 2} weeks.`,
      question: `How much money did ${name} save in total?`,
      answer: price1 * (Math.floor(difficulty) + 2),
      hint: 'Multiply weekly savings by number of weeks!',
    },
    {
      story: `${name} has ₹${totalMoney} to buy ${difficulty + 2} notebooks of equal price.`,
      question: 'If each notebook costs ₹' + Math.floor(totalMoney / (difficulty + 2)) + ', how much money will be left?',
      answer: totalMoney - (Math.floor(totalMoney / (difficulty + 2)) * (difficulty + 2)),
      hint: 'Subtract total cost of notebooks from the money!',
    },
  ];
};

const getTimeTemplates = (difficulty: number): WordProblemTemplate[] => {
  const names = ['Ravi', 'Priya', 'Amit', 'Sara'];
  const name = names[Math.floor(Math.random() * names.length)];
  
  const hours1 = Math.floor(Math.random() * 3) + 1;
  const minutes1 = (Math.floor(Math.random() * 4) + 1) * 15;
  const hours2 = Math.floor(Math.random() * 2) + 1;
  const minutes2 = (Math.floor(Math.random() * 3) + 1) * 10;
  
  return [
    {
      story: `${name} studies for ${hours1} hours and ${minutes1} minutes, then plays for ${hours2} hours.`,
      question: `How many total minutes did ${name} spend on both activities?`,
      answer: (hours1 * 60 + minutes1) + (hours2 * 60),
      hint: 'Convert hours to minutes and add everything!',
    },
    {
      story: `A movie is ${hours1 + 1} hours and ${minutes1} minutes long.`,
      question: 'How many minutes long is the movie?',
      answer: (hours1 + 1) * 60 + minutes1,
      hint: 'Convert hours to minutes (1 hour = 60 minutes) and add!',
    },
    {
      story: `${name} starts homework at 4:00 PM and finishes at ${4 + hours1}:${minutes1 < 10 ? '0' + minutes1 : minutes1} PM.`,
      question: `How many minutes did ${name} spend on homework?`,
      answer: hours1 * 60 + minutes1,
      hint: 'Calculate the time difference in minutes!',
    },
    {
      story: `A train journey takes ${hours1 + hours2} hours.`,
      question: 'How many minutes does the journey take?',
      answer: (hours1 + hours2) * 60,
      hint: 'Multiply hours by 60 to get minutes!',
    },
  ];
};

// Get level theme/island name
export const getLevelTheme = (level: number): string => {
  if (level > 100) {
    const wordThemes = [
      'Story Island',
      'Word Puzzle Bay',
      'Riddle Reef',
      'Problem Paradise',
      'Adventure Atoll',
    ];
    return wordThemes[(level - 101) % wordThemes.length];
  }

  const themes = [
    'Coconut Cove',
    'Banana Bay',
    'Mango Mountain',
    'Pineapple Peak',
    'Starfruit Shore',
    'Papaya Paradise',
    'Kiwi Kingdom',
    'Dragonfruit Den',
    'Passion Point',
    'Guava Gulf',
  ];
  
  return themes[(level - 1) % themes.length];
};

// Get a fun message for correct answers
export const getSuccessMessage = (): string => {
  const messages = [
    '🎉 Amazing!',
    '⭐ Brilliant!',
    '🌟 Fantastic!',
    '🏆 Champion!',
    '💎 Perfect!',
    '🚀 Awesome!',
    '🎯 Bull\'s eye!',
    '✨ Magical!',
    '🌈 Wonderful!',
    '🎊 Super Star!',
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

// Get a fun message for wrong answers
export const getEncouragementMessage = (): string => {
  const messages = [
    '💪 Try again!',
    '🤔 Almost there!',
    '🔄 One more try!',
    '💫 Keep going!',
    '🌱 You can do it!',
    '🎯 Focus and try!',
    '⚡ Don\'t give up!',
    '🌟 Believe in yourself!',
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

// Check if level is a word problem level
export const isWordProblemLevel = (level: number): boolean => {
  return level > 100 && level <= 150;
};
