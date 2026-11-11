export type LearningLanguage = 'en' | 'hi' | 'hinglish';

export interface ProgressiveExample {
  level: 'Very Easy' | 'Realistic' | 'Practical';
  title: string;
  representation: string; // Markdown table or code snippet
  stepByStep: string[];
}

export interface PracticeTask {
  taskDescription: string;
  hint: string;
}

export interface SocraticQuickCheck {
  question: string;
  options: string[];
  correctOptionIndex: number;
  optionExplanations: Record<number, string>; // Detailed explanation for EACH option (why correct/wrong)
}

export interface SyntaxPart {
  part: string;
  explanation: string;
}

export interface GuidedPracticeData {
  scenario: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface UserPracticeData {
  taskDescription: string;
  placeholder: string;
  expectedInput: string[];
  hints: string[];
  successMessage: string;
  errorMessage: string;
}

export interface SpreadsheetVisualData {
  title: string;
  headers: string[];
  rows: Array<Record<string, string | number>>;
  targetCell: string;
  formulaEntered: string;
  evaluatedResult: string;
  explanation: string;
}

export interface SocraticLesson {
  lessonId: string;
  lessonNumber: number;
  title: string;
  whatIsIt: string;
  whyDoWeUseIt: string;
  howDoesItWork: string;
  syntax?: string;
  syntaxParts?: SyntaxPart[];
  mandatoryMicroCheck: SocraticQuickCheck;
  spreadsheetVisual?: SpreadsheetVisualData;
  guidedPractice?: GuidedPracticeData;
  userPractice?: UserPracticeData;
  progressiveExamples: ProgressiveExample[];
  commonMistakes: string[];
  yourTurnPractice: PracticeTask;
  quickCheck: SocraticQuickCheck;
  keyTakeaways: string[];
}

export interface TopicRecapData {
  importantConcepts: string[];
  importantTerms: string[];
  keyRules: string[];
  commonMistakes: string[];
  practicalTakeaway: string;
}

export interface TopicLessonData {
  topicId: string;
  topicTitle: string;
  domainType: string;
  isCodeTopic: boolean;
  estimatedStudyTimeMinutes: number;
  careerTitle: string;
  skillTitle: string;
  levelTitle: string;
  learningObjectives: string[];
  realWorldStory: {
    familiarContext: string;
    whyItMatters: string;
  };
  lessons: SocraticLesson[];
  topicRecap: TopicRecapData;
}

export function isProgrammingDomain(domainType?: string): boolean {
  if (!domainType) return false;
  const d = domainType.toUpperCase();
  return d === 'SQL' || d === 'PYTHON' || d === 'WEB_DEV' || d === 'JAVASCRIPT' || d === 'HTML' || d === 'CSS';
}

type TopicRegistry = Record<string, Record<LearningLanguage, TopicLessonData>>;

export const TOPIC_CONTENT_REGISTRY: TopicRegistry = {
  // ==================== EXCEL BASICS & FORMATTING ====================
  'excel-interface': {
    en: {
      topicId: 'excel-interface',
      topicTitle: 'Excel Basics & Formatting',
      domainType: 'EXCEL',
      isCodeTopic: false,
      estimatedStudyTimeMinutes: 15,
      careerTitle: 'Data Analyst',
      skillTitle: 'Excel Analytics',
      levelTitle: 'LEVEL 1 — EXCEL FUNDAMENTALS',
      learningObjectives: [
        '✓ Understand how Excel organizes data into Columns, Rows, and Cells',
        '✓ Identify cell addresses (e.g. A1, B4) correctly without confusion',
        '✓ Enter, edit, and align text and numbers inside spreadsheet cells',
        '✓ Apply clean number formatting (Currency $, Percent %, Dates)',
        '✓ Format headers with bold fonts, borders, and clear background fill',
      ],
      realWorldStory: {
        familiarContext: 'Imagine you run a local bakery and write down customer orders in a paper notebook. If a customer changes their order or asks for a total bill, you have to erase numbers and recalculate manually. Excel replaces paper notebooks with an automated digital grid.',
        whyItMatters: 'Every business uses Excel to manage sales orders, track expenses, format professional invoices, and present financial reports to managers.',
      },
      lessons: [
        {
          lessonId: 'ex-int-1-en',
          lessonNumber: 1,
          title: 'The Excel Grid & Cell Addresses',
          whatIsIt: 'Excel is a digital grid paper made of vertical Columns (A, B, C) and horizontal Rows (1, 2, 3). The box where a row and column meet is called a Cell (like A1 or B5).',
          whyDoWeUseIt: 'Grid structure organizes data neatly so Excel can read and calculate numbers automatically without manual mistakes.',
          howDoesItWork: 'Every cell has a unique postal address made of its Column letter + Row number. To find cell B4, go to Column B and move down to Row 4.',
          syntax: 'Cell Address = [Column Letter][Row Number]',
          syntaxParts: [
            { part: 'Column Letter (e.g. B)', explanation: 'Vertical line of cells labeled with letters A, B, C...' },
            { part: 'Row Number (e.g. 4)', explanation: 'Horizontal line of cells labeled with numbers 1, 2, 3...' },
          ],
          mandatoryMicroCheck: {
            question: 'What is the correct cell address for a cell located at Column B and Row 4?',
            options: ['4B', 'B4', 'B-4', 'BB4'],
            correctOptionIndex: 1,
            optionExplanations: {
              0: 'Incorrect. 4B puts row number before column letter. Excel addresses always start with column letter first (B4).',
              1: 'Correct! B4 starts with Column letter B followed by Row number 4.',
              2: 'Incorrect. Excel cell addresses do not contain hyphens.',
              3: 'Incorrect. BB refers to a double-letter column, not Column B.',
            },
          },
          spreadsheetVisual: {
            title: 'Interactive Excel Grid — Cell Address Demo',
            headers: ['A (Item)', 'B (Price $)', 'C (Quantity)'],
            rows: [
              { 'A (Item)': 'Chocolate Cake', 'B (Price $)': 25, 'C (Quantity)': 2 },
              { 'A (Item)': 'Vanilla Cupcake', 'B (Price $)': 5, 'C (Quantity)': 10 },
            ],
            targetCell: 'B2',
            formulaEntered: '25',
            evaluatedResult: '$25.00',
            explanation: 'Cell B2 is located in Column B, Row 2. It holds the numeric price value of 25 for Chocolate Cake.',
          },
          guidedPractice: {
            scenario: 'You are reviewing a bakery invoice. Product names are in Column A, and Quantities are in Column C. Row 3 contains Croissants.',
            question: 'Where is the quantity of Croissants stored?',
            options: ['A3', 'C3', '3C', 'B3'],
            correctOptionIndex: 1,
            explanation: 'Correct! Column C stores Quantity and Row 3 stores Croissants, so the cell address is C3.',
          },
          userPractice: {
            taskDescription: 'Type the cell address for the cell at Column B and Row 5.',
            placeholder: 'Type cell address (e.g. A1)',
            expectedInput: ['B5', 'b5'],
            hints: ['Put Column letter B first, then Row number 5.'],
            successMessage: '✅ Spot on! B5 is the exact cell address.',
            errorMessage: '❌ Remember to type the column letter first (B) followed by row number (5) without spaces.',
          },
          progressiveExamples: [
            {
              level: 'Very Easy',
              title: 'Example 1: Single Cell Address',
              representation: '| Cell Address | Content |\n|---|---|\n| A1 | Bakery Name |\n| B1 | Daily Sales ($) |',
              stepByStep: ['Cell A1 holds the title text.', 'Cell B1 holds the heading for sales.'],
            },
            {
              level: 'Realistic',
              title: 'Example 2: Small Bakery Order Grid',
              representation: '| Cell Address | Column A (Item) | Column B (Price $) | Column C (Qty) |\n|---|---|---|---|\n| Row 1 | Item Name | Price ($) | Quantity |\n| Row 2 | Chocolate Cake | 25 | 2 |\n| Row 3 | Vanilla Cupcake | 5 | 10 |',
              stepByStep: [
                'Cell A2 stores "Chocolate Cake".',
                'Cell B2 stores numeric price 25.',
                'Cell C2 stores quantity 2.',
              ],
            },
            {
              level: 'Practical',
              title: 'Example 3: Formatted Monthly Inventory Table',
              representation: '| ID (Col A) | Product (Col B) | Stock (Col C) | Unit Price (Col D) |\n|---|---|---|---|\n| 101 | Bread Loaf | 50 | $2.50 |\n| 102 | Croissant | 30 | $3.00 |',
              stepByStep: [
                'Columns A to D group product attributes.',
                'Rows 2 and 3 store individual product records.',
              ],
            },
          ],
          commonMistakes: [
            'Typing row numbers before column letters (e.g. typing 1A instead of A1).',
            'Typing currency symbols (like $) directly inside numeric cells, which turns numbers into uncalculable text.',
          ],
          yourTurnPractice: {
            taskDescription: 'Identify the cell address located at Column C and Row 4.',
            hint: 'Combine the column letter C first, followed by row number 4.',
          },
          quickCheck: {
            question: 'What is the correct cell address for a cell located in Column B and Row 4?',
            options: ['4B', 'B4', 'B-4', 'BB4'],
            correctOptionIndex: 1,
            optionExplanations: {
              0: 'Incorrect. 4B puts row number before column letter. Excel addresses always start with column letter first (B4).',
              1: 'Correct! B4 starts with Column letter B followed by Row number 4.',
              2: 'Incorrect. Excel cell addresses do not contain hyphens.',
              3: 'Incorrect. BB refers to a double-letter column, not Column B.',
            },
          },
          keyTakeaways: [
            'Columns are vertical (letters A, B, C).',
            'Rows are horizontal (numbers 1, 2, 3).',
            'Cell addresses are Column Letter + Row Number (e.g. B4).',
          ],
        },
      ],
      topicRecap: {
        importantConcepts: [
          'Excel Grid System (Columns A-Z, Rows 1-1000+, Cells A1)',
          'Cell Addressing (Column Letter + Row Number)',
          'Difference between Raw Cell Values and Display Formatting',
          'Table Styling (Borders, Headers, Number Alignments)',
        ],
        importantTerms: [
          'Cell: The basic box where a row and column intersect (e.g. A1).',
          'Ribbon: The top menu bar containing formatting and alignment buttons.',
          'Currency Format ($): Displays numbers as monetary values with decimals.',
          'Percentage Format (%): Multiplies decimal values by 100 for display.',
        ],
        keyRules: [
          'Rule 1: Always type column letter before row number (e.g. B4, not 4B).',
          'Rule 2: Never type raw $ or % symbols inside numeric cells; use Ribbon buttons.',
          'Rule 3: Keep table headers bold with clean borders for professional reports.',
        ],
        commonMistakes: [
          'Typing text symbols in numeric cells which prevents formula calculations.',
          'Confusing column letters and row numbers.',
        ],
        practicalTakeaway: 'Mastering cell addressing and clean formatting ensures your spreadsheets are automated, dynamic, and executive-ready.',
      },
    },
    hi: {
      topicId: 'excel-interface',
      topicTitle: 'Excel Basics & Formatting',
      domainType: 'EXCEL',
      isCodeTopic: false,
      estimatedStudyTimeMinutes: 15,
      careerTitle: 'Data Analyst',
      skillTitle: 'Excel Analytics',
      levelTitle: 'LEVEL 1 — EXCEL FUNDAMENTALS',
      learningObjectives: [
        '✓ समझें कि एक्सेल डेटा को कॉलम, रो और सेल में कैसे व्यवस्थित करता है',
        '✓ बिना किसी भ्रम के सेल एड्रेस (जैसे A1, B4) की पहचान करें',
        '✓ सेल के अंदर टेक्स्ट और नंबर दर्ज और एडिट करें',
      ],
      realWorldStory: {
        familiarContext: 'एक डिजिटल ग्रिड पेपर जो आपके डेटा और हिसाब को ऑटोमैटिक व्यवस्थित करता है।',
        whyItMatters: 'हर व्यवसाय बिलिंग, रिपोर्ट और वित्तीय विश्लेषण के लिए एक्सेल का उपयोग करता है।',
      },
      lessons: [
        {
          lessonId: 'ex-int-1-hi',
          lessonNumber: 1,
          title: 'एक्सेल ग्रिड और सेल एड्रेस',
          whatIsIt: 'एक्सेल एक डिजिटल ग्रिड है जो कॉलम (A, B, C) और रो (1, 2, 3) से मिलकर बना है। जहाँ रो और कॉलम मिलते हैं, उसे सेल (Cell) कहते हैं (जैसे A1 या B5)।',
          whyDoWeUseIt: 'डेटा को साफ़-सुथरा व्यवस्थित करने के लिए ताकि एक्सेल ऑटोमैटिक हिसाब लगा सके।',
          howDoesItWork: 'हर सेल का एक अनोखा एड्रेस होता है: कॉलम का अक्षर + रो का नंबर। सेल B4 खोजने के लिए कॉलम B पर जाएं और रो 4 तक नीचे आएं।',
          syntax: 'सेल एड्रेस = [कॉलम अक्षर][रो नंबर]',
          mandatoryMicroCheck: {
            question: 'कॉलम B और रो 4 पर स्थित सेल का सही एड्रेस क्या है?',
            options: ['4B', 'B4', 'B-4', 'BB4'],
            correctOptionIndex: 1,
            optionExplanations: {
              0: 'गलत। एक्सेल में कॉलम अक्षर हमेशा पहले आता है (B4)।',
              1: 'सही! B4 कॉलम अक्षर B और रो नंबर 4 से बना है।',
              2: 'गलत। एक्सेल सेल एड्रेस में डैश (-) नहीं होता।',
              3: 'गलत। BB अलग कॉलम है।',
            },
          },
          progressiveExamples: [],
          commonMistakes: ['रो नंबर पहले लिखना (जैसे A1 की जगह 1A)।'],
          yourTurnPractice: { taskDescription: 'कॉलम C और रो 4 का सेल एड्रेस बताएं।', hint: 'C और 4 को जोड़ें।' },
          quickCheck: {
            question: 'कॉलम B और रो 4 का सही सेल एड्रेस क्या है?',
            options: ['4B', 'B4', 'B-4', 'BB4'],
            correctOptionIndex: 1,
            optionExplanations: { 1: 'सही!' },
          },
          keyTakeaways: ['सेल एड्रेस = कॉलम अक्षर + रो नंबर।'],
        },
      ],
      topicRecap: {
        importantConcepts: ['सेल एड्रेस की पहचान'],
        importantTerms: ['Cell: कॉलम और रो का मिलन बिंदु'],
        keyRules: ['हमेशा कॉलम अक्षर पहले लिखें।'],
        commonMistakes: ['1A लिखना'],
        practicalTakeaway: 'एक्सेल में सेल एड्रेस सही तरीके से समझना बहुत ज़रूरी है।',
      },
    },
    hinglish: {
      topicId: 'excel-interface',
      topicTitle: 'Excel Basics & Formatting',
      domainType: 'EXCEL',
      isCodeTopic: false,
      estimatedStudyTimeMinutes: 15,
      careerTitle: 'Data Analyst',
      skillTitle: 'Excel Analytics',
      levelTitle: 'LEVEL 1 — EXCEL FUNDAMENTALS',
      learningObjectives: [
        '✓ Samjhein ki Excel data ko Columns, Rows, aur Cells mein kaise arrange karta hai',
        '✓ Cell address (jaise A1, B4) ko bina confusion identify karein',
      ],
      realWorldStory: {
        familiarContext: 'Maan lijiye aap ek bakery chalate hain aur notebook mein order likhte hain. Excel is manual notebook ko digital grid se replace kar deta hai.',
        whyItMatters: 'Har business sales report aur invoices manage karne ke liye Excel use karta hai.',
      },
      lessons: [
        {
          lessonId: 'ex-int-1-hinglish',
          lessonNumber: 1,
          title: 'The Excel Grid & Cell Addresses',
          whatIsIt: 'Excel ek digital grid hai jisme vertical Columns (A, B, C) aur horizontal Rows (1, 2, 3) hote hain. Jahaan row aur column milte hain, us box ko Cell kehte hain (jaise A1 ya B5).',
          whyDoWeUseIt: 'Grid structure data ko neatly organize karta hai taaki Excel automatically calculations kar sake.',
          howDoesItWork: 'Har cell ka unique address hota hai: Column Letter + Row Number. Cell B4 dhoondhne ke liye Column B par jayein aur Row 4 tak neeche aayein.',
          syntax: 'Cell Address = [Column Letter][Row Number]',
          mandatoryMicroCheck: {
            question: 'Column B aur Row 4 par sthit cell ka sahi address kya hai?',
            options: ['4B', 'B4', 'B-4', 'BB4'],
            correctOptionIndex: 1,
            optionExplanations: {
              0: 'Incorrect. Excel address mein HAMESHA Column letter pehle aata hai (B4).',
              1: 'Correct! B4 starts with Column B followed by Row 4.',
              2: 'Incorrect. Excel addresses mein hyphens nahi hote.',
              3: 'Incorrect. BB ek alag double-letter column hai.',
            },
          },
          progressiveExamples: [],
          commonMistakes: ['1A likhna A1 ki jagah.'],
          yourTurnPractice: { taskDescription: 'Column C aur Row 4 ka cell address batayein.', hint: 'C + 4' },
          quickCheck: {
            question: 'Column B aur Row 4 ka correct address kya hai?',
            options: ['4B', 'B4', 'B-4', 'BB4'],
            correctOptionIndex: 1,
            optionExplanations: { 1: 'Correct!' },
          },
          keyTakeaways: ['Cell address = Column Letter + Row Number.'],
        },
      ],
      topicRecap: {
        importantConcepts: ['Cell addressing basics'],
        importantTerms: ['Cell: Row aur Column ka intersection'],
        keyRules: ['Always write Column letter first.'],
        commonMistakes: ['Writing 1A instead of A1.'],
        practicalTakeaway: 'Cell addresses master karne se aage ki formulas bahut easy ho jaati hain.',
      },
    },
  },

  // ==================== EXCEL IF FORMULA ====================
  'excel-if-formula': {
    en: {
      topicId: 'excel-if-formula',
      topicTitle: 'Excel IF Formula & Logic',
      domainType: 'EXCEL',
      isCodeTopic: false,
      estimatedStudyTimeMinutes: 20,
      careerTitle: 'Data Analyst',
      skillTitle: 'Excel Analytics',
      levelTitle: 'LEVEL 1 — EXCEL FUNDAMENTALS',
      learningObjectives: [
        '✓ Understand the core decision-making logic of the IF formula',
        '✓ Master the 3-part syntax: =IF(condition, value_if_true, value_if_false)',
        '✓ Compare values using logical operators (>=, <=, >, <, =)',
        '✓ Apply IF to evaluate student pass/fail, bonus qualifications, and status flags',
        '✓ Avoid common beginner syntax errors like missing quotes or incorrect commas',
      ],
      realWorldStory: {
        familiarContext: 'Imagine you have a list of 500 students and their test marks. You need to write "Pass" for students scoring 40 or above, and "Fail" for those below 40. Checking 500 rows manually would take hours and cause human errors. Excel IF formula makes all 500 decisions automatically in 1 second.',
        whyItMatters: 'Businesses use IF formulas to automatically approve credit limits, calculate sales commission bonuses, flag low inventory stock, and classify customer accounts.',
      },
      lessons: [
        {
          lessonId: 'ex-if-1-en',
          lessonNumber: 1,
          title: 'Understanding IF Logic & Syntax',
          whatIsIt: 'The IF formula allows Excel to test a logical condition and make an automated decision: return one output if the condition is TRUE, and another output if it is FALSE.',
          whyDoWeUseIt: 'Without IF, you would have to inspect every single data row manually. IF automates logic and eliminates human decision mistakes.',
          howDoesItWork: 'You give Excel three things: 1. A condition to test (e.g. Is marks >= 40?), 2. What to show if TRUE (e.g. "Pass"), 3. What to show if FALSE (e.g. "Fail").',
          syntax: '=IF(condition, value_if_true, value_if_false)',
          syntaxParts: [
            { part: 'condition', explanation: 'The test Excel evaluates (e.g. B2 >= 40).' },
            { part: 'value_if_true', explanation: 'The output Excel displays if the condition is TRUE (e.g. "Pass").' },
            { part: 'value_if_false', explanation: 'The output Excel displays if the condition is FALSE (e.g. "Fail").' },
          ],
          mandatoryMicroCheck: {
            question: 'If a student has marks = 50 in cell B2 and the formula is =IF(B2>=40, "Pass", "Fail"), what will Excel display in the cell?',
            options: ['Fail', 'Pass', 'Error', 'Nothing'],
            correctOptionIndex: 1,
            optionExplanations: {
              0: 'Incorrect. Since 50 is greater than or equal to 40, the condition is TRUE, so Excel returns value_if_true ("Pass"), not "Fail".',
              1: 'Correct! 50 >= 40 is TRUE, so Excel evaluates value_if_true and displays "Pass".',
              2: 'Incorrect. The formula syntax is valid and will not throw an error.',
              3: 'Incorrect. Excel will return the matching string output.',
            },
          },
          spreadsheetVisual: {
            title: 'Interactive Spreadsheet Demonstration — IF Formula',
            headers: ['Student (Col A)', 'Marks (Col B)', 'Result (Col C)'],
            rows: [
              { 'Student (Col A)': 'Rahul', 'Marks (Col B)': 75, 'Result (Col C)': 'Pass' },
              { 'Student (Col A)': 'Priya', 'Marks (Col B)': 32, 'Result (Col C)': 'Fail' },
              { 'Student (Col A)': 'Amit', 'Marks (Col B)': 61, 'Result (Col C)': 'Pass' },
            ],
            targetCell: 'C2',
            formulaEntered: '=IF(B2>=40, "Pass", "Fail")',
            evaluatedResult: 'Pass',
            explanation: 'Cell C2 checks cell B2 (75). Since 75 >= 40 is TRUE, cell C2 displays "Pass". When copied down to C3, B3 (32) < 40 is FALSE, so C3 displays "Fail".',
          },
          guidedPractice: {
            scenario: 'Let\'s evaluate together: Suppose student mark in B3 is 28. The formula is =IF(B3>=40, "Pass", "Fail").',
            question: 'What should the result in cell C3 be?',
            options: ['Pass', 'Fail', '#VALUE!', '28'],
            correctOptionIndex: 1,
            explanation: 'Correct! Because 28 is less than 40, condition B3>=40 is FALSE, so Excel displays value_if_false ("Fail").',
          },
          userPractice: {
            taskDescription: 'Write an Excel IF formula for cell C2 to display "Pass" if marks in cell B2 are 40 or above, otherwise "Fail".',
            placeholder: '=IF(B2>=40, "Pass", "Fail")',
            expectedInput: [
              '=IF(B2>=40,"Pass","Fail")',
              '=IF(B2>=40, "Pass", "Fail")',
              '=IF(B2 >= 40, "Pass", "Fail")',
              '=if(b2>=40,"Pass","Fail")',
              '=if(b2>=40, "Pass", "Fail")',
            ],
            hints: [
              'Start with =IF(',
              'Specify condition B2>=40',
              'Separate parts with commas: , "Pass", "Fail")',
            ],
            successMessage: '🎉 Outstanding! You successfully wrote an automated decision-making IF formula!',
            errorMessage: '❌ Check your syntax: make sure to start with =IF(B2>=40, "Pass", "Fail") with quotes around text values.',
          },
          progressiveExamples: [
            {
              level: 'Very Easy',
              title: 'Example 1: Pass/Fail Grading',
              representation: '| Student | Marks (B) | Formula (C) | Output |\n|---|---|---|---|\n| Rahul | 75 | =IF(B2>=40,"Pass","Fail") | Pass |\n| Priya | 32 | =IF(B3>=40,"Pass","Fail") | Fail |',
              stepByStep: ['Condition B2>=40 evaluates to TRUE for 75, so output is "Pass".', 'Condition B3>=40 evaluates to FALSE for 32, so output is "Fail".'],
            },
            {
              level: 'Realistic',
              title: 'Example 2: Sales Commission Bonus',
              representation: '| Sales Rep | Revenue (B) | Formula (C) | Bonus Output |\n|---|---|---|---|\n| John | $15,000 | =IF(B2>=10000, 500, 0) | $500 |\n| Sarah | $8,500 | =IF(B3>=10000, 500, 0) | $0 |',
              stepByStep: ['Numbers do not need quotation marks. If sales >= 10000, bonus is 500, else 0.'],
            },
          ],
          commonMistakes: [
            'Forgetting quotation marks around text outputs (e.g. typing =IF(B2>=40, Pass, Fail) causes #NAME? error).',
            'Forgetting the equals sign (=) at the start of the formula.',
            'Swapping value_if_true and value_if_false positions by mistake.',
          ],
          yourTurnPractice: {
            taskDescription: 'Write the IF formula to give a 500 bonus if Sales in B2 is >= 10000, else 0.',
            hint: '=IF(B2>=10000, 500, 0) — note that numbers do not require quotation marks.',
          },
          quickCheck: {
            question: 'Why do text outputs like "Pass" require double quotes in an IF formula while numbers like 500 do not?',
            options: [
              'Double quotes tell Excel that "Pass" is text; without quotes Excel thinks Pass is an unknown formula or range name',
              'Numbers always require quotes in Excel',
              'Quotes are optional and make no difference',
              'Double quotes convert numbers into text',
            ],
            correctOptionIndex: 0,
            optionExplanations: {
              0: 'Correct! Text strings in formulas MUST be wrapped in double quotes so Excel recognizes them as literal text.',
              1: 'Incorrect. Numbers should NOT be wrapped in quotes if you intend to perform math calculations with them.',
              2: 'Incorrect. Omitting quotes around text causes a #NAME? syntax error.',
              3: 'Incorrect. Quotes wrap literal text strings.',
            },
          },
          keyTakeaways: [
            '=IF(condition, value_if_true, value_if_false) makes automated choices.',
            'Text values like "Pass" MUST be wrapped in double quotes.',
            'Numbers like 500 or 0 do NOT use quotes.',
          ],
        },
      ],
      topicRecap: {
        importantConcepts: [
          'Logical Decision Making in Excel',
          'The 3 Parts of IF Syntax: Condition, Value if True, Value if False',
          'Comparison Operators (>=, <=, >, <, =, <>)',
          'Text Outputs vs Numeric Outputs in Formulas',
        ],
        importantTerms: [
          'Condition: A statement that evaluates to either TRUE or FALSE (e.g. B2>=40).',
          'Value if True: The output returned when condition is TRUE.',
          'Value if False: The output returned when condition is FALSE.',
          '#NAME? Error: Occurs when text strings inside formulas omit double quotes.',
        ],
        keyRules: [
          'Rule 1: Always start formulas with an equals sign (=).',
          'Rule 2: Wrap text outputs in double quotation marks (e.g. "Pass").',
          'Rule 3: Do not wrap numeric outputs in quotes if you need to calculate totals later.',
        ],
        commonMistakes: [
          'Omitting quotes around text strings causing #NAME? error.',
          'Flipping condition logic or putting value_if_false first.',
        ],
        practicalTakeaway: 'The IF formula is the foundation of automated data auditing, sales commission logic, and executive status reporting in Excel.',
      },
    },
    hi: {
      topicId: 'excel-if-formula',
      topicTitle: 'Excel IF Formula & Logic',
      domainType: 'EXCEL',
      isCodeTopic: false,
      estimatedStudyTimeMinutes: 20,
      careerTitle: 'Data Analyst',
      skillTitle: 'Excel Analytics',
      levelTitle: 'LEVEL 1 — EXCEL FUNDAMENTALS',
      learningObjectives: [
        '✓ आईएफ (IF) फॉर्मूला के निर्णय लेने वाले तर्क को समझें',
        '✓ 3-भाग वाले सिंटैक्स में महारत हासिल करें: =IF(condition, value_if_true, value_if_false)',
        '✓ टेक्स्ट वैल्यू को डबल इनवर्टेड कॉमा ("Pass") में लिखना सीखें',
      ],
      realWorldStory: {
        familiarContext: 'कल्पना कीजिए कि आपके पास 500 छात्रों के अंक हैं। आपको 40 से अधिक अंक वालों के आगे "Pass" और कम वालों के आगे "Fail" लिखना है। मैन्युअल करने में घंटे लगेंगे, पर IF फॉर्मूला 1 सेकेंड में सब तय कर देता है।',
        whyItMatters: 'कंपनियां सेल्स कमीशन, क्रेडिट लिमिट और पास/फेल तय करने के लिए IF फॉर्मूला का उपयोग करती हैं।',
      },
      lessons: [
        {
          lessonId: 'ex-if-1-hi',
          lessonNumber: 1,
          title: 'IF फॉर्मूला का लॉजिक और सिंटैक्स',
          whatIsIt: 'IF फॉर्मूला एक्सेल को शर्त के आधार पर ऑटोमैटिक फैसला लेने की सुविधा देता है: अगर शर्त सच (TRUE) है तो एक परिणाम दिखाएं, और अगर झूठ (FALSE) है तो दूसरा।',
          whyDoWeUseIt: 'बिना IF के आपको हर रो को मैन्युअल देखना पड़ेगा। IF गलती रहित ऑटोमेशन प्रदान करता है।',
          howDoesItWork: 'आप एक्सेल को 3 चीज़ें देते हैं: 1. शर्त (क्या अंक >= 40 हैं?), 2. TRUE होने पर क्या दिखाएं ("Pass"), 3. FALSE होने पर क्या दिखाएं ("Fail")।',
          syntax: '=IF(condition, value_if_true, value_if_false)',
          syntaxParts: [
            { part: 'condition', explanation: 'शर्त जिसकी जांच करनी है (जैसे B2 >= 40)।' },
            { part: 'value_if_true', explanation: 'शर्त सच होने पर आउटपुट (जैसे "Pass")।' },
            { part: 'value_if_false', explanation: 'शर्त झूठ होने पर आउटपुट (जैसे "Fail")।' },
          ],
          mandatoryMicroCheck: {
            question: 'यदि सेल B2 में अंक 50 हैं और फॉर्मूला =IF(B2>=40, "Pass", "Fail") है, तो एक्सेल क्या दिखाएगा?',
            options: ['Fail', 'Pass', 'Error', 'Nothing'],
            correctOptionIndex: 1,
            optionExplanations: {
              0: 'गलत। 50 >= 40 सच (TRUE) है, इसलिए "Pass" दिखाई देगा।',
              1: 'सही! 50 >= 40 TRUE है, इसलिए एक्सेल "Pass" दिखाएगा।',
              2: 'गलत। सिंटैक्स सही है।',
              3: 'गलत। आउटपुट दिखाई देगा।',
            },
          },
          spreadsheetVisual: {
            title: 'एक्सेल ग्रिड प्रदर्शन — IF फॉर्मूला',
            headers: ['छात्र (Col A)', 'अंक (Col B)', 'परिणाम (Col C)'],
            rows: [
              { 'छात्र (Col A)': 'राहुल', 'अंक (Col B)': 75, 'परिणाम (Col C)': 'Pass' },
              { 'छात्र (Col A)': 'प्रिया', 'अंक (Col B)': 32, 'परिणाम (Col C)': 'Fail' },
            ],
            targetCell: 'C2',
            formulaEntered: '=IF(B2>=40, "Pass", "Fail")',
            evaluatedResult: 'Pass',
            explanation: 'सेल C2 अंक 75 की जांच करता है। 75 >= 40 सच है, इसलिए C2 में "Pass" दिखता है।',
          },
          guidedPractice: {
            scenario: 'यदि B3 में अंक 28 हैं और फॉर्मूला =IF(B3>=40, "Pass", "Fail") है।',
            question: 'C3 में क्या परिणाम होगा?',
            options: ['Pass', 'Fail', 'Error'],
            correctOptionIndex: 1,
            explanation: 'सही! 28 < 40 है (FALSE), इसलिए "Fail" दिखाई देगा।',
          },
          userPractice: {
            taskDescription: 'सेल C2 के लिए IF फॉर्मूला लिखें जो B2 अंक >= 40 होने पर "Pass" और अन्यथा "Fail" दिखाए।',
            placeholder: '=IF(B2>=40, "Pass", "Fail")',
            expectedInput: ['=IF(B2>=40,"Pass","Fail")', '=IF(B2>=40, "Pass", "Fail")'],
            hints: ['=IF( से शुरू करें और "Pass", "Fail" लिखें।'],
            successMessage: '🎉 शाबाश! आपने IF फॉर्मूला बिल्कुल सही लिखा!',
            errorMessage: '❌ ध्यान दें: =IF(B2>=40, "Pass", "Fail") की तरह लिखें।',
          },
          progressiveExamples: [],
          commonMistakes: ['"Pass" के आसपास डबल इनवर्टेड कॉमा ना लगाना।'],
          yourTurnPractice: { taskDescription: '=IF(B2>=40, "Pass", "Fail") लिखें।', hint: 'डबल कोट्स का ध्यान रखें।' },
          quickCheck: {
            question: 'टेक्स्ट मान जैसे "Pass" को डबल कॉमा में क्यों लिखा जाता है?',
            options: [
              'ताकि एक्सेल समझे कि यह टेक्स्ट है, बिना कॉमा के #NAME? एरर आता है',
              'नंबर को टेक्स्ट बनाने के लिए',
            ],
            correctOptionIndex: 0,
            optionExplanations: { 0: 'सही! टेक्स्ट के लिए डबल कोट्स ज़रूरी हैं।' },
          },
          keyTakeaways: ['=IF(condition, value_if_true, value_if_false)'],
        },
      ],
      topicRecap: {
        importantConcepts: ['IF फॉर्मूला का लॉजिक'],
        importantTerms: ['Condition: शर्त जिसकी जांच होती है'],
        keyRules: ['टेक्स्ट आउटपुट को हमेशा " " में लिखें।'],
        commonMistakes: ['डबल कोट्स भूल जाना'],
        practicalTakeaway: 'IF फॉर्मूला एक्सेल में ऑटोमेशन का आधार है।',
      },
    },
    hinglish: {
      topicId: 'excel-if-formula',
      topicTitle: 'Excel IF Formula & Logic',
      domainType: 'EXCEL',
      isCodeTopic: false,
      estimatedStudyTimeMinutes: 20,
      careerTitle: 'Data Analyst',
      skillTitle: 'Excel Analytics',
      levelTitle: 'LEVEL 1 — EXCEL FUNDAMENTALS',
      learningObjectives: [
        '✓ IF formula ka decision-making logic samjhein',
        '✓ 3-part syntax master karein: =IF(condition, value_if_true, value_if_false)',
        '✓ Text values ko quotes ("Pass") mein likhna seekhein',
      ],
      realWorldStory: {
        familiarContext: 'Maan lijiye aapke paas 500 students ke marks hain. Aapko 40 ya usse jyada par "Pass" aur kam par "Fail" likhna hai. IF formula 500 rows ko 1 second mein decide kar deta hai.',
        whyItMatters: 'Companies sales commission, pass/fail aur discount calculate karne ke liye IF formula use karti hain.',
      },
      lessons: [
        {
          lessonId: 'ex-if-1-hinglish',
          lessonNumber: 1,
          title: 'Understanding IF Logic & Syntax',
          whatIsIt: 'IF formula Excel ko condition ke basis par automated decision lene deta hai: agar condition TRUE hai toh ek output, aur agar FALSE hai toh dusra output.',
          whyDoWeUseIt: 'Bina IF ke aapko har row manually check karni padti. IF se fast aur error-free automation hota hai.',
          howDoesItWork: 'Aap Excel ko 3 cheezein dete hain: 1. Condition (Kya marks >= 40 hain?), 2. TRUE hone par kya dikhayein ("Pass"), 3. FALSE hone par kya dikhayein ("Fail").',
          syntax: '=IF(condition, value_if_true, value_if_false)',
          syntaxParts: [
            { part: 'condition', explanation: 'Jo test Excel check karta hai (jaise B2 >= 40).' },
            { part: 'value_if_true', explanation: 'Condition TRUE hone par dikhne wala output ("Pass").' },
            { part: 'value_if_false', explanation: 'Condition FALSE hone par dikhne wala output ("Fail").' },
          ],
          mandatoryMicroCheck: {
            question: 'Agar B2 mein marks 50 hain aur formula =IF(B2>=40, "Pass", "Fail") hai, toh Excel kya display karega?',
            options: ['Fail', 'Pass', 'Error', 'Nothing'],
            correctOptionIndex: 1,
            optionExplanations: {
              0: 'Incorrect. 50 >= 40 TRUE hai, isliye "Pass" dikhega.',
              1: 'Correct! 50 >= 40 is TRUE, toh Excel value_if_true ("Pass") dikhayega.',
              2: 'Incorrect. Formula syntax valid hai.',
              3: 'Incorrect. Value return hoti hai.',
            },
          },
          spreadsheetVisual: {
            title: 'Interactive Spreadsheet Demo — IF Formula',
            headers: ['Student (Col A)', 'Marks (Col B)', 'Result (Col C)'],
            rows: [
              { 'Student (Col A)': 'Rahul', 'Marks (Col B)': 75, 'Result (Col C)': 'Pass' },
              { 'Student (Col A)': 'Priya', 'Marks (Col B)': 32, 'Result (Col C)': 'Fail' },
            ],
            targetCell: 'C2',
            formulaEntered: '=IF(B2>=40, "Pass", "Fail")',
            evaluatedResult: 'Pass',
            explanation: 'Cell C2 B2 (75) check karta hai. 75 >= 40 TRUE hai, isliye C2 mein "Pass" aata hai.',
          },
          guidedPractice: {
            scenario: 'Maan lijiye B3 mein marks 28 hain. Formula hai =IF(B3>=40, "Pass", "Fail").',
            question: 'Cell C3 mein kya result aayega?',
            options: ['Pass', 'Fail', 'Error'],
            correctOptionIndex: 1,
            explanation: 'Correct! 28 < 40 FALSE hai, toh value_if_false ("Fail") aayega.',
          },
          userPractice: {
            taskDescription: 'Cell C2 ke liye IF formula likhein jo B2 marks >= 40 hone par "Pass" aur varna "Fail" dikhaye.',
            placeholder: '=IF(B2>=40, "Pass", "Fail")',
            expectedInput: ['=IF(B2>=40,"Pass","Fail")', '=IF(B2>=40, "Pass", "Fail")'],
            hints: ['=IF( se start karein aur quotes mein "Pass", "Fail" likhein.'],
            successMessage: '🎉 Superb! Aapne IF formula bilkul sahi likha!',
            errorMessage: '❌ Syntax check karein: =IF(B2>=40, "Pass", "Fail") with double quotes.',
          },
          progressiveExamples: [],
          commonMistakes: ['Double quotes (" ") bhool jana text outputs ke aas paas.'],
          yourTurnPractice: { taskDescription: '=IF(B2>=40, "Pass", "Fail") likhein.', hint: 'Double quotes ka dhyaan rakhein.' },
          quickCheck: {
            question: 'Text values jaise "Pass" ko quotes mein likhna kyun zaroori hai?',
            options: [
              'Taaki Excel samjhe ki yeh text hai, quotes na hone par #NAME? error aata hai',
              'Quotes se number text ban jata hai',
            ],
            correctOptionIndex: 0,
            optionExplanations: { 0: 'Correct! Text outputs hamesha quotes mein hone chahiye.' },
          },
          keyTakeaways: ['=IF(condition, value_if_true, value_if_false)'],
        },
      ],
      topicRecap: {
        importantConcepts: ['IF Formula automation logic'],
        importantTerms: ['Condition: Test jo TRUE ya FALSE hota hai'],
        keyRules: ['Text outputs ko double quotes (" ") mein wrap karein.'],
        commonMistakes: ['Quotes miss kar dena'],
        practicalTakeaway: 'IF formula Excel analytics ka sabse important building block hai.',
      },
    },
  },
};

export function getTopicLessonContent(
  topicSlug: string,
  language: LearningLanguage = 'en',
  topicTitle: string = 'Topic Content',
  domainType: string = 'EXCEL',
  careerTitle: string = 'Data Analyst',
  skillTitle: string = 'Core Skill',
  levelTitle: string = 'LEVEL 1'
): TopicLessonData {
  if (TOPIC_CONTENT_REGISTRY[topicSlug]) {
    const langMap = TOPIC_CONTENT_REGISTRY[topicSlug];
    const topicData = langMap[language] || langMap['en'];
    return {
      ...topicData,
      careerTitle: careerTitle || topicData.careerTitle,
      skillTitle: skillTitle || topicData.skillTitle,
      levelTitle: levelTitle || topicData.levelTitle,
    };
  }

  // Dynamic Socratic lesson generator for topics not explicitly pre-registered
  const cleanTitle = topicTitle || topicSlug.replace(/-/g, ' ').toUpperCase();
  const isWebDev = domainType === 'WEB_DEV' || topicSlug.includes('html') || topicSlug.includes('css') || topicSlug.includes('js') || topicSlug.includes('react') || topicSlug.includes('node') || topicSlug.includes('git');

  if (isWebDev) {
    return {
      topicId: topicSlug,
      topicTitle: cleanTitle,
      domainType: 'WEB_DEV',
      isCodeTopic: true,
      estimatedStudyTimeMinutes: 20,
      careerTitle: careerTitle || 'Full-Stack Web Developer',
      skillTitle: skillTitle || 'Web Development',
      levelTitle: levelTitle || 'LEVEL 1 — WEB BASICS',
      learningObjectives: [
        `✓ Understand core principles of ${cleanTitle}`,
        `✓ Master correct syntax and structure for ${cleanTitle}`,
        `✓ Apply practical web engineering techniques in hands-on code`,
        `✓ Avoid common beginner anti-patterns and performance mistakes`,
      ],
      realWorldStory: {
        familiarContext: `Every modern web application relies on ${cleanTitle} to structure layouts, handle user interactions, and process backend API logic securely.`,
        whyItMatters: `Mastering ${cleanTitle} is essential for building scalable, high-performance web applications that users interact with daily.`,
      },
      lessons: [
        {
          lessonId: `${topicSlug}-les-1`,
          lessonNumber: 1,
          title: `Core Principles of ${cleanTitle}`,
          whatIsIt: `${cleanTitle} is a foundational web development concept used to construct responsive interfaces and backend logic.`,
          whyDoWeUseIt: `Without ${cleanTitle}, web applications lack proper structure, interactive capabilities, or efficient data flows.`,
          howDoesItWork: `Browser rendering engines and JavaScript runtimes parse ${cleanTitle} sequentially to paint pixels and execute logic.`,
          syntax: `// Standard ${cleanTitle} Syntax Structure`,
          syntaxParts: [
            { part: 'Keyword / Identifier', explanation: 'Defines the structural element or function declaration' },
            { part: 'Parameters / Attributes', explanation: 'Configures properties and inputs passed into the block' },
          ],
          mandatoryMicroCheck: {
            question: `What is the primary purpose of applying ${cleanTitle}?`,
            options: [
              `To structure and manage web application logic cleanly`,
              'To arbitrarily increase file sizes',
              'To disable browser rendering options',
              'To force hardcoded static errors',
            ],
            correctOptionIndex: 0,
            optionExplanations: {
              0: `Correct! ${cleanTitle} provides structured logic for responsive web applications.`,
              1: 'Incorrect.',
              2: 'Incorrect.',
              3: 'Incorrect.',
            },
          },
          userPractice: {
            taskDescription: `Write a basic code block implementing ${cleanTitle}.`,
            placeholder: `// Type your ${cleanTitle} code here`,
            expectedInput: ['const', 'function', '<div', 'import', 'export', 'def', 'let', '= Target'],
            hints: [`Follow standard syntax rules for ${cleanTitle}.`],
            successMessage: `🎉 Excellent! Your ${cleanTitle} code structure is accurate.`,
            errorMessage: `❌ Double-check your syntax for ${cleanTitle}.`,
          },
          progressiveExamples: [
            {
              level: 'Very Easy',
              title: `Basic ${cleanTitle} Example`,
              representation: `// Minimal setup\nconsole.log("Learning ${cleanTitle}");`,
              stepByStep: [`Initializes the foundational ${cleanTitle} block.`, 'Executes cleanly without errors.'],
            },
            {
              level: 'Practical',
              title: `Production ${cleanTitle} Flow`,
              representation: `// Scalable application logic for ${cleanTitle}`,
              stepByStep: ['Passes parameters cleanly.', 'Returns structured output for UI consumption.'],
            },
          ],
          commonMistakes: [
            `Forgetting proper syntax wrappers or closing tags`,
            `Ignoring browser developer tool warning messages`,
          ],
          yourTurnPractice: {
            taskDescription: `Practice writing ${cleanTitle} in the interactive sandbox.`,
            hint: `Check browser console output for syntax feedback.`,
          },
          quickCheck: {
            question: `Why is verifying syntax rules important when working with ${cleanTitle}?`,
            options: [
              'Prevents runtime errors and broken UI rendering',
              'Changes background desktop wallpaper',
            ],
            correctOptionIndex: 0,
            optionExplanations: { 0: 'Correct! Proper syntax prevents script execution failures.' },
          },
          keyTakeaways: [`Mastering ${cleanTitle} guarantees clean, maintainable web codebase architecture.`],
        },
      ],
      topicRecap: {
        importantConcepts: [`Core architecture of ${cleanTitle}`],
        importantTerms: [`Syntax: Rules governing ${cleanTitle} code execution`],
        keyRules: ['Always test code in developer tools before shipping to production.'],
        commonMistakes: ['Syntax typos and missing scope delimiters'],
        practicalTakeaway: `${cleanTitle} is a core building block for full-stack engineering.`,
      },
    };
  }

  // Dynamic Socratic Lesson Generator for SQL Topics
  const isSql = domainType === 'SQL' || topicSlug.startsWith('sql-');
  if (isSql) {
    let customSyntax = `SELECT column_1, column_2 FROM table_name WHERE condition;`;
    let customWhat = `SQL is the standard language used by Data Analysts to query, manipulate, and analyze relational database tables.`;
    let customWhy = `Databases store company transactions across millions of rows. SQL lets you filter, join, and summarize data instantly.`;
    let customMicroQ = `What is the primary SQL command used to retrieve data records from a database table?`;
    let customMicroOpts = ['SELECT', 'EXTRACT', 'GET', 'FETCH'];
    let customMicroExp = {
      0: 'Correct! SELECT is the standard DQL command to query and retrieve data from database tables.',
      1: 'Incorrect. EXTRACT is a function used for dates, not a table query command.',
      2: 'Incorrect. GET is an HTTP method or programming keyword, not a SQL DQL statement.',
      3: 'Incorrect. FETCH is used with cursor pagination, while SELECT retrieves data.',
    };

    if (topicSlug.includes('intro')) {
      customSyntax = `SELECT schema_name, table_name FROM information_schema.tables;`;
      customWhat = `Relational Databases (RDBMS) organize data into structured tables containing Columns (attributes) and Rows (records).`;
      customWhy = `Enterprise systems use SQL databases because they handle millions of rows without file crashing limits.`;
    } else if (topicSlug.includes('commands-ddl-dml')) {
      customSyntax = `-- DDL: CREATE TABLE ...\n-- DML: INSERT INTO ...\n-- DQL: SELECT ... FROM ...`;
      customWhat = `SQL commands are categorized into DDL (Data Definition), DML (Data Manipulation), DQL (Data Query), and DCL (Data Control).`;
      customWhy = `Categorizing commands helps analysts distinguish structural schema changes from row data modifications.`;
    } else if (topicSlug.includes('create-insert')) {
      customSyntax = `CREATE TABLE employees (\n  emp_id INT PRIMARY KEY,\n  first_name VARCHAR(50) NOT NULL,\n  salary DECIMAL(10,2)\n);\nINSERT INTO employees VALUES (101, 'Rahul', 65000.00);`;
      customWhat = `CREATE TABLE defines columns, data types (INT, VARCHAR, DATE), and constraints (PRIMARY KEY, NOT NULL).`;
      customWhy = `Proper table design enforces data integrity so invalid or missing values cannot corrupt reporting.`;
      customMicroQ = `Which SQL constraint guarantees that every row has a unique identifier and cannot be NULL?`;
      customMicroOpts = ['PRIMARY KEY', 'DEFAULT', 'CHECK', 'INDEX'];
    } else if (topicSlug.includes('data-manipulation')) {
      customSyntax = `UPDATE employees SET salary = 75000 WHERE emp_id = 101;\nDELETE FROM employees WHERE emp_id = 105;`;
      customWhat = `Data Manipulation Language (DML) manages table content through INSERT, UPDATE, and DELETE queries.`;
      customWhy = `Updating and cleaning database records is a regular task when handling changing business data.`;
      customMicroQ = `What happens if you run an UPDATE query without specifying a WHERE clause?`;
      customMicroOpts = ['Every row in the entire table will be updated to the new value', 'Only 1 row will be updated', 'SQL will refuse to run', 'The table is deleted'];
    } else if (topicSlug.includes('alter-table')) {
      customSyntax = `ALTER TABLE employees ADD COLUMN email VARCHAR(100);\nALTER TABLE employees DROP COLUMN temp_notes;`;
      customWhat = `ALTER TABLE modifies existing table schemas by adding, modifying, or dropping columns.`;
      customWhy = `As business requirements evolve, analysts must adjust table structures without losing existing rows.`;
    } else if (topicSlug.includes('select-queries')) {
      customSyntax = `SELECT DISTINCT department, first_name AS name, salary FROM employees;`;
      customWhat = `SELECT statements extract specific columns from a table, rename columns with AS aliases, and remove duplicates using DISTINCT.`;
      customWhy = `Selecting only required columns optimizes memory performance and cleans up query outputs for reports.`;
    } else if (topicSlug.includes('operators-filtering')) {
      customSyntax = `SELECT * FROM employees WHERE salary >= 50000 AND department = 'Sales';`;
      customWhat = `The WHERE clause filters rows matching specific comparison (=, !=, <, >) and logical (AND, OR, NOT) conditions.`;
      customWhy = `Filtering isolates the exact subset of records needed for target analytics.`;
    } else if (topicSlug.includes('pattern-matching')) {
      customSyntax = `SELECT * FROM customers WHERE name LIKE 'A%' AND age BETWEEN 25 AND 40 AND city IN ('Delhi', 'Mumbai');`;
      customWhat = `LIKE with wildcards (% and _), BETWEEN for range boundaries, and IN for set matching provide flexible text and range filtering.`;
      customWhy = `Analysts use pattern matching to find customer names, product SKUs, or date ranges quickly.`;
    } else if (topicSlug.includes('csv-import')) {
      customSyntax = `COPY sales_records FROM '/data/raw_sales.csv' WITH (FORMAT csv, HEADER);`;
      customWhat = `CSV import tools and COPY/LOAD statements ingest external CSV files into relational database tables.`;
      customWhy = `Raw business data often arrives as CSV files that need to be ingested into SQL for querying.`;
    } else if (topicSlug.includes('practice-assignments')) {
      customSyntax = `SELECT product_id, SUM(quantity * unit_price) AS total_revenue\nFROM order_items\nGROUP BY product_id\nORDER BY total_revenue DESC\nLIMIT 5;`;
      customWhat = `Hands-on SQL practice involves structuring multi-clause queries in logical execution order (FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY).`;
      customWhy = `Building query writing muscle memory is essential for passing Data Analyst technical interviews.`;
    } else if (topicSlug.includes('string-date')) {
      customSyntax = `SELECT CONCAT(first_name, ' ', last_name) AS full_name,\n       DATEDIFF(CURRENT_DATE, hire_date) AS tenure_days\nFROM employees;`;
      customWhat = `String functions (CONCAT, SUBSTRING, UPPER) and Date functions (DATEDIFF, NOW, EXTRACT) transform raw text and timestamps.`;
      customWhy = `Real-world data requires string cleaning and date calculations to calculate tenure, delivery times, and age.`;
    } else if (topicSlug.includes('conditional-functions')) {
      customSyntax = `SELECT name, salary,\n       CASE WHEN salary > 80000 THEN 'High'\n            WHEN salary > 50000 THEN 'Mid'\n            ELSE 'Entry' END AS salary_tier,\n       COALESCE(bonus, 0) AS final_bonus\nFROM employees;`;
      customWhat = `CASE WHEN statements apply conditional logic row by row, while COALESCE replaces NULL missing values with defaults.`;
      customWhy = `Conditional logic creates custom categorization buckets and prevents NULL calculation errors in financial metrics.`;
    } else if (topicSlug.includes('set-operators')) {
      customSyntax = `SELECT customer_email FROM online_orders\nUNION ALL\nSELECT customer_email FROM store_orders;`;
      customWhat = `Set operators (UNION, UNION ALL, INTERSECT, EXCEPT) combine the output of multiple SELECT queries vertically.`;
      customWhy = `Combining datasets across different sales channels (e.g. online vs physical store) requires set operations.`;
    } else if (topicSlug.includes('window-functions')) {
      customSyntax = `SELECT emp_name, department, salary,\n       ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank_in_dept\nFROM employees;`;
      customWhat = `Window functions (OVER, ROW_NUMBER, RANK, DENSE_RANK) perform calculations across a subset of rows without collapsing rows.`;
      customWhy = `Window functions solve complex analytical tasks like running totals, top N per department, and ranking.`;
    } else if (topicSlug.includes('table-relationships')) {
      customSyntax = `ALTER TABLE orders ADD CONSTRAINT fk_cust FOREIGN KEY (customer_id) REFERENCES customers(customer_id);`;
      customWhat = `Entity relationship design uses Primary Keys (PK) and Foreign Keys (FK) to establish 1:1, 1:N, and N:M relational connections.`;
      customWhy = `Proper relational schemas eliminate duplicate data storage and maintain referential integrity.`;
    } else if (topicSlug.includes('joins-basics')) {
      customSyntax = `SELECT e.emp_name, d.dept_name\nFROM employees e\nINNER JOIN departments d ON e.dept_id = d.dept_id;`;
      customWhat = `Relational JOINs (INNER JOIN, LEFT JOIN, RIGHT JOIN) merge columns from multiple tables using matching key columns.`;
      customWhy = `Business data is normalized across multiple tables. JOINs combine them back into unified analytical reports.`;
    } else if (topicSlug.includes('joins-advanced')) {
      customSyntax = `SELECT d.dept_name, COUNT(e.emp_id) AS total_staff, AVG(e.salary) AS avg_salary\nFROM employees e\nJOIN departments d ON e.dept_id = d.dept_id\nGROUP BY d.dept_name\nHAVING AVG(e.salary) > 60000;`;
      customWhat = `Advanced multi-table queries combine JOINs across 3+ tables with GROUP BY aggregations and HAVING filters.`;
      customWhy = `Answering executive business questions requires aggregating metrics across multiple relational entities.`;
    } else if (topicSlug.includes('capstone')) {
      customSyntax = `WITH monthly_rev AS (\n  SELECT DATE_TRUNC('month', order_date) AS mth, SUM(total_amount) AS rev\n  FROM orders GROUP BY 1\n)\nSELECT mth, rev, LAG(rev) OVER (ORDER BY mth) AS prev_rev\nFROM monthly_rev;`;
      customWhat = `The SQL Capstone Project combines CTEs, JOINs, window functions, and aggregations to answer end-to-end business questions.`;
      customWhy = `Demonstrates complete production SQL competence for Data Analyst portfolio projects.`;
    }

    return {
      topicId: topicSlug,
      topicTitle: cleanTitle,
      domainType: 'SQL',
      isCodeTopic: true,
      estimatedStudyTimeMinutes: 25,
      careerTitle: careerTitle || 'Data Analyst',
      skillTitle: skillTitle || 'SQL Querying',
      levelTitle: levelTitle || 'LEVEL 1 — SQL FUNDAMENTALS',
      learningObjectives: [
        `✓ Understand core principles of ${cleanTitle}`,
        `✓ Master correct SQL syntax rules and clause order for ${cleanTitle}`,
        `✓ Write and execute clean SQL queries on realistic database tables`,
        `✓ Avoid common query syntax errors, NULL pitfalls, and logic bugs`,
      ],
      realWorldStory: {
        familiarContext: `Imagine an e-commerce platform with millions of customers, products, and orders. To answer business questions like "What are our top products?", analysts write SQL queries to extract insights directly from relational databases.`,
        whyItMatters: `SQL is the single most required technical skill for Data Analysts across tech, finance, e-commerce, and healthcare industries.`,
      },
      lessons: [
        {
          lessonId: `${topicSlug}-les-1`,
          lessonNumber: 1,
          title: `Mastering ${cleanTitle}`,
          whatIsIt: customWhat,
          whyDoWeUseIt: customWhy,
          howDoesItWork: `Database query engines parse your SQL statement, optimize the join execution plan, scan table indexes, and return matching result rows.`,
          syntax: customSyntax,
          syntaxParts: [
            { part: 'SQL Keywords (SELECT, FROM, WHERE...)', explanation: 'Commands instructing the SQL engine which operations to perform' },
            { part: 'Table & Column Names', explanation: 'Target database objects and attributes to query or modify' },
            { part: 'Predicates & Conditions', explanation: 'Logical rules filtering which rows are included in the result' },
          ],
          mandatoryMicroCheck: {
            question: customMicroQ,
            options: customMicroOpts,
            correctOptionIndex: 0,
            optionExplanations: customMicroExp,
          },
          spreadsheetVisual: {
            title: 'SQL Relational Table Representation — employees Dataset',
            headers: ['emp_id', 'first_name', 'department', 'salary'],
            rows: [
              { emp_id: 101, first_name: 'Rahul', department: 'Sales', salary: 65000 },
              { emp_id: 102, first_name: 'Priya', department: 'IT', salary: 82000 },
              { emp_id: 103, first_name: 'Amit', department: 'Sales', salary: 58000 },
            ],
            targetCell: 'SQL Query Output',
            formulaEntered: customSyntax.split('\n')[0],
            evaluatedResult: 'Query executed successfully. 3 rows affected.',
            explanation: 'The SQL query engine processes the input table and returns structured query results.',
          },
          guidedPractice: {
            scenario: `You are analyzing the "employees" table. You want to retrieve all columns for employees in the 'Sales' department.`,
            question: `Which SQL clause specifies the table filtering condition?`,
            options: ['WHERE department = \'Sales\'', 'GROUP BY department', 'ORDER BY Sales', 'SELECT Sales'],
            correctOptionIndex: 0,
            explanation: 'Correct! The WHERE clause specifies row-level filtering conditions.',
          },
          userPractice: {
            taskDescription: `Type the primary SQL clause used to select columns from a database table.`,
            placeholder: `Type SQL keyword (e.g. SELECT)`,
            expectedInput: ['SELECT', 'select', 'SELECT *', 'SELECT FROM'],
            hints: [`Start with the standard 6-letter DQL keyword: S-E-L-E-C-T`],
            successMessage: `🎉 Spot on! SELECT is the core building block of all SQL queries.`,
            errorMessage: `❌ Remember to type "SELECT" in upper or lower case.`,
          },
          progressiveExamples: [
            {
              level: 'Very Easy',
              title: `Basic SQL Query`,
              representation: `SELECT * FROM employees;`,
              stepByStep: ['Scans the employees table.', 'Returns all columns and all rows.'],
            },
            {
              level: 'Realistic',
              title: `Filtered SQL Query with Alias`,
              representation: `SELECT first_name AS name, salary FROM employees WHERE salary > 60000;`,
              stepByStep: ['Filters rows where salary > 60000.', 'Renames first_name column to "name" in output.'],
            },
            {
              level: 'Practical',
              title: `Production Analytical Query`,
              representation: customSyntax,
              stepByStep: ['Executes structured SQL clause logic.', 'Returns clean, formatted reporting metrics.'],
            },
          ],
          commonMistakes: [
            'Forgetting the closing semicolon (;) at the end of the query',
            'Misspelling table or column names resulting in "column does not exist" errors',
            'Executing UPDATE or DELETE statements without a WHERE clause',
            'Confusing WHERE (row filter before grouping) with HAVING (group filter after GROUP BY)',
          ],
          yourTurnPractice: {
            taskDescription: `Practice executing your query in the interactive SQL sandbox below.`,
            hint: `Use uppercase for SQL keywords like SELECT, FROM, WHERE for clean code style.`,
          },
          quickCheck: {
            question: `Why is writing clean, properly indented SQL queries recommended in production?`,
            options: [
              'Improves readability, code review speed, and query debugging for data teams',
              'Required by SQL compiler engines or else queries crash',
            ],
            correctOptionIndex: 0,
            optionExplanations: { 0: 'Correct! Clean formatting makes complex SQL maintainable and readable.' },
          },
          keyTakeaways: [`Mastering ${cleanTitle} enables robust, efficient relational data querying.`],
        },
      ],
      topicRecap: {
        importantConcepts: [`Core syntax and rules of ${cleanTitle}`],
        importantTerms: [`SQL Syntax: Standard clauses defining query structure`],
        keyRules: ['Always double check WHERE conditions before running DML updates or deletes.'],
        commonMistakes: ['Syntax typos, missing join keys, and NULL handling omissions'],
        practicalTakeaway: `${cleanTitle} is a foundational pillar for Data Analytics.`,
      },
    };
  }

  // Dynamic Socratic Lesson Generator for Power BI Topics
  const isPowerBi = domainType === 'POWER_BI' || topicSlug.startsWith('powerbi-');
  if (isPowerBi) {
    let customSyntax = `Total Revenue = SUMX(Sales, Sales[Quantity] * Sales[UnitPrice])`;
    let customWhat = `Power BI is Microsoft's business intelligence platform for transforming data, building Star Schema models, and authoring interactive dashboards.`;
    let customWhy = `Data Analysts use Power BI to convert raw enterprise tables into visual interactive reports that executives use to drive business decisions.`;
    let customMicroQ = `What is the primary authoring tool used by Data Analysts to connect to data, build data models, and create report pages?`;
    let customMicroOpts = ['Power BI Desktop', 'Power BI Mobile', 'Excel Solver', 'DAX Studio'];
    let customMicroExp = {
      0: 'Correct! Power BI Desktop is the primary local authoring application for modeling data and building interactive visual reports.',
      1: 'Incorrect. Power BI Mobile is a reader app for viewing reports on phones/tablets.',
      2: 'Incorrect. Excel Solver is an optimization add-in for Excel.',
      3: 'Incorrect. DAX Studio is an external community utility for testing DAX queries.',
    };

    if (topicSlug.includes('intro')) {
      customSyntax = `Power BI Workflow: Get Data -> Transform/Model -> Visualize -> Publish to Power BI Service`;
      customWhat = `Power BI consists of Desktop (authoring), Service (cloud sharing & scheduled refresh), and Mobile (viewing on devices).`;
      customWhy = `Enterprise organizations rely on Power BI to publish self-service dashboards that replace static PDF decks.`;
    } else if (topicSlug.includes('interface-navigation')) {
      customSyntax = `Power BI Desktop Views: Report View (Canvas) | Data View (Table Rows) | Model View (Star Schema)`;
      customWhat = `Power BI Desktop provides Report View for visual design, Data View for inspecting rows, and Model View for entity relationships.`;
      customWhy = `Navigating all three views smoothly allows analysts to inspect data quality, verify relationships, and format visuals cleanly.`;
    } else if (topicSlug.includes('import-data')) {
      customSyntax = `Home -> Get Data -> Select Source (Excel / CSV / SQL / Web) -> Import or DirectQuery Mode`;
      customWhat = `Import Mode loads data directly into compressed VertiPaq RAM for fast queries, while DirectQuery issues real-time SQL queries live.`;
      customWhy = `Choosing the right connection mode balances query speed with real-time data requirements.`;
    } else if (topicSlug.includes('power-query-basics')) {
      customSyntax = `Power Query Applied Steps: Promoted Headers -> Changed Type -> Split Column -> Replaced Value`;
      customWhat = `Power Query Editor is the ETL transformation tool inside Power BI used to clean data, fix data types, and split columns.`;
      customWhy = `Clean, correctly typed data is required before loading into data models to prevent calculation errors.`;
      customMicroQ = `Which pane in Power Query Editor records every data transformation step in sequential order?`;
      customMicroOpts = ['Applied Steps', 'Fields Pane', 'Visualizations Pane', 'Format Options'];
    } else if (topicSlug.includes('append-combine-data')) {
      customSyntax = `Append Queries (Union Rows Vertically) | Merge Queries (Join Columns Horizontally) | Unpivot Columns`;
      customWhat = `Append stacks matching tables vertically, Merge performs lookup joins between tables, and Unpivot converts wide tables to tall format.`;
      customWhy = `Combining datasets across monthly files or lookup tables is a fundamental ETL step in data analysis.`;
    } else if (topicSlug.includes('data-modelling')) {
      customSyntax = `Star Schema: 1 [Dim_Customers]  <--->  * [Fact_Sales] (1:N Relationship)`;
      customWhat = `Star Schema connects numerical Fact tables (sales) to descriptive Dimension lookup tables (customers, products) via 1:N relationships.`;
      customWhy = `Star Schema modeling optimizes DAX calculation performance and eliminates redundant column storage.`;
      customMicroQ = `In a standard Power BI Star Schema, what type of table contains numerical measure metrics like revenue and quantity?`;
      customMicroOpts = ['Fact Table', 'Dimension Table', 'Filter Table', 'Slicer Table'];
    } else if (topicSlug.includes('column-bar-charts')) {
      customSyntax = `Visual: Clustered & Stacked Column/Bar Charts | Formatting: Data Labels ON, Custom Bar Colors`;
      customWhat = `Column and Bar charts visualize categorical measure comparisons. Bar charts are preferred for long text category labels.`;
      customWhy = `Column and Bar charts are the workhorses of business reporting, comparing revenue across regions or categories.`;
    } else if (topicSlug.includes('line-area-charts')) {
      customSyntax = `Visual: Line & Stacked Area Charts | Axis: Date Hierarchy (Year -> Quarter -> Month -> Day)`;
      customWhat = `Line and Area charts track continuous time series metrics, displaying sales trends, date hierarchy drilldowns, and reference lines.`;
      customWhy = `Tracking monthly or quarterly revenue trends highlights seasonality and business growth direction.`;
    } else if (topicSlug.includes('waterfall-funnel-charts')) {
      customSyntax = `Waterfall Chart (Variance Bridge) | Funnel Chart (Conversion Pipeline Stages)`;
      customWhat = `Waterfall charts display step-by-step positive and negative variances bridging totals, while Funnel charts track pipeline conversion drop-offs.`;
      customWhy = `Executives use Waterfall charts for net profit variance analysis and Funnel charts for sales pipeline tracking.`;
    } else if (topicSlug.includes('scatter-pie-donut')) {
      customSyntax = `Scatter Plot (X-Y Metric Correlation & Play Axis) | Pie & Donut Charts (Part-to-Whole Breakdown)`;
      customWhat = `Scatter charts map two-metric correlations with bubble sizes, while Pie and Donut charts convey part-to-whole proportions.`;
      customWhy = `Scatter plots uncover statistical relationships (e.g. Discount % vs Profit Margin) across product groups.`;
    } else if (topicSlug.includes('treemap-filled-map')) {
      customSyntax = `Treemap (Nested Category Rectangles) | Filled Map (Geographic Region Polygons)`;
      customWhat = `Treemaps display nested hierarchical category sizes as proportional rectangles, while Filled Maps shade geographic regions.`;
      customWhy = `Visualizing regional sales distributions on maps instantly highlights geographic market penetration.`;
    } else if (topicSlug.includes('gauge-kpi-visuals')) {
      customSyntax = `Gauge Chart (Progress Dial vs Target) | KPI Visual (Actual Value + Target + Trend Axis)`;
      customWhat = `Gauge charts and KPI indicator cards track actual metric performance against target goals with status color coding (green/red).`;
      customWhy = `KPI visuals give executives instant visibility into whether targets are being met across key business metrics.`;
    } else if (topicSlug.includes('card-multirow-card')) {
      customSyntax = `Card Visual (Single Callout Value) | Multi-Row Card | New Card (Multiple Callout Metrics + Reference Labels)`;
      customWhat = `Card visuals highlight headline executive summary numbers prominently, while the New Card visual displays rich multi-metric callouts.`;
      customWhy = `Placing top-level Card metrics at the top of a dashboard allows business readers to inspect total revenue or active users in 1 second.`;
    } else if (topicSlug.includes('table-matrix')) {
      customSyntax = `Matrix Visual (Row/Column Headers, Stepped Layout, Subtotals, Conditional Data Bars)`;
      customWhat = `Matrix visuals provide Pivot Table functionality with expandable row hierarchies, subtotals, and conditional formatting.`;
      customWhy = `Data Analysts use Matrix visuals when business stakeholders need detailed tabular breakdowns with subtotal drilldowns.`;
    } else if (topicSlug.includes('slicers-interactive')) {
      customSyntax = `Slicer Controls: Dropdown / Slider / New Slicer (Image URLs) | Sync Slicers Across Pages`;
      customWhat = `Slicers provide on-canvas interactive filtering controls. New Slicers support button grids and image URL logos.`;
      customWhy = `Interactive slicers empower users to slice dashboards by region, year, or product category without analyst intervention.`;
    } else if (topicSlug.includes('dax-sum-sumx')) {
      customSyntax = `Total Revenue = SUMX(Sales, Sales[Quantity] * Sales[UnitPrice])`;
      customWhat = `DAX is Power BI's calculation language. SUM() sums a single column directly, while SUMX() iterates row-by-row evaluating custom math expressions.`;
      customWhy = `SUMX is required when total revenue is calculated by multiplying quantity by price at the individual row level before summing.`;
    } else if (topicSlug.includes('columns-vs-measures')) {
      customSyntax = `Calculated Column (Row RAM Storage) vs Measure (Dynamic Query-Time Aggregation)`;
      customWhat = `Calculated Columns compute values during data refresh and store data in RAM per row, while Measures compute dynamically on-demand at query time.`;
      customWhy = `Using Measures for numerical aggregations keeps data model file sizes small and optimizes dashboard response times.`;
    } else if (topicSlug.includes('dax-date-functions')) {
      customSyntax = `Calendar = CALENDARAUTO() | Month_Name = FORMAT(Calendar[Date], "mmm") | Mark as Date Table`;
      customWhat = `A contiguous Date Table marked as a Date Table is required for all DAX Time Intelligence calculations.`;
      customWhy = `Unbroken date tables ensure time intelligence calculations like YTD and MTD execute accurately without missing date gaps.`;
    } else if (topicSlug.includes('dax-calculate')) {
      customSyntax = `Tech Sales = CALCULATE(SUM(Sales[Amount]), Products[Category] = "Technology", ALL(Region))`;
      customWhat = `CALCULATE() evaluates an expression in a modified filter context, overriding, adding, or clearing filters with ALL().`;
      customWhy = `CALCULATE is the single most important function in DAX, allowing analysts to write custom filtered metrics like percentage of total.`;
    } else if (topicSlug.includes('dax-datesbetween')) {
      customSyntax = `Rolling 30D Sales = CALCULATE([Total Sales], DATESINPERIOD(Calendar[Date], MAX(Calendar[Date]), -30, DAY))`;
      customWhat = `DATESBETWEEN() and DATESINPERIOD() construct rolling date windows (e.g. rolling 30 days) relative to anchor dates.`;
      customWhy = `Rolling date metrics smooth out daily noise to reveal underlying 30-day or 12-month business momentum.`;
    } else if (topicSlug.includes('dax-time-intelligence')) {
      customSyntax = `Sales YTD = TOTALYTD([Total Sales], Calendar[Date]) | Sales SPLY = CALCULATE([Total Sales], SAMEPERIODLASTYEAR(Calendar[Date]))`;
      customWhat = `Time intelligence DAX functions calculate cumulative MTD, QTD, YTD metrics and Year-over-Year (YoY) period growth.`;
      customWhy = `Comparing current YTD revenue against SAMEPERIODLASTYEAR is the standard method for measuring corporate growth performance.`;
    } else if (topicSlug.includes('capstone')) {
      customSyntax = `Interactive Dashboard: Power Query ETL -> Star Schema -> DAX Measures -> KPI Cards & Visuals -> Sync Slicers`;
      customWhat = `The Capstone Dashboard integrates all Power BI concepts into a production-ready interactive business intelligence report.`;
      customWhy = `Building a complete end-to-end interactive dashboard proves production Power BI competence for Data Analyst roles.`;
    }

    return {
      topicId: topicSlug,
      topicTitle: cleanTitle,
      domainType: 'POWER_BI',
      isCodeTopic: true,
      estimatedStudyTimeMinutes: 25,
      careerTitle: careerTitle || 'Data Analyst',
      skillTitle: skillTitle || 'Power BI Dashboards',
      levelTitle: levelTitle || 'LEVEL 1 — POWER BI FUNDAMENTALS',
      learningObjectives: [
        `✓ Understand core principles and feature workflows of ${cleanTitle}`,
        `✓ Master correct Power BI Desktop settings, Power Query steps, or DAX formulas for ${cleanTitle}`,
        `✓ Build interactive visual charts, models, or measures on realistic business datasets`,
        `✓ Avoid common data modeling pitfalls, DAX context bugs, and visual clutter mistakes`,
      ],
      realWorldStory: {
        familiarContext: `Imagine an e-commerce executive who wants to track monthly revenue, top sales regions, and customer retention. Instead of digging through raw spreadsheets, they open a Power BI interactive dashboard to slice metrics in real time.`,
        whyItMatters: `Power BI is the industry-leading Business Intelligence platform used by top Fortune 500 companies and tech startups worldwide.`,
      },
      lessons: [
        {
          lessonId: `${topicSlug}-les-1`,
          lessonNumber: 1,
          title: `Mastering ${cleanTitle}`,
          whatIsIt: customWhat,
          whyDoWeUseIt: customWhy,
          howDoesItWork: `Power BI VertiPaq engine compresses loaded tables into memory, manages Star Schema relationships, and evaluates DAX filter context dynamically on user clicks.`,
          syntax: customSyntax,
          syntaxParts: [
            { part: 'Power BI Feature / DAX Function', explanation: 'Core workflow command or DAX calculation expression' },
            { part: 'Dataset Fields & Attributes', explanation: 'Target data columns, fact measures, or dimension attributes' },
            { part: 'Visual Formatting & Options', explanation: 'On-canvas formatting options, data labels, and slicer interactions' },
          ],
          mandatoryMicroCheck: {
            question: customMicroQ,
            options: customMicroOpts,
            correctOptionIndex: 0,
            optionExplanations: customMicroExp,
          },
          spreadsheetVisual: {
            title: 'Power BI Business Dataset Representation — Fact_Sales & Dim_Products',
            headers: ['Order_ID', 'Product_Category', 'Region', 'Sales_Amount'],
            rows: [
              { Order_ID: 1001, Product_Category: 'Technology', Region: 'North', Sales_Amount: 1250 },
              { Order_ID: 1002, Product_Category: 'Furniture', Region: 'South', Sales_Amount: 850 },
              { Order_ID: 1003, Product_Category: 'Technology', Region: 'East', Sales_Amount: 2100 },
            ],
            targetCell: 'Power BI Dashboard Visual Output',
            formulaEntered: customSyntax,
            evaluatedResult: 'Visual rendered successfully. Interactive slicer filtering active.',
            explanation: 'Power BI processes table relationships and DAX measures to update visual dashboard charts dynamically.',
          },
          guidedPractice: {
            scenario: `You are building a Power BI report page for executive leadership. You need to configure ${cleanTitle} for clear data presentation.`,
            question: `What is the primary benefit of applying ${cleanTitle} in a Power BI report?`,
            options: [
              'Enables clear data analysis, intuitive visual exploration, and accurate business reporting',
              'Increases file size unnecessarily',
              'Deletes underlying database tables',
              'Converts charts to static images',
            ],
            correctOptionIndex: 0,
            explanation: 'Correct! Proper Power BI setup delivers clean, interactive, and accurate executive reporting.',
          },
          userPractice: {
            taskDescription: `Type the primary Power BI tool name used for interactive business intelligence dashboards.`,
            placeholder: `Type tool name (e.g. Power BI)`,
            expectedInput: ['Power BI', 'power bi', 'POWER BI', 'Power BI Desktop', 'DAX', 'Power Query'],
            hints: [`Type "Power BI" or "Power BI Desktop"`],
            successMessage: `🎉 Excellent! Power BI is the leading BI platform for Data Analysts.`,
            errorMessage: `❌ Double-check your spelling: P-O-W-E-R B-I`,
          },
          progressiveExamples: [
            {
              level: 'Very Easy',
              title: `Basic Power BI Feature Overview`,
              representation: customSyntax,
              stepByStep: ['Selects the target dataset.', 'Applies foundational Power BI configuration.'],
            },
            {
              level: 'Realistic',
              title: `Interactive Report Configuration`,
              representation: `-- Power BI Report Setup\n${customSyntax}`,
              stepByStep: ['Configures visual attributes.', 'Verifies interactive slicer filter propagation.'],
            },
            {
              level: 'Practical',
              title: `Production Enterprise Dashboard Workflow`,
              representation: `-- Production Power BI DAX & Visual Architecture\n${customSyntax}`,
              stepByStep: ['Executes Star Schema data modeling.', 'Renders high-impact executive KPI visuals.'],
            },
          ],
          commonMistakes: [
            'Confusing Calculated Columns (RAM storage) with Measures (query-time aggregation)',
            'Forgetting to mark a contiguous Date table as a Date Table for Time Intelligence',
            'Enabling bi-directional cross-filtering without a specific modeling need',
            'Overcrowding report pages with too many visual charts without clear visual hierarchy',
          ],
          yourTurnPractice: {
            taskDescription: `Practice configuring ${cleanTitle} in Power BI Desktop.`,
            hint: `Use consistent DAX formatting and clear visual layout styling.`,
          },
          quickCheck: {
            question: `Why is maintaining a clean Star Schema data model important in Power BI?`,
            options: [
              'Optimizes VertiPaq memory compression, speeds up DAX calculations, and prevents relationship ambiguity',
              'Changes canvas wallpaper background colors',
            ],
            correctOptionIndex: 0,
            optionExplanations: { 0: 'Correct! Star Schema modeling maximizes Power BI engine speed and DAX clarity.' },
          },
          keyTakeaways: [`Mastering ${cleanTitle} empowers you to build professional production Power BI dashboards.`],
        },
      ],
      topicRecap: {
        importantConcepts: [`Core architecture and techniques of ${cleanTitle}`],
        importantTerms: [`Power BI Desktop: Primary authoring tool for modeling and reporting`],
        keyRules: ['Always verify relationship cardinalities and test DAX measures before publishing to Power BI Service.'],
        commonMistakes: ['Ambiguous relationships, unformatted DAX measures, and visual clutter'],
        practicalTakeaway: `${cleanTitle} is a essential skill for enterprise Data Analysts.`,
      },
    };
  }

  // Dynamic Socratic Lesson Generator for Python Topics
  const isPython = domainType === 'PYTHON' || topicSlug.startsWith('python-');
  if (isPython) {
    let customSyntax = `import pandas as pd\ndf = pd.read_csv('sales_data.csv')\nprint(df.head())`;
    let customWhat = `Python is a high-level programming language, and Pandas is its core data manipulation library for tabular DataFrames.`;
    let customWhy = `Data Analysts use Python and Pandas to clean dirty data, run statistical analysis, automate repetitive reports, and plot charts.`;
    let customMicroQ = `What is the primary Python library used by Data Analysts for handling 2D tabular DataFrames?`;
    let customMicroOpts = ['Pandas', 'Requests', 'Flask', 'Django'];
    let customMicroExp = {
      0: 'Correct! Pandas is the standard library for 2D tabular DataFrames in Python.',
      1: 'Incorrect. Requests is used for HTTP web requests.',
      2: 'Incorrect. Flask is a lightweight web application framework.',
      3: 'Incorrect. Django is a full-stack web framework.',
    };

    if (topicSlug.includes('syntax-variables')) {
      customSyntax = `sales_rep = "Alice"\nmonthly_revenue = 45000.50\nis_active = True\nprint(f"{sales_rep}: \${monthly_revenue}")`;
      customWhat = `Python variables store dynamically typed data like strings (str), floating points (float), integers (int), and booleans (bool).`;
      customWhy = `Variables allow Data Analysts to store intermediate metric values, filepaths, and clean constants for calculations.`;
    } else if (topicSlug.includes('operators-strings')) {
      customSyntax = `customer = "   john doe   "\nclean_name = customer.strip().title()\nformatted = f"Customer: {clean_name} | Spend: \${spend * 1.05:.2f}"`;
      customWhat = `Python arithmetic operators (+, -, *, /, //, %) and string methods (.strip(), .title(), f-strings) format and clean text data.`;
      customWhy = `Cleaning customer names and calculating tax-inclusive totals require string manipulation and math operators.`;
    } else if (topicSlug.includes('control-flow')) {
      customSyntax = `if revenue > 50000:\n    tier = "Gold"\nelif revenue > 20000:\n    tier = "Silver"\nelse:\n    tier = "Bronze"`;
      customWhat = `If-elif-else conditional logic and for/while loops direct execution flow and automate batch operations.`;
      customWhy = `Categorizing customers into spending tiers or iterating over files relies on conditional control flow.`;
      customMicroQ = `Which Python keyword is used to test an alternative condition if the initial 'if' condition evaluates to False?`;
      customMicroOpts = ['elif', 'else if', 'otherwise', 'then'];
    } else if (topicSlug.includes('lists-tuples')) {
      customSyntax = `regions = ["North", "South", "East"]\nregions.append("West")\nfixed_coords = (40.7128, -74.0060)`;
      customWhat = `Lists are mutable ordered sequences for collections of items, whereas Tuples are immutable fixed sequences.`;
      customWhy = `Lists store column names, batch file paths, or target values for sequential iteration in data scripts.`;
    } else if (topicSlug.includes('dicts-sets')) {
      customSyntax = `customer = {"id": 101, "name": "Tech Corp", "revenue": 150000}\nunique_categories = set(["Tech", "Office", "Tech"])`;
      customWhat = `Dictionaries store key-value lookup pairs, while Sets store unique non-duplicate elements.`;
      customWhy = `Dictionaries convert directly into Pandas DataFrames, and Sets quickly remove duplicate category names.`;
    } else if (topicSlug.includes('comprehensions')) {
      customSyntax = `high_sales = [rev for rev in sales_list if rev > 5000]\nrev_dict = {cat: val * 1.1 for cat, val in catalog.items()}`;
      customWhat = `List and dictionary comprehensions provide a concise 1-line syntax for filtering and transforming collections.`;
      customWhy = `Comprehensions eliminate verbose multi-line for-loops when filtering numerical lists or transforming keys.`;
    } else if (topicSlug.includes('functions-lambdas')) {
      customSyntax = `def calc_net_revenue(gross, discount=0.05):\n    return gross * (1 - discount)\n\ntax_fn = lambda x: x * 1.08`;
      customWhat = `Functions encapsulate reusable code blocks with parameters, and Lambdas create quick 1-line anonymous functions.`;
      customWhy = `Functions simplify repetitive analysis scripts and allow custom column operations with Pandas .apply().`;
    } else if (topicSlug.includes('functional-builtins')) {
      customSyntax = `doubled = list(map(lambda x: x * 2, values))\nfiltered = list(filter(lambda x: x > 50, values))\npaired = list(zip(names, scores))`;
      customWhat = `Built-in map(), filter(), zip(), and enumerate() perform functional iterations across parallel collections.`;
      customWhy = `Pairing lists with zip() or tracking loop indices with enumerate() is essential when processing paired data.`;
    } else if (topicSlug.includes('file-csv-json')) {
      customSyntax = `import json\nwith open('sales_config.json', 'r') as file:\n    config = json.load(file)`;
      customWhat = `The built-in open() context manager safely reads and writes CSV, text, and JSON data files with automated file closing.`;
      customWhy = `Reading raw API payloads (JSON) or config parameters into Python precedes loading data into Pandas.`;
    } else if (topicSlug.includes('numpy-arrays')) {
      customSyntax = `import numpy as np\narr = np.array([10, 20, 30, 40])\nmean_val = np.mean(arr)\nstd_val = np.std(arr)`;
      customWhat = `NumPy ndarrays provide high-performance vectorized numeric computations and fast element-wise mathematical operations.`;
      customWhy = `NumPy is the high-speed C-based numerical computational engine underlying Pandas DataFrames.`;
    } else if (topicSlug.includes('series-dataframe')) {
      customSyntax = `import pandas as pd\ndf = pd.DataFrame({"Customer": ["Alice", "Bob"], "Sales": [1200, 850]})`;
      customWhat = `Pandas Series is a 1D labeled array, and DataFrame is a 2D labeled tabular data structure with rows and columns.`;
      customWhy = `DataFrames are the primary tabular data representation in Python, replacing static spreadsheets.`;
    } else if (topicSlug.includes('inspection-selection')) {
      customSyntax = `df.head()\ndf.info()\ndf.describe()\nsubset = df.loc[df['Sales'] > 1000, ['Customer', 'Sales']]`;
      customWhat = `.head(), .info(), and .describe() inspect data properties, while .loc[] (label) and .iloc[] (position) select rows/columns.`;
      customWhy = `Inspecting shape, missing values, and selecting target subsets are the first steps before running data transformations.`;
    } else if (topicSlug.includes('filtering-sorting')) {
      customSyntax = `high_sales = df[(df['Region'] == 'North') & (df['Sales'] > 5000)]\nsorted_df = df.sort_values(by='Sales', ascending=False)`;
      customWhat = `Boolean indexing masks filter rows by logical criteria (&, |), and .sort_values() orders DataFrames.`;
      customWhy = `Filtering target customer segments and sorting top revenue generators answers key business questions.`;
    } else if (topicSlug.includes('missing-duplicates')) {
      customSyntax = `df.isna().sum()\ndf_clean = df.dropna(subset=['Customer_ID'])\ndf['Age'] = df['Age'].fillna(df['Age'].median())\ndf.drop_duplicates(inplace=True)`;
      customWhat = `Missing value detection (.isna()), removal (.dropna()), imputation (.fillna()), and duplicate removal (.drop_duplicates()).`;
      customWhy = `Dirty data with nulls or duplicate rows distorts statistical totals and leads to inaccurate reports.`;
    } else if (topicSlug.includes('string-date-cleaning')) {
      customSyntax = `df['Name'] = df['Name'].str.strip().str.title()\ndf['Order_Date'] = pd.to_datetime(df['Order_Date'])\ndf['Year'] = df['Order_Date'].dt.year`;
      customWhat = `.str vector string accessors (.strip(), .title(), .replace()) and .dt datetime accessors (.year, .month, .day_name()).`;
      customWhy = `Standardizing customer text inputs and converting text to datetime enables accurate time-based aggregation.`;
    } else if (topicSlug.includes('apply-transform')) {
      customSyntax = `df['Tax'] = df['Sales'].apply(lambda x: x * 0.08)\ndf['Bonus_Tier'] = np.where(df['Sales'] > 10000, 'High', 'Standard')`;
      customWhat = `.apply() executes custom functions across Series or rows, and np.where() / pd.cut() create conditional categories.`;
      customWhy = `Adding calculated columns like tax amounts or sales performance tiers customizes DataFrames for executive reports.`;
    } else if (topicSlug.includes('groupby-agg')) {
      customSyntax = `summary = df.groupby('Region')['Sales'].agg(['sum', 'mean', 'count']).reset_index()`;
      customWhat = `The Split-Apply-Combine workflow uses .groupby() with single or multi-column aggregations (.agg()).`;
      customWhy = `Grouping metrics by region, category, or sales rep is the core analytical operation in business analytics.`;
    } else if (topicSlug.includes('merging-joining')) {
      customSyntax = `merged_df = pd.merge(orders_df, customers_df, on='customer_id', how='left')`;
      customWhat = `pd.merge() combines DataFrames using relational database join types (left, right, inner, outer) on key columns.`;
      customWhy = `Joining order transaction tables with customer lookup tables enriches sales datasets with customer demographic data.`;
    } else if (topicSlug.includes('advanced-indexing')) {
      customSyntax = `df.set_index(['Region', 'Category'], inplace=True)\npivot = pd.pivot_table(df, values='Sales', index='Region', columns='Year', aggfunc='sum')`;
      customWhat = `MultiIndex hierarchical indexing, .unstack(), .stack(), and pd.pivot_table() reshape DataFrame layouts.`;
      customWhy = `Pivoting data from long to wide format generates cross-tabulation summaries for executive reporting.`;
    } else if (topicSlug.includes('time-series')) {
      customSyntax = `df.set_index('Order_Date', inplace=True)\nmonthly = df['Sales'].resample('M').sum()\nrolling_7d = df['Sales'].rolling(window=7).mean()`;
      customWhat = `Datetime indexing, .resample() for frequency aggregation (monthly/quarterly), and .rolling() for moving averages.`;
      customWhy = `Tracking 7-day rolling sales averages or quarterly resampling reveals seasonal trends and long-term business trajectory.`;
    } else if (topicSlug.includes('descriptive-stats')) {
      customSyntax = `df.describe()\nskewness = df['Sales'].skew()\niqr = df['Sales'].quantile(0.75) - df['Sales'].quantile(0.25)`;
      customWhat = `Summary statistics: Mean, Median, Mode, Variance, Standard Deviation, Skewness, Kurtosis, and Quantiles.`;
      customWhy = `Descriptive statistics measure data centrality and spread, uncovering outlier anomalies in numerical data.`;
    } else if (topicSlug.includes('correlation-insights')) {
      customSyntax = `corr_matrix = df.corr(numeric_only=True)\nstrong_corr = corr_matrix['Sales'].sort_values(ascending=False)`;
      customWhat = `Pearson and Spearman correlation coefficients measure linear relationships between numeric column pairs.`;
      customWhy = `Discovering strong correlations (e.g. Marketing Budget vs Sales Revenue) identifies actionable business growth drivers.`;
    } else if (topicSlug.includes('matplotlib-charts')) {
      customSyntax = `import matplotlib.pyplot as plt\nplt.figure(figsize=(8, 4))\nplt.plot(df['Date'], df['Sales'], label='Sales')\nplt.title('Monthly Sales Trend')\nplt.xlabel('Date')\nplt.ylabel('Sales ($)')\nplt.show()`;
      customWhat = `Matplotlib Object-Oriented plotting with figures, axes, line charts, bar plots, scatter plots, and figure formatting.`;
      customWhy = `Building custom statistical charts visualizes empirical findings clearly for stakeholder reports and presentations.`;
    } else if (topicSlug.includes('seaborn-statistical-viz')) {
      customSyntax = `import seaborn as sns\nimport matplotlib.pyplot as plt\nsns.histplot(df['Sales'], kde=True)\nsns.boxplot(x='Category', y='Sales', data=df)\nsns.heatmap(df.corr(numeric_only=True), annot=True)`;
      customWhat = `Seaborn statistical graphics library for distribution plots, boxplots, pairplots, and correlation heatmaps.`;
      customWhy = `Heatmaps and boxplots instantly highlight value distributions, outliers, and feature correlations during EDA.`;
    } else if (topicSlug.includes('capstone')) {
      customSyntax = `# Capstone Python Data Analyst Workflow\nimport pandas as pd\nimport seaborn as sns\ndf = pd.read_csv('raw_orders.csv')\nclean_df = df.dropna().drop_duplicates()\nsummary = clean_df.groupby('Category')['Sales'].sum()\nsns.barplot(x=summary.index, y=summary.values)`;
      customWhat = `The Capstone Python Project integrates ingestion, cleaning, transformation, statistical EDA, and visualization into a complete analytical workflow.`;
      customWhy = `Executing an end-to-end Python data analysis script demonstrates complete production readiness for Data Analyst roles.`;
    }

    return {
      topicId: topicSlug,
      topicTitle: cleanTitle,
      domainType: 'PYTHON',
      isCodeTopic: true,
      estimatedStudyTimeMinutes: 25,
      careerTitle: careerTitle || 'Data Analyst',
      skillTitle: skillTitle || 'Python + Pandas',
      levelTitle: levelTitle || 'LEVEL 1 — PYTHON FUNDAMENTALS',
      learningObjectives: [
        `✓ Master core Python syntax and Pandas library functionality for ${cleanTitle}`,
        `✓ Clean, transform, aggregate, or visualize real business datasets using Python code`,
        `✓ Write clean, Pythonic code applied to sales, customer, and operational datasets`,
        `✓ Avoid common syntax errors, SettingWithCopy warnings, and indexing bugs`,
      ],
      realWorldStory: {
        familiarContext: `Imagine a Data Analyst who needs to process 500,000 transaction records, compute 7-day rolling revenue averages, and generate distribution charts. Writing a Python script with Pandas and Seaborn accomplishes this in seconds.`,
        whyItMatters: `Python and Pandas are the industry standard toolset for modern data analytics, statistical computing, and automated reporting worldwide.`,
      },
      lessons: [
        {
          lessonId: `${topicSlug}-les-1`,
          lessonNumber: 1,
          title: `Mastering ${cleanTitle}`,
          whatIsIt: customWhat,
          whyDoWeUseIt: customWhy,
          howDoesItWork: `Python executes code line-by-line using vectorized NumPy operations under the hood for fast C-based memory performance.`,
          syntax: customSyntax,
          syntaxParts: [
            { part: 'Python Keyword / Function', explanation: 'Core Python syntax command or Pandas library method' },
            { part: 'DataFrame / Target Object', explanation: 'Target dataset column, array variable, or collection object' },
            { part: 'Operation Parameters', explanation: 'Arguments controlling filtering, grouping, or visualization behavior' },
          ],
          mandatoryMicroCheck: {
            question: customMicroQ,
            options: customMicroOpts,
            correctOptionIndex: 0,
            optionExplanations: customMicroExp,
          },
          spreadsheetVisual: {
            title: 'Python & Pandas Dataset Output Representation — df (sales_data)',
            headers: ['customer_id', 'region', 'sales_amount', 'category'],
            rows: [
              { customer_id: 101, region: 'North', sales_amount: 4500, category: 'Tech' },
              { customer_id: 102, region: 'South', sales_amount: 3200, category: 'Office' },
              { customer_id: 103, region: 'East', sales_amount: 5800, category: 'Tech' },
            ],
            targetCell: 'Python Execution Output',
            formulaEntered: customSyntax,
            evaluatedResult: 'Python script executed cleanly. Output returned as DataFrame / Series.',
            explanation: 'Pandas loads tabular data into memory for fast, vectorized filtering, transformation, and aggregation.',
          },
          guidedPractice: {
            scenario: `You are performing data analysis in a Python Jupyter environment. You need to apply ${cleanTitle} to an enterprise dataset.`,
            question: `What is the primary advantage of using Python and Pandas for data analysis?`,
            options: [
              'Enables automated, reproducible, and scalable data cleaning, analysis, and visualization pipelines',
              'Requires manual mouse clicks for every single row',
              'Deletes target database tables automatically',
              'Only works on text files',
            ],
            correctOptionIndex: 0,
            explanation: 'Correct! Python delivers reproducible, automated, and high-performance data analytics.',
          },
          userPractice: {
            taskDescription: `Type the primary Python data analysis library used for DataFrames.`,
            placeholder: `Type library name (e.g. pandas)`,
            expectedInput: ['pandas', 'Pandas', 'PANDAS', 'pd', 'python', 'numpy'],
            hints: [`Type "pandas"`],
            successMessage: `🎉 Excellent! Pandas is the foundation of Python data analysis.`,
            errorMessage: `❌ Double-check your spelling: p-a-n-d-a-s`,
          },
          progressiveExamples: [
            {
              level: 'Very Easy',
              title: `Basic Python Syntax Overview`,
              representation: customSyntax,
              stepByStep: ['Initializes target variables or DataFrame.', 'Executes core Python syntax operation.'],
            },
            {
              level: 'Realistic',
              title: `Business Data Cleaning & Analysis`,
              representation: `# Python Data Analyst Workflow\nimport pandas as pd\n${customSyntax}`,
              stepByStep: ['Loads business dataset into DataFrame.', 'Executes pandas transformation and inspects clean output.'],
            },
            {
              level: 'Practical',
              title: `Production Data Pipeline`,
              representation: `# Production Python Analytics Pipeline\nimport pandas as pd\nimport numpy as np\n${customSyntax}`,
              stepByStep: ['Executes scalable data transformation.', 'Exports cleaned summary dataset for business reporting.'],
            },
          ],
          commonMistakes: [
            'Confusing inplace=True with returning a new modified DataFrame object',
            'Forgetting to assign transformed columns back to df["column_name"]',
            'Encountering SettingWithCopyWarning when mutating sliced DataFrame subsets',
            'Mixing Python built-in lists with Pandas Series methods incorrectly',
          ],
          yourTurnPractice: {
            taskDescription: `Practice writing Python code for ${cleanTitle}.`,
            hint: `Ensure clean indentation and verify variable types before running operations.`,
          },
          quickCheck: {
            question: `Why is Python considered an essential tool for Data Analysts?`,
            options: [
              'It handles large datasets efficiently, automates repetitive cleaning, and integrates with visualization libraries',
              'It changes screen brightness automatically',
            ],
            correctOptionIndex: 0,
            optionExplanations: { 0: 'Correct! Python provides unmatched flexibility, analytical power, and visualization libraries.' },
          },
          keyTakeaways: [`Mastering ${cleanTitle} strengthens your Python data analysis capabilities.`],
        },
      ],
      topicRecap: {
        importantConcepts: [`Core Python and Pandas techniques of ${cleanTitle}`],
        importantTerms: [`Pandas DataFrame: 2D labeled tabular data structure with heterogenous columns`],
        keyRules: ['Always check df.info() or df.isna().sum() after data loading to verify data types and null counts.'],
        commonMistakes: ['Syntax typos, index misalignment, and unassigned transformation returns'],
        practicalTakeaway: `${cleanTitle} is a vital milestone in mastering Python for Data Analysis.`,
      },
    };
  }

  // Dynamic Socratic Lesson Generator for Statistics Topics
  const isStats = domainType === 'STATISTICS' || topicSlug.startsWith('stats-');
  if (isStats) {
    let customFormula = 'Mean = (\u03A3x) / N | Median = Middle Value | Mode = Most Frequent';
    let customWhat = 'Statistics is the science of collecting, exploring, summarizing, and drawing inferences from numerical data.';
    let customWhy = 'Data Analysts use statistics to separate real business signals from random noise and quantify uncertainty in metrics.';
    let customMicroQ = 'Which metric of central tendency represents the mathematical average calculated by dividing the sum of values by the count?';
    let customMicroOpts = ['Mean', 'Median', 'Mode', 'Standard Deviation'];
    let customMicroExp: Record<number, string> = {
      0: 'Correct! The Mean is calculated by dividing the total sum of all values by the number of observations.',
      1: 'Incorrect. Median is the middle observation when data is sorted.',
      2: 'Incorrect. Mode is the most frequently occurring value in the dataset.',
      3: 'Incorrect. Standard Deviation measures data dispersion or spread, not central tendency.',
    };

    if (topicSlug.includes('data-types') || topicSlug.includes('intro')) {
      customFormula = 'Data Types: Qualitative (Nominal, Ordinal) vs Quantitative (Discrete, Continuous)';
      customWhat = 'Data is categorized into Qualitative (Categorical text) and Quantitative (Numerical measurements).';
      customWhy = 'Identifying data types determines which mathematical formulas and chart visualizations are valid.';
      customMicroQ = 'Which type of data represents numerical counts that can only take whole integer values (e.g. number of website visits)?';
      customMicroOpts = ['Discrete Quantitative', 'Continuous Quantitative', 'Nominal Qualitative', 'Ordinal Qualitative'];
    } else if (topicSlug.includes('central-tendency')) {
      customFormula = 'Mean = \u03A3x / N | Median = Value at (N+1)/2 | Mode = Most Common';
      customWhat = 'Measures of Central Tendency identify the single central summary value that best represents an entire distribution.';
      customWhy = 'When data has extreme skew or executive outliers, Median represents typical customer experience better than Mean.';
      customMicroQ = 'If 9 employees earn $50,000 and the CEO earns $5,000,000, which metric best represents the typical employee earnings?';
      customMicroOpts = ['Median', 'Mean', 'Variance', 'Range'];
    } else if (topicSlug.includes('dispersion') || topicSlug.includes('variance')) {
      customFormula = 'Variance (\u03C3\u00B2) = \u03A3(x - \u03BC)\u00B2 / N | Standard Deviation (\u03C3) = \u221A(\u03C3\u00B2)';
      customWhat = 'Measures of Dispersion measure how spread out or clustered data values are around the central mean.';
      customWhy = 'Two products can have the same average sales of $10,000, but one with high variance is risky and volatile.';
      customMicroQ = 'What is the mathematical relationship between Variance and Standard Deviation?';
      customMicroOpts = ['Standard Deviation is the square root of Variance', 'Variance is the square root of Standard Deviation', 'They are always identical', 'Variance is divided by 2'];
    } else if (topicSlug.includes('percentiles') || topicSlug.includes('iqr')) {
      customFormula = 'IQR = Q3 (75th Percentile) - Q1 (25th Percentile) | Outlier Rule: < Q1 - 1.5*IQR or > Q3 + 1.5*IQR';
      customWhat = 'Percentiles divide sorted distributions into 100 slices. The Interquartile Range (IQR) spans the middle 50% of data.';
      customWhy = 'The 1.5 * IQR rule is the industry standard statistical technique used by analysts to detect fraud and data anomalies.';
    } else if (topicSlug.includes('normal-distribution') || topicSlug.includes('zscore')) {
      customFormula = 'Z-Score = (X - \u03BC) / \u03C3 | Empirical Rule: 68% within \u00B11\u03C3, 95% within \u00B12\u03C3, 99.7% within \u00B13\u03C3';
      customWhat = 'The Normal Distribution is a symmetrical bell-shaped curve where Mean = Median = Mode, and Z-Score measures distances in standard deviations.';
      customWhy = 'Z-scores standardize metrics across different scales (e.g. comparing customer engagement score vs purchase amounts).';
      customMicroQ = 'According to the Empirical 68-95-99.7 Rule, what percentage of values fall within \u00B12 standard deviations of the mean in a Normal distribution?';
      customMicroOpts = ['Approximately 95%', 'Approximately 68%', 'Approximately 99.7%', '100%'];
    } else if (topicSlug.includes('probability')) {
      customFormula = 'P(A) = Favorable Outcomes / Total Outcomes | P(A or B) = P(A) + P(B) - P(A and B)';
      customWhat = 'Probability quantifies the likelihood (from 0 to 1) of an event occurring in a business environment.';
      customWhy = 'Conversion rate optimization, customer churn risk modeling, and A/B test analysis all rely on probability mathematics.';
    } else if (topicSlug.includes('sampling') || topicSlug.includes('clt')) {
      customFormula = 'Central Limit Theorem: Sample Means distribution approaches Normal as N \u2265 30, with SE = \u03C3 / \u221An';
      customWhat = 'The Central Limit Theorem (CLT) proves that sample means form a normal distribution regardless of population shape.';
      customWhy = 'CLT enables analysts to make confident inferences about millions of customers from a sample of just 1,000 respondents.';
    } else if (topicSlug.includes('correlation') || topicSlug.includes('covariance')) {
      customFormula = 'Pearson r = Cov(X,Y) / (\u03C3X * \u03C3Y) | Range: -1.0 (Strong Negative) to +1.0 (Strong Positive)';
      customWhat = 'Correlation measures the strength and direction of a linear relationship between two continuous numeric variables.';
      customWhy = 'Revealing strong correlations (e.g. Ad Spend vs Monthly Orders) helps leadership invest capital effectively.';
      customMicroQ = 'Does a strong positive correlation (e.g. r = 0.89) between marketing spend and sales prove that marketing directly caused the sales?';
      customMicroOpts = ['No, correlation indicates relationship but does not prove causation', 'Yes, high r always proves direct causation', 'Only if the value of r is exactly 1.0', 'No, correlation is only used for negative numbers'];
    } else if (topicSlug.includes('linear-regression')) {
      customFormula = 'y = \u03B20 + \u03B21*x + \u03B5 | R\u00B2 = Explained Variance / Total Variance';
      customWhat = 'Simple Linear Regression models the linear dependency of an outcome (Y) on an explanatory predictor variable (X).';
      customWhy = 'Analysts use regression equations to forecast quarterly revenue based on marketing headcount or ad budgets.';
    } else if (topicSlug.includes('hypothesis') || topicSlug.includes('ttest') || topicSlug.includes('p-value')) {
      customFormula = 'H0: No Difference (Null) | H1: Significant Effect | If p-value < \u03B1 (0.05) ➔ Reject H0';
      customWhat = 'Hypothesis testing tests whether an observed business metric change (e.g. higher A/B test conversion) is statistically significant.';
      customWhy = 'Testing prevents product managers from declaring victory on website redesigns when revenue shifts were just random luck.';
      customMicroQ = 'What decision should a Data Analyst make if an A/B test produces a p-value of 0.02 with an alpha threshold of 0.05?';
      customMicroOpts = ['Reject the Null Hypothesis (H0) as the result is statistically significant', 'Accept the Null Hypothesis as the result is random', 'Discard the test data and re-run', 'Declare the test inconclusive'];
    }

    return {
      topicId: topicSlug,
      topicTitle: cleanTitle,
      domainType: 'STATISTICS',
      isCodeTopic: false,
      estimatedStudyTimeMinutes: 20,
      careerTitle: careerTitle || 'Data Analyst',
      skillTitle: skillTitle || 'Statistics for Analytics',
      levelTitle: levelTitle || 'LEVEL 1 — STATISTICAL FOUNDATIONS',
      learningObjectives: [
        `✓ Understand core statistical concepts and mathematical intuition of ${cleanTitle}`,
        `✓ Apply ${cleanTitle} to realistic business datasets (sales, conversion rates, customer spend)`,
        `✓ Interpret statistical results accurately and communicate findings to non-technical stakeholders`,
        `✓ Avoid common statistical fallacies, outlier biases, and p-hacking mistakes`,
      ],
      realWorldStory: {
        familiarContext: `Imagine an e-commerce executive who sees average order values increase from $45 to $52 after a checkout redesign. A Data Analyst applies ${cleanTitle} to verify if this growth is statistically significant or merely random daily variance.`,
        whyItMatters: `Statistics provides the empirical foundation for all modern data-driven decision making, A/B testing, and predictive forecasting.`,
      },
      lessons: [
        {
          lessonId: `${topicSlug}-les-1`,
          lessonNumber: 1,
          title: `Core Principles of ${cleanTitle}`,
          whatIsIt: customWhat,
          whyDoWeUseIt: customWhy,
          howDoesItWork: `Statistical algorithms compute metrics across sample observations to estimate population parameters and quantify uncertainty.`,
          syntax: customFormula,
          syntaxParts: [
            { part: 'Statistical Measure / Notation', explanation: 'Symbolic representation and formula components' },
            { part: 'Sample Observations (n)', explanation: 'Empirical data points collected from business events' },
            { part: 'Decision Rule / Interpretation', explanation: 'Threshold criterion used to accept or reject business hypotheses' },
          ],
          mandatoryMicroCheck: {
            question: customMicroQ,
            options: customMicroOpts,
            correctOptionIndex: 0,
            optionExplanations: customMicroExp,
          },
          spreadsheetVisual: {
            title: 'Statistical Dataset Representation — Customer Purchase Value Analysis',
            headers: ['Customer_ID', 'Age', 'Orders_Count', 'Total_Spend ($)'],
            rows: [
              { Customer_ID: 'C-101', Age: 24, Orders_Count: 3, 'Total_Spend ($)': 150 },
              { Customer_ID: 'C-102', Age: 31, Orders_Count: 8, 'Total_Spend ($)': 520 },
              { Customer_ID: 'C-103', Age: 45, Orders_Count: 12, 'Total_Spend ($)': 1200 },
              { Customer_ID: 'C-104', Age: 29, Orders_Count: 4, 'Total_Spend ($)': 210 },
            ],
            targetCell: 'Statistical Metric Output',
            formulaEntered: customFormula.split('|')[0].trim(),
            evaluatedResult: 'Metric calculated successfully. Statistical distribution verified.',
            explanation: 'Statistical formulas process numerical columns to summarize central tendency, dispersion, or correlation.',
          },
          guidedPractice: {
            scenario: `You are analyzing customer transaction records for an e-commerce platform. You need to apply ${cleanTitle} to understand metric behavior.`,
            question: `What is the primary analytical objective when calculating ${cleanTitle}?`,
            options: [
              'Extract actionable business signals and measure variance accurately',
              'Increase spreadsheet calculation time',
              'Delete unformatted table rows',
              'Hardcode arbitrary constants',
            ],
            correctOptionIndex: 0,
            explanation: 'Correct! Proper statistical modeling uncovers true patterns while measuring variance and uncertainty.',
          },
          userPractice: {
            taskDescription: `Type the primary statistical term used to represent the central mathematical average.`,
            placeholder: `Type statistical term (e.g. Mean)`,
            expectedInput: ['Mean', 'mean', 'MEAN', 'Average', 'average', 'Median', 'median'],
            hints: [`Type "Mean" or "Median"`],
            successMessage: `🎉 Spot on! Central metrics provide the foundational anchor for statistical analysis.`,
            errorMessage: `❌ Double-check spelling: M-E-A-N`,
          },
          progressiveExamples: [
            {
              level: 'Very Easy',
              title: `Foundational ${cleanTitle} Example`,
              representation: customFormula,
              stepByStep: ['Inspects raw sample distribution.', 'Applies statistical formula step-by-step.'],
            },
            {
              level: 'Realistic',
              title: `Retail Sales Analysis Scenario`,
              representation: `Dataset: [120, 150, 190, 210, 850]\nCalculation: ${customFormula.split('|')[0]}`,
              stepByStep: ['Identifies distribution spread and potential outliers.', 'Interprets metric for executive sales reporting.'],
            },
            {
              level: 'Practical',
              title: `Enterprise Analytical Inference`,
              representation: `Statistical Model: ${customFormula}\nApplication: A/B Testing & Customer Lifetime Value Analysis`,
              stepByStep: ['Validates distribution assumptions.', 'Derives confident statistical conclusions to guide product strategy.'],
            },
          ],
          commonMistakes: [
            'Using the Mean instead of Median when data contains extreme skewed outliers',
            'Assuming correlation implies direct cause-and-effect causation',
            'Failing to verify sample size adequacy (N >= 30) before applying the Central Limit Theorem',
            'Misinterpreting a p-value as the probability that the Null Hypothesis is true',
          ],
          yourTurnPractice: {
            taskDescription: `Practice calculating ${cleanTitle} on sample sales numbers.`,
            hint: `Sort values in ascending order first when calculating median, quartiles, or percentiles.`,
          },
          quickCheck: {
            question: `Why is checking data dispersion (variance and standard deviation) just as important as checking the mean?`,
            options: [
              'Because two datasets can share identical means while having vastly different risk and volatility spreads',
              'Because variance changes the font style of reports',
            ],
            correctOptionIndex: 0,
            optionExplanations: { 0: 'Correct! Dispersion reveals whether numbers are tightly clustered or unpredictably scattered.' },
          },
          keyTakeaways: [`Mastering ${cleanTitle} empowers you to make defensible, statistically sound business recommendations.`],
        },
      ],
      topicRecap: {
        importantConcepts: [`Core statistical framework of ${cleanTitle}`],
        importantTerms: [`Distribution: The mathematical spread and frequency of observed data points`],
        keyRules: ['Always visualize distributions with histograms or boxplots before choosing parametric formulas.'],
        commonMistakes: ['Overlooking outliers and confusing correlation with causation'],
        practicalTakeaway: `${cleanTitle} is a vital competency for elite Data Analysts.`,
      },
    };
  }

  // Dynamic Socratic Lesson Generator for Excel Topics
  const isExcel = domainType === 'EXCEL' || topicSlug.startsWith('excel-');
  if (isExcel) {
    let customFormula = '=SUM(B2:B10)';
    let customWhat = 'Excel is the world standard analytical spreadsheet software for calculating formulas, organizing data, and building pivot summaries.';
    let customWhy = 'Companies of all sizes rely on Excel for quick ad-hoc analysis, financial modeling, and operational KPI tracking.';
    let customMicroQ = 'In Excel formulas, what character must always be typed first to signal that a cell contains a formula rather than plain text?';
    let customMicroOpts = ['= (Equal sign)', '+ (Plus sign)', '@ (At sign)', '# (Hash sign)'];
    let customMicroExp: Record<number, string> = {
      0: 'Correct! All Excel formulas and functions must begin with an equal sign (=).',
      1: 'Incorrect. While + can initiate a formula in legacy mode, = is the standard syntax.',
      2: 'Incorrect. @ is used for implicit intersection or email text, not formula initiation.',
      3: 'Incorrect. # denotes error values (e.g. #N/A) or table references.',
    };

    if (topicSlug.includes('essential-formulas') || topicSlug.includes('formulas')) {
      customFormula = '=SUM(C2:C20) | =AVERAGE(C2:C20) | =COUNT(C2:C20) | =MAX(C2:C20) | =MIN(C2:C20)';
      customWhat = 'Essential functions (SUM, AVERAGE, COUNT, COUNTA, MIN, MAX) perform core mathematical and aggregate calculations over ranges.';
      customWhy = 'Aggregate functions automate total revenue calculations, average deal sizes, and transaction counts in seconds.';
      customMicroQ = 'Which Excel function counts cells containing numbers while ignoring empty cells and text strings?';
      customMicroOpts = ['COUNT', 'COUNTA', 'COUNTIF', 'SUM'];
    } else if (topicSlug.includes('math-stats')) {
      customFormula = '=ROUND(B2, 2) | =CEILING(B2, 5) | =MEDIAN(B2:B20) | =STDEV.S(B2:B20)';
      customWhat = 'Math and statistical functions (ROUND, INT, MEDIAN, STDEV.S) round numbers and measure dataset distributions.';
      customWhy = 'Financial reports require standardized rounding (e.g. 2 decimal cents) to prevent rounding discrepancy errors.';
    } else if (topicSlug.includes('text-functions')) {
      customFormula = '=TRIM(A2) | =PROPER(A2) | =CONCATENATE(A2, " ", B2) | =TEXTSPLIT(A2, ",") | =LEFT(A2, 4)';
      customWhat = 'Text functions (TRIM, PROPER, UPPER, LOWER, LEFT, RIGHT, MID, CONCAT) clean messy text and extract substrings.';
      customWhy = 'Real business data contains extra spaces, inconsistent casing, and combined strings that must be cleaned for reporting.';
      customMicroQ = 'Which Excel text function removes all extra spaces from a text string except for single spaces between words?';
      customMicroOpts = ['TRIM', 'CLEAN', 'SUBSTITUTE', 'PROPER'];
    } else if (topicSlug.includes('date-time')) {
      customFormula = '=TODAY() | =NOW() | =DATEDIF(A2, B2, "D") | =EDATE(A2, 3) | =YEAR(A2)';
      customWhat = 'Date & Time functions (TODAY, DATEDIF, EDATE, YEAR, MONTH) calculate durations, aging schedules, and deadlines.';
      customWhy = 'Calculating customer account tenure, loan maturity dates, and invoice payment aging relies on date math.';
    } else if (topicSlug.includes('ifs') || topicSlug.includes('if-formula')) {
      customFormula = '=IF(C2 >= 1000, "High Value", "Standard") | =IFS(C2>=1000,"Tier 1", C2>=500,"Tier 2", TRUE,"Tier 3")';
      customWhat = 'Logical functions (IF, Nested IF, IFS, AND, OR) evaluate conditional rules and return custom outcomes accordingly.';
      customWhy = 'Automating business logic (e.g. commission tiers or discount eligibility) eliminates manual row-by-row categorization.';
      customMicroQ = 'How many arguments does a standard Excel IF function accept: IF(logical_test, value_if_true, value_if_false)?';
      customMicroOpts = ['3 Arguments', '2 Arguments', '1 Argument', '4 Arguments'];
    } else if (topicSlug.includes('conditional-formatting')) {
      customFormula = 'Home ➔ Conditional Formatting ➔ Highlight Cell Rules / Data Bars / Color Scales';
      customWhat = 'Conditional Formatting dynamically formats cell colors, borders, and data bars based on underlying cell values.';
      customWhy = 'Visual color coding allows managers to spot revenue drops or high-risk accounts in under 2 seconds.';
    } else if (topicSlug.includes('sorting-filtering')) {
      customFormula = 'Data ➔ Sort (A to Z / Multi-Level) | Data ➔ Filter (Ctrl + Shift + L)';
      customWhat = 'Sorting reorders rows by numerical or alphabetical criteria, while Filtering hides rows that do not match criteria.';
      customWhy = 'Data Analysts sort tables to find top-performing products and filter data to investigate specific regional anomalies.';
    } else if (topicSlug.includes('data-validation')) {
      customFormula = 'Data ➔ Data Validation ➔ Allow: List ➔ Source: =Categories!$A$2:$A$10';
      customWhat = 'Data Validation restricts user cell inputs to predefined drop-down lists, valid date ranges, or numeric boundaries.';
      customWhy = 'Enforcing drop-down validation prevents typos and data entry errors that break downstream formulas.';
    } else if (topicSlug.includes('cleaning')) {
      customFormula = 'Data ➔ Remove Duplicates | Text to Columns (Delimited / Fixed Width) | Flash Fill (Ctrl + E)';
      customWhat = 'Data cleaning tools standardize messy exports by eliminating duplicate rows and splitting combined full names.';
      customWhy = 'Analysts spend 60%+ of their time preparing data; mastering cleaning tools accelerates analytical workflows.';
    } else if (topicSlug.includes('xlookup') || topicSlug.includes('vlookup') || topicSlug.includes('lookup')) {
      customFormula = '=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode])';
      customWhat = 'Lookup functions (XLOOKUP, VLOOKUP, INDEX/MATCH) search for a key in one table and retrieve matching values from another.';
      customWhy = 'Connecting transaction IDs with product pricing tables is the most common technical interview task for Data Analysts.';
      customMicroQ = 'What is the primary advantage of XLOOKUP over legacy VLOOKUP?';
      customMicroOpts = [
        'XLOOKUP can search to the left, defaults to exact match, and does not break when columns are inserted',
        'XLOOKUP only works on numbers',
        'XLOOKUP requires sorting the table in ascending order',
        'VLOOKUP is faster in all modern Excel versions',
      ];
    } else if (topicSlug.includes('pivots') || topicSlug.includes('pivot')) {
      customFormula = 'Insert ➔ PivotTable ➔ Rows: Region | Columns: Year | Values: Sum of Sales | Filters / Slicers';
      customWhat = 'Pivot Tables summarize thousands of transaction rows into interactive multidimensional cross-tabulations in clicks.';
      customWhy = 'Pivot Tables answer executive business questions (e.g. total revenue by department per quarter) in under 10 seconds.';
    } else if (topicSlug.includes('power-pivot')) {
      customFormula = 'Power Pivot ➔ Manage Data Model ➔ Diagram View (1:N Relationships) ➔ DAX Calculated Measures';
      customWhat = 'Power Pivot integrates an in-memory database engine inside Excel to model multi-table relationships and DAX measures.';
      customWhy = 'Handles 10M+ rows and replaces thousands of slow VLOOKUP formulas with clean Star Schema relationships.';
    } else if (topicSlug.includes('modern-features') || topicSlug.includes('dynamic-array')) {
      customFormula = '=UNIQUE(A2:A100) | =SORT(A2:B100, 2, -1) | =FILTER(A2:C100, C2:C100 > 1000)';
      customWhat = 'Modern Dynamic Array formulas (UNIQUE, SORT, FILTER, XMATCH) spill results across adjacent cells automatically.';
      customWhy = 'Dynamic arrays eliminate tedious manual formula copying and create self-updating summary dashboards.';
    }

    return {
      topicId: topicSlug,
      topicTitle: cleanTitle,
      domainType: 'EXCEL',
      isCodeTopic: false,
      estimatedStudyTimeMinutes: 20,
      careerTitle: careerTitle || 'Data Analyst',
      skillTitle: skillTitle || 'Excel Analytics',
      levelTitle: levelTitle || 'LEVEL 1 — EXCEL ESSENTIALS',
      learningObjectives: [
        `✓ Understand core principles and formula syntax rules of ${cleanTitle}`,
        `✓ Apply ${cleanTitle} to realistic spreadsheet datasets with accurate cell referencing`,
        `✓ Build efficient, automated Excel formulas that update dynamically as data changes`,
        `✓ Avoid common spreadsheet errors (#N/A, #VALUE!, #REF!, circular references)`,
      ],
      realWorldStory: {
        familiarContext: `Imagine managing an e-commerce sales ledger with 5,000 monthly transactions. Instead of manually calculating numbers, you apply ${cleanTitle} to automate your calculations in seconds.`,
        whyItMatters: `Excel is the most widely used enterprise analytics tool in the world, with over 1 billion users across global commerce.`,
      },
      lessons: [
        {
          lessonId: `${topicSlug}-les-1`,
          lessonNumber: 1,
          title: `Mastering ${cleanTitle}`,
          whatIsIt: customWhat,
          whyDoWeUseIt: customWhy,
          howDoesItWork: `Excel recalculation engine parses cell coordinates, evaluates functional logic, and updates outputs dynamically across the grid.`,
          syntax: customFormula,
          syntaxParts: [
            { part: 'Function Name (e.g. SUM, IF, XLOOKUP)', explanation: 'Identifies the calculation operation for Excel to perform' },
            { part: 'Range / Arguments (e.g. A2:A10)', explanation: 'Cell coordinates or values passed into the function' },
            { part: 'Absolute References ($A$1)', explanation: 'Locks column and row coordinates so formulas can be dragged safely' },
          ],
          mandatoryMicroCheck: {
            question: customMicroQ,
            options: customMicroOpts,
            correctOptionIndex: 0,
            optionExplanations: customMicroExp,
          },
          spreadsheetVisual: {
            title: 'Excel Grid Representation — Sales & Inventory Analysis',
            headers: ['A (Product)', 'B (Category)', 'C (Units)', 'D (Price)', 'E (Total)'],
            rows: [
              { 'A (Product)': 'Laptop Pro', 'B (Category)': 'Electronics', 'C (Units)': 15, 'D (Price)': '$1,200', 'E (Total)': '$18,000' },
              { 'A (Product)': 'Wireless Mouse', 'B (Category)': 'Accessories', 'C (Units)': 45, 'D (Price)': '$25', 'E (Total)': '$1,125' },
              { 'A (Product)': 'Desk Monitor', 'B (Category)': 'Electronics', 'C (Units)': 20, 'D (Price)': '$300', 'E (Total)': '$6,000' },
            ],
            targetCell: 'Cell E2 / Output',
            formulaEntered: customFormula.split('|')[0].trim(),
            evaluatedResult: 'Formula evaluated successfully. Output displayed in grid.',
            explanation: 'Excel calculates the formula dynamically based on the referenced range values.',
          },
          guidedPractice: {
            scenario: `You are reviewing a company sales worksheet. You need to apply ${cleanTitle} to calculate clean business metrics.`,
            question: `What is the best practice when writing formulas with ${cleanTitle} in Excel?`,
            options: [
              'Use cell references (e.g. B2) rather than hardcoded static numbers',
              'Type hardcoded static numbers into every cell',
              'Delete table column headers',
              'Hide error values without fixing the underlying formula',
            ],
            correctOptionIndex: 0,
            explanation: 'Correct! Using cell references allows formulas to update automatically when source numbers change.',
          },
          userPractice: {
            taskDescription: `Type the formula used to calculate the sum of numbers in cells B2 to B10.`,
            placeholder: `=SUM(B2:B10)`,
            expectedInput: ['=SUM(B2:B10)', 'SUM(B2:B10)', '=sum(b2:b10)', 'sum(b2:b10)', '=SUM(B2: B10)'],
            hints: [`Start with =SUM( followed by the range B2:B10 and closing parenthesis )`,`Syntax: =SUM(B2:B10)`],
            successMessage: `🎉 Spot on! =SUM(B2:B10) is the foundational formula for Excel totals.`,
            errorMessage: `❌ Remember the syntax: =SUM(B2:B10)`,
          },
          progressiveExamples: [
            {
              level: 'Very Easy',
              title: `Basic Formula Application`,
              representation: customFormula,
              stepByStep: ['Selects target output cell.', 'Types the formula and presses Enter to evaluate.'],
            },
            {
              level: 'Realistic',
              title: `Business Reporting Table`,
              representation: `Formula: ${customFormula.split('|')[0].trim()}\nRange: Regional Sales Report (Columns A to E)`,
              stepByStep: ['References multiple column ranges.', 'Locks ranges with $ absolute references for dragging down.'],
            },
            {
              level: 'Practical',
              title: `Production Enterprise Model`,
              representation: `Enterprise Template: ${customFormula}\nApplication: Automated Monthly Executive P&L Dashboard`,
              stepByStep: ['Combines multiple functions with error handling (IFERROR).', 'Delivers clean dynamic reports for executive leadership.'],
            },
          ],
          commonMistakes: [
            'Forgetting the equal sign (=) at the beginning of the formula',
            'Missing absolute reference dollar signs ($) when copying formulas down a column',
            'Passing mismatched range sizes in multi-criteria formulas (e.g. SUMIFS)',
            'Mixing text strings with numerical columns resulting in #VALUE! errors',
          ],
          yourTurnPractice: {
            taskDescription: `Practice entering your formula for ${cleanTitle} in the practice box.`,
            hint: `Double-check parenthesis matching and verify range coordinates.`,
          },
          quickCheck: {
            question: `Why are dynamic formulas preferred over hardcoded static calculations in Excel?`,
            options: [
              'Because formulas automatically recalculate whenever source input numbers are updated or edited',
              'Because formulas increase printer resolution',
            ],
            correctOptionIndex: 0,
            optionExplanations: { 0: 'Correct! Dynamic formulas guarantee live accuracy without manual recalculation.' },
          },
          keyTakeaways: [`Mastering ${cleanTitle} enables you to build automated, audit-proof spreadsheet models.`],
        },
      ],
      topicRecap: {
        importantConcepts: [`Core formula architecture of ${cleanTitle}`],
        importantTerms: [`Cell Reference: The coordinate identifier (e.g. B4) pointing to a grid cell`],
        keyRules: ['Always test formula edge cases with zero, blank, and negative numbers.'],
        commonMistakes: ['Syntax errors, missing parenthesis, and hardcoding constants'],
        practicalTakeaway: `${cleanTitle} is a daily essential skill for Data Analysts.`,
      },
    };
  }

  // Universal Fallback for any other custom topic
  return {
    topicId: topicSlug,
    topicTitle: cleanTitle,
    domainType: domainType || 'GENERAL',
    isCodeTopic: false,
    estimatedStudyTimeMinutes: 20,
    careerTitle: careerTitle || 'Data Analyst',
    skillTitle: skillTitle || 'Core Analytical Skill',
    levelTitle: levelTitle || 'LEVEL 1 — FOUNDATIONS',
    learningObjectives: [
      `✓ Understand core principles and industry best practices of ${cleanTitle}`,
      `✓ Apply analytical workflows and techniques to realistic business data`,
      `✓ Master practical problem-solving methods relevant to Data Analyst roles`,
      `✓ Identify and avoid common beginner mistakes and data misinterpretations`,
    ],
    realWorldStory: {
      familiarContext: `In enterprise business analytics, mastering ${cleanTitle} enables teams to process data reliably, uncover meaningful insights, and communicate findings to stakeholders.`,
      whyItMatters: `Foundational competence in ${cleanTitle} is essential for passing technical assessments and succeeding in real-world data roles.`,
    },
    lessons: [
      {
        lessonId: `${topicSlug}-les-1`,
        lessonNumber: 1,
        title: `Mastering ${cleanTitle}`,
        whatIsIt: `${cleanTitle} is an essential technical concept used by Data Analysts to analyze, model, and report on business data.`,
        whyDoWeUseIt: `Organizations use ${cleanTitle} to streamline workflows, eliminate manual human error, and deliver accurate reporting.`,
        howDoesItWork: `Analytical tools process structured inputs according to established logic rules and return validated data insights.`,
        syntax: `// Applied Workflow: ${cleanTitle}`,
        syntaxParts: [
          { part: 'Concept / Core Rule', explanation: 'Foundational principle governing the analytical technique' },
          { part: 'Input Data / Parameters', explanation: 'Target business observations and values being analyzed' },
          { part: 'Evaluated Outcome', explanation: 'Resulting insight, metric, or structured visualization' },
        ],
        mandatoryMicroCheck: {
          question: `What is the primary benefit of mastering ${cleanTitle} in data analytics?`,
          options: [
            `Enables structured, reliable, and repeatable analysis of business data`,
            'Deletes important workbook files',
            'Forces hardcoded calculations',
            'Reduces report readability',
          ],
          correctOptionIndex: 0,
          optionExplanations: {
            0: `Correct! ${cleanTitle} delivers structured, reliable analytical results.`,
            1: 'Incorrect.',
            2: 'Incorrect.',
            3: 'Incorrect.',
          },
        },
        spreadsheetVisual: {
          title: `Analytical Dataset Representation — ${cleanTitle}`,
          headers: ['Metric_ID', 'Dimension', 'Observed_Value', 'Target_Benchmark'],
          rows: [
            { Metric_ID: 'M-01', Dimension: 'North', Observed_Value: 1450, Target_Benchmark: 1200 },
            { Metric_ID: 'M-02', Dimension: 'South', Observed_Value: 980, Target_Benchmark: 1000 },
            { Metric_ID: 'M-03', Dimension: 'East', Observed_Value: 2150, Target_Benchmark: 1800 },
          ],
          targetCell: 'Output / Benchmark',
          formulaEntered: `=EVALUATE(${cleanTitle})`,
          evaluatedResult: 'Metric processed successfully. Target achieved.',
          explanation: 'Structured data records are processed to compare performance against business benchmarks.',
        },
        guidedPractice: {
          scenario: `You are assigned to evaluate an analytical business dataset. You need to apply ${cleanTitle} accurately.`,
          question: `What is the most important step before drawing conclusions using ${cleanTitle}?`,
          options: [
            'Verify input data quality, formats, and structural assumptions',
            'Delete all formula cells',
            'Ignore outlier observations',
            'Hardcode static final numbers',
          ],
          correctOptionIndex: 0,
          explanation: 'Correct! Verifying input data quality ensures downstream analysis is valid and accurate.',
        },
        userPractice: {
          taskDescription: `Type the name of the topic you are currently mastering.`,
          placeholder: cleanTitle,
          expectedInput: [cleanTitle, cleanTitle.toLowerCase(), topicSlug, 'data', 'analysis'],
          hints: [`Type ${cleanTitle}`],
          successMessage: `🎉 Excellent! You have completed the practice requirement for ${cleanTitle}.`,
          errorMessage: `❌ Double-check your spelling.`,
        },
        progressiveExamples: [
          {
            level: 'Very Easy',
            title: `Foundational Overview`,
            representation: `Concept: ${cleanTitle}\nStatus: Active Learning`,
            stepByStep: ['Understands core principles.', 'Reviews essential syntax and rules.'],
          },
          {
            level: 'Realistic',
            title: `Practical Application`,
            representation: `Workflow: ${cleanTitle} applied to retail transactions`,
            stepByStep: ['Inspects input records.', 'Produces clean summary metrics.'],
          },
          {
            level: 'Practical',
            title: `Enterprise Analytics`,
            representation: `Enterprise standard execution for ${cleanTitle}`,
            stepByStep: ['Integrates with production data pipelines.', 'Delivers executive-ready data artifacts.'],
          },
        ],
        commonMistakes: [
          'Skipping input validation before running analysis',
          'Misinterpreting metrics without business context',
        ],
        yourTurnPractice: {
          taskDescription: `Practice applying ${cleanTitle} concepts to practical datasets.`,
          hint: `Review the learning objectives above before proceeding to the formal test.`,
        },
        quickCheck: {
          question: `Why is systematic mastery of ${cleanTitle} important for a Data Analyst career?`,
          options: [
            'Builds confidence, deep technical competence, and interview readiness',
            'Changes computer volume settings',
          ],
          correctOptionIndex: 0,
          optionExplanations: { 0: 'Correct! Systematic practice builds genuine technical capability.' },
        },
        keyTakeaways: [`Mastering ${cleanTitle} brings you one step closer to becoming a job-ready Data Analyst.`],
      },
    ],
    topicRecap: {
      importantConcepts: [`Core analytical principles of ${cleanTitle}`],
      importantTerms: [`Analytical Rigor: Applying disciplined logic to empirical business questions`],
      keyRules: ['Always document assumptions and verify calculation accuracy.'],
      commonMistakes: ['Rushing through analysis without validating data quality'],
      practicalTakeaway: `${cleanTitle} is a valuable milestone in your career journey.`,
    },
  };
}
