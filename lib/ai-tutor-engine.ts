import { LearningLanguage } from './topic-content-engine';

export interface AITutorContext {
  careerTitle: string;
  skillTitle: string;
  levelTitle: string;
  topicTitle: string;
  topicSlug: string;
  currentLessonTitle: string;
  lessonContentSummary: string;
  language: LearningLanguage;
  isCodeTopic: boolean;
  domainType: string;
}

export interface ChatMessage {
  id: string;
  sender: 'tutor' | 'student';
  text: string;
  timestamp: string;
}

/**
 * Normalizes and determines the primary domain lock.
 */
function resolvePrimaryDomain(
  context: AITutorContext
): 'EXCEL' | 'SQL' | 'STATISTICS' | 'POWERBI' | 'PYTHON' | 'WEB_DEV' | 'GENERAL' {
  const skill = (context.skillTitle || '').toLowerCase();
  const topic = (context.topicTitle || '').toLowerCase();
  const domain = (context.domainType || '').toLowerCase();

  if (
    domain.includes('web') ||
    skill.includes('html') ||
    skill.includes('css') ||
    skill.includes('js') ||
    skill.includes('react') ||
    skill.includes('node') ||
    skill.includes('git')
  ) {
    return 'WEB_DEV';
  }
  if (skill.includes('stat') || topic.includes('stat') || domain.includes('stat')) {
    return 'STATISTICS';
  }
  if (skill.includes('excel') || topic.includes('excel') || domain.includes('excel')) {
    return 'EXCEL';
  }
  if (skill.includes('sql') || topic.includes('sql') || domain.includes('sql')) {
    return 'SQL';
  }
  if (skill.includes('power') || topic.includes('power') || domain.includes('powerbi')) {
    return 'POWERBI';
  }
  if (skill.includes('python') || topic.includes('python') || domain.includes('python') || topic.includes('pandas')) {
    return 'PYTHON';
  }
  return 'GENERAL';
}

/**
 * Local-First Socratic AI Tutor Reply Engine.
 * Evaluates queries without external LLMs using deterministic Socratic prompts,
 * concept breakdowns, syntax guides, and multilingual responses (EN, HI, Hinglish).
 */
export function generateSocraticTutorReply(
  userQuery: string,
  context: AITutorContext,
  history: ChatMessage[] = []
): string {
  const queryLower = userQuery.toLowerCase().trim();
  const lang = context.language || 'en';
  const topicTitle = context.topicTitle || 'this topic';
  const currentLesson = context.currentLessonTitle || 'Current Lesson';
  const skillTitle = context.skillTitle || 'Current Skill';
  const activeDomain = resolvePrimaryDomain(context);

  // ----------------------------------------------------------------------
  // 1. SPECIFIC SOCRATIC RESPONSES (Prompt Section 22 Guidelines)
  // ----------------------------------------------------------------------

  // VLOOKUP / XLOOKUP Socratic dialogue
  if (queryLower.includes('vlookup') || queryLower.includes('xlookup')) {
    if (lang === 'hi') {
      return `इसकी परिभाषा से पहले ज़रा यह सोचिए:\n\nअगर आपके पास **Product ID** है और आपको दूसरी टेबल से उसकी **कीमत (Price)** ढूंढनी है, तो आप किस मान (Value) के आधार पर खोज करेंगे?\n\nयही VLOOKUP का पहला नियम है: जिस मान को खोजना है, वह टेबल के सबसे पहले कॉलम में होना चाहिए।\n\n\`\`\`excel\n=VLOOKUP(lookup_value, table_array, col_index_num, FALSE)\n\`\`\``;
    }
    if (lang === 'hinglish') {
      return `Definition se pehle, zaroor ye sochiye:\n\nAgar aapke paas **Product ID** hai aur aapko doosri table se uska **Price** dhoondhna hai, toh aap kis value ke base par search karoge?\n\nExact yahi VLOOKUP ka core logic hai: Lookup Value table ke first column mein match hoti hai, aur specified column ka value fetch karti hai.\n\n\`\`\`excel\n=VLOOKUP(lookup_value, table_array, col_index_num, FALSE)\n\`\`\``;
    }
    return `Before we define it, think about this:\n\nIf you have a **Product ID** and want to find its **Price** from another table, what value would you search for?\n\nThat search key is your \`lookup_value\`. VLOOKUP scans the first column of the reference table and retrieves the matching value from your chosen column index:\n\n\`\`\`excel\n=VLOOKUP(lookup_value, table_array, col_index_num, FALSE)\n\`\`\`\n\nWhat lookup value are you working with in your current table?`;
  }

  // GROUP BY Socratic dialogue
  if (queryLower.includes('group by') || queryLower.includes('groupby')) {
    if (lang === 'hi') {
      return `कल्पना कीजिए कि आपके पास कई शहरों (Cities) के बिक्री आंकड़े (Sales Records) हैं।\n\nअगर हम एक ही शहर की सभी पंक्तियों को एक साथ समूहित (Group) कर दें, तो आप प्रत्येक शहर के लिए क्या गणना करेंगे: **SUM**, **COUNT**, या **AVG**?\n\n\`\`\`sql\nSELECT city, COUNT(*) AS orders, SUM(amount) AS total_revenue\nFROM sales\nGROUP BY city;\n\`\`\``;
    }
    if (lang === 'hinglish') {
      return `Imagine karein ki aapke paas bohot saare cities ke sales records hain.\n\nAgar hum same city wali sabhi rows ko ek saath group kar dein, toh aap har city ke liye kaunsa metric calculate karoge: **SUM**, **COUNT**, ya **AVG**?\n\n\`\`\`sql\nSELECT city, COUNT(*) AS orders, SUM(amount) AS total_revenue\nFROM sales\nGROUP BY city;\n\`\`\``;
    }
    return `Imagine you have sales records from many different cities.\n\nWhat would happen if we grouped all rows belonging to the same city together?\n\nWhich aggregated value would you then want to calculate: **SUM**, **COUNT**, or **AVG**?\n\n\`\`\`sql\nSELECT city, COUNT(*) AS total_orders, SUM(amount) AS total_sales\nFROM sales\nGROUP BY city;\n\`\`\`\n\nWhat column are you looking to group your data by right now?`;
  }

  // JOIN Socratic dialogue
  if (queryLower.includes('join') || queryLower.includes('inner join') || queryLower.includes('left join')) {
    if (lang === 'hi') {
      return `सोचिए आपके पास 2 टेबल्स हैं: **Customers** (नाम, पता) और **Orders** (ऑर्डर आईडी, रकम)।\n\nअगर किसी ग्राहक ने कभी कोई ऑर्डर नहीं दिया, क्या आप उसे रिपोर्ट में देखना चाहते हैं?\n- हाँ ➔ **LEFT JOIN**\n- सिर्फ वे जिन्होंने ऑर्डर दिया ➔ **INNER JOIN**`;
    }
    if (lang === 'hinglish') {
      return `Socho aapke paas 2 tables hain: **Customers** aur **Orders**.\n\nAgar kisi customer ne abhi tak koi order nahi kiya, kya aap usko report mein dekhna chahte hain?\n- Haan (saare customers chahiye) ➔ **LEFT JOIN**\n- Sirf wahi jinhone actual order kiya ➔ **INNER JOIN**`;
    }
    return `Think of having 2 tables: **Customers** and **Orders**.\n\nIf a customer registered but has not placed any orders yet, do you still want them in your final report?\n- YES (keep all customers even with no orders) ➔ Use **LEFT JOIN**\n- NO (only customers with completed orders) ➔ Use **INNER JOIN**\n\nWhich matching key (like \`customer_id\`) connects your two tables?`;
  }

  // MEAN vs MEDIAN Socratic dialogue
  if (queryLower.includes('mean') || queryLower.includes('median') || queryLower.includes('outlier')) {
    if (lang === 'hi') {
      return `एक उदाहरण सोचिए: एक कमरे में 4 लोग बैठे हैं जिनका वेतन ₹30,000 है। अचानक एलन मस्क कमरे में आ जाते हैं।\n\nऔसत (Mean) अचानक करोड़ों में पहुँच जाएगा! क्या यह बाकी 4 लोगों के वेतन का सही प्रतिनिधित्व है?\n\nयही कारण है कि जब आउटलायर्स (Outliers) होते हैं, तो डेटा एनालिस्ट **Median** का उपयोग करते हैं।`;
    }
    if (lang === 'hinglish') {
      return `Ek classic scenario socho: Ek room mein 4 log hain jinki salary ₹30,000 hai. Achanak Elon Musk room mein aa gaye.\n\nAvarage (Mean) ab crodon mein jump kar jayega! Kya ye normal salary ka sahi picture hai?\n\nNahi! Isliye jab extreme values (Outliers) hote hain, toh Analyst **Median** par bharosa karte hain.`;
    }
    return `Consider this scenario: 4 employees in a room each earn $40,000. Suddenly, a billionaire enters the room.\n\nThe mathematical **Mean** jumps into millions, but does that accurately describe normal employees?\n\nNo! This is why Data Analysts choose **Median** when datasets contain extreme outliers. Median represents the true 50th percentile midpoint.`;
  }

  // P-VALUE / HYPOTHESIS TESTING Socratic dialogue
  if (queryLower.includes('p-value') || queryLower.includes('hypothesis') || queryLower.includes('null hypothesis')) {
    if (lang === 'hi') {
      return `सोचिए कि आपने एक सिक्का 10 बार उछाला और 10 बार 'Heads' आया।\n\nक्या यह केवल संयोग (Random Luck) हो सकता है, या सिक्के में कोई गड़बड़ी है?\n\n**p-value** यही मापता है: "संयोग से ऐसा परिणाम आने की कितनी संभावना है?"\n- अगर p < 0.05 ➔ यह सिर्फ संयोग नहीं है, परिवर्तन वास्तविक है!`;
    }
    if (lang === 'hinglish') {
      return `Socho aapne ek coin 10 baar flip kiya aur 10 baar 'Heads' aaya.\n\nKya ye sirf kismat/coincidence ho sakta hai ya coin biased hai?\n\n**p-value** yahi measure karta hai: "Kya ye result sirf random chance se aaya hai?"\n- Agar p-value < 0.05 hai ➔ Coincidence reject ho gaya, effect real hai!`;
    }
    return `Imagine flipping a coin 10 times and getting 'Heads' every single time.\n\nCould this just be random luck, or is the coin loaded?\n\nThe **p-value** measures exactly this probability: "What is the chance this result happened by pure random chance?"\n- If p < 0.05 (less than 5% probability of fluke) ➔ Reject the Null Hypothesis! The observed difference is statistically significant.`;
  }

  // DAX CALCULATE / POWER BI Socratic dialogue
  if (queryLower.includes('calculate') || queryLower.includes('dax') || queryLower.includes('measure')) {
    if (lang === 'hi') {
      return `Power BI में **CALCULATE** को DAX का सबसे शक्तिशाली फ़ॉर्मूला माना जाता है।\n\nयह क्या करता है? यह किसी सामान्य गणना (जैसे Total Sales) को लागू करते समय **फ़िल्टर संदर्भ (Filter Context)** को बदल देता है:\n\n\`\`\`dax\nWestSales = CALCULATE(SUM(Sales[Amount]), Sales[Region] = "West")\n\`\`\``;
    }
    if (lang === 'hinglish') {
      return `Power BI mein **CALCULATE** DAX ka sabse powerful function hai.\n\nYe standard calculation (jaise SUM) ko evaluate karte waqt naya **Filter Context** apply karta hai:\n\n\`\`\`dax\nWestSales = CALCULATE(SUM(Sales[Amount]), Sales[Region] = "West")\n\`\`\``;
    }
    return `In Power BI, **CALCULATE** is the most powerful function because it alters the **Filter Context** under which an expression is evaluated:\n\n\`\`\`dax\nWestRevenue = CALCULATE(SUM(Sales[Amount]), Sales[Region] = "West")\n\`\`\`\n\nIt takes a measure or aggregation as argument 1, and applies overriding filters in subsequent arguments.`;
  }

  // PANDAS / PYTHON Socratic dialogue
  if (queryLower.includes('pandas') || queryLower.includes('dataframe') || queryLower.includes('.apply') || queryLower.includes('.loc')) {
    if (lang === 'hi') {
      return `Python Pandas में **DataFrame** को एक एक्सेल स्प्रेडशीट की तरह सोचिए जिसमें पंक्तियाँ (Rows) और कॉलम (Columns) होते हैं।\n\nअगर आपको सिर्फ 'Electronics' कैटेगरी का डेटा छांटना है:\n\`\`\`python\nelec_df = df[df['Category'] == 'Electronics']\n\`\`\``;
    }
    if (lang === 'hinglish') {
      return `Python Pandas mein **DataFrame** bilkul ek relational table ya Excel sheet ki tarah hota hai.\n\nAgar aapko specific rows filter karni hain:\n\`\`\`python\nelec_df = df[df['Category'] == 'Electronics']\n\`\`\``;
    }
    return `In Pandas, think of a **DataFrame** as an in-memory SQL table or spreadsheet.\n\nTo filter rows where a condition holds true, pass a boolean mask inside square brackets:\n\n\`\`\`python\nfiltered_df = df[df['Category'] == 'Electronics']\n\`\`\`\n\nWhat specific column are you trying to filter or aggregate?`;
  }

  // ----------------------------------------------------------------------
  // 2. FORMAL ASSESSMENT INTEGRITY PROTECTION
  // ----------------------------------------------------------------------
  if (
    queryLower.includes('test answer') ||
    queryLower.includes('assessment answer') ||
    queryLower.includes('give me answer for question') ||
    queryLower.includes('ans for q')
  ) {
    if (lang === 'hi') {
      return `मैं टेस्ट का सीधा उत्तर नहीं बता सकता, पर हिंट दे सकता हूँ!\n\n💡 **हिंट**: **${topicTitle} (${currentLesson})** के नियम याद करें। उत्तर चुनने से पहले सवाल की शर्त जांचें।`;
    }
    if (lang === 'hinglish') {
      return `Main direct test answer nahi bata sakta, par ek hint de sakta hoon!\n\n💡 **Hint**: **${topicTitle} (${currentLesson})** ka rule yaad karein. Option choose karne se pehle formula condition check karein.`;
    }
    return `I cannot reveal direct assessment answers, but here is a guiding hint!\n\n💡 **Hint**: Review the core syntax and principles of **${topicTitle} (${currentLesson})**. Break down the condition before selecting your answer.`;
  }

  // ----------------------------------------------------------------------
  // 3. CELL REFERENCE / VARIABLE EXPLANATION (e.g. "B2", "A1")
  // ----------------------------------------------------------------------
  if (queryLower.includes('b2') || queryLower.includes('a1') || queryLower.includes('cell') || queryLower.includes('column')) {
    if (activeDomain === 'EXCEL') {
      if (lang === 'hi') {
        return `एक्सेल में सेल रेफरेंस (जैसे **B2**):\n\n- **B**: कॉलम (Column B)\n- **2**: रो (Row 2)\n\nजब हम \`=IF(B2>=40, "Pass", "Fail")\` लिखते हैं, तो एक्सेल **B2 सेल के मान** को चेक करता है।`;
      }
      if (lang === 'hinglish') {
        return `Excel mein Cell Reference (jaise **B2**):\n\n- **B**: Column B\n- **2**: Row 2\n\nJab hum \`=IF(B2>=40, "Pass", "Fail")\` likhte hain, toh Excel **B2 cell ke value** ko test karta hai.`;
      }
      return `In Excel, a cell reference like **B2** points to Column B, Row 2.\n\nWhen writing a formula like \`=IF(B2>=40, "Pass", "Fail")\`, Excel dynamically inspects the value currently stored inside cell **B2**.`;
    }
  }

  // ----------------------------------------------------------------------
  // 4. SIMPLIFICATION & RE-EXPLANATION ("didn't understand", "simpler", "phir se")
  // ----------------------------------------------------------------------
  if (
    queryLower.includes('simpler') ||
    queryLower.includes('easy') ||
    queryLower.includes("didn't understand") ||
    queryLower.includes('samajh nahi') ||
    queryLower.includes('phir se') ||
    queryLower.includes('explain again')
  ) {
    if (lang === 'hi') {
      return `कोई बात नहीं! आइए **${currentLesson}** को बिल्कुल बुनियादी स्तर से समझते हैं:\n\n1. हम यह काम क्यों कर रहे हैं?\n2. इनपुट डेटा क्या है?\n3. कंप्यूटर को क्या निर्णय लेना है?\n\nक्या आप चाहते हैं कि मैं एक बहुत आसान 2-पंक्तियों वाला उदाहरण दिखाऊं?`;
    }
    if (lang === 'hinglish') {
      return `Koi baat nahi! Aaiye **${currentLesson}** ko ek simple real-life angle se dekhte hain:\n\n1. Goal kya hai?\n2. Input data kya hai?\n3. Output kya chahiye?\n\nKya aap chahte hain ki hum bilkul basic 2-row table se start karein?`;
    }
    return `No problem at all! Let's simplify **${currentLesson}**:\n\n1. What is the business goal?\n2. What is your starting data?\n3. What decision should the logic produce?\n\nWould you like to walk through a minimal 2-row practical scenario step by step?`;
  }

  // ----------------------------------------------------------------------
  // 5. INTENT: CONCEPT QUERY ("What is X?")
  // ----------------------------------------------------------------------
  if (queryLower.startsWith('what is') || queryLower.startsWith('kya hai') || queryLower.includes('what does')) {
    if (lang === 'hi') {
      return `**${currentLesson} (${topicTitle})** क्या है?\n\n${context.lessonContentSummary || `${topicTitle} का यह मुख्य कॉन्सेप्ट डेटा का सटीक विश्लेषण करने के लिए उपयोग किया जाता है।`}\n\n- **मुख्य लाभ**: डेटा को सही रूप में व्यवस्थित करना और त्वरित निर्णय लेना।`;
    }
    if (lang === 'hinglish') {
      return `**${currentLesson} (${topicTitle})** kya hai?\n\n${context.lessonContentSummary || `${topicTitle} ka ye core concept data analysis ko accurate aur fast banata hai.`}\n\n- **Core Benefit**: Manually inspect karne ki jagah automated rules apply karna.`;
    }
    return `**What is ${currentLesson} (${topicTitle})?**\n\n${context.lessonContentSummary || `${currentLesson} is a core analytical tool in ${topicTitle} used to transform raw data into structured insights.`}\n\n- **Core Benefit**: Replaces manual inspection with robust, repeatable analysis rules.`;
  }

  // ----------------------------------------------------------------------
  // 6. DEFAULT SOCRATIC GUIDANCE TAILORED TO CURRENT TOPIC
  // ----------------------------------------------------------------------
  if (lang === 'hi') {
    return `**${topicTitle} ➔ ${currentLesson}** पर आपका सवाल बहुत महत्वपूर्ण है!\n\nक्या आप इसका सिंटैक्स देखना चाहते हैं, कोई बिज़नेस उदाहरण समझना चाहते हैं, या कोई अभ्यास प्रश्न हल करना चाहते हैं?`;
  }
  if (lang === 'hinglish') {
    return `**${topicTitle} ➔ ${currentLesson}** par aapka sawal achha hai!\n\nKya aap iska syntax samajhna chahte hain, business scenario dekhna chahte hain, ya practice question try karna chahte hain?`;
  }
  return `Great question regarding **${topicTitle} ➔ ${currentLesson}**!\n\nWould you like me to clarify the syntax, demonstrate a real-world enterprise example, or guide you through an interactive practice problem?`;
}
