{\rtf1\ansi\ansicpg1252\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // google-sheets.js - Simple Google Sheets integration for storing quiz responses\
// Can be deployed to Netlify, Vercel, or AWS Lambda\
\
// Required dependencies:\
// - google-spreadsheet\
\
const \{ GoogleSpreadsheet \} = require('google-spreadsheet');\
\
// Your Google Sheets credentials (store in environment variables)\
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;\
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;\
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;\
\
/**\
 * Store quiz data in Google Sheets\
 * \
 * Example usage:\
 * \
 * POST /api/store-to-sheets\
 * \{\
 *   "answers": \{ ... \},\
 *   "userInfo": \{ ... \}\
 * \}\
 */\
exports.storeToGoogleSheets = async (req, res) => \{\
  try \{\
    const quizData = req.body;\
    \
    if (!quizData) \{\
      return res.status(400).json(\{ \
        success: false, \
        message: 'Quiz data is required' \
      \});\
    \}\
    \
    // Initialize Google Sheets document\
    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID);\
    \
    // Authenticate with Google\
    await doc.useServiceAccountAuth(\{\
      client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,\
      private_key: GOOGLE_PRIVATE_KEY.replace(/\\\\n/g, '\\n'),\
    \});\
    \
    // Load the sheet\
    await doc.loadInfo();\
    \
    // Get the first sheet\
    const sheet = doc.sheetsByIndex[0];\
    \
    // Format data for Google Sheets\
    // Flatten the nested structure for easier spreadsheet format\
    const flattenedData = \{\
      timestamp: new Date().toISOString(),\
      gender: quizData.answers[1] || '',\
      hasInsurance: quizData.answers[2] || '',\
      insuranceSource: quizData.answers[3] || '',\
      monthlyPayment: quizData.answers[4] || '',\
      insuranceReasons: Array.isArray(quizData.answers[5]) ? quizData.answers[5].join(', ') : quizData.answers[5] || '',\
      ageRange: quizData.answers[6] || '',\
      healthIssues: Array.isArray(quizData.answers[7]) ? quizData.answers[7].join(', ') : quizData.answers[7] || '',\
      employmentStatus: quizData.answers[8] || '',\
      homeOwnership: quizData.answers[9] || '',\
      smoker: quizData.answers[10] || '',\
      householdIncome: quizData.answers[11] || '',\
      occupation: quizData.answers[12] || '',\
      firstName: quizData.userInfo?.firstName || '',\
      lastName: quizData.userInfo?.lastName || '',\
      email: quizData.userInfo?.email || '',\
      phone: quizData.userInfo?.phone || '',\
    \};\
    \
    // Add a row to the sheet\
    await sheet.addRow(flattenedData);\
    \
    return res.status(200).json(\{ \
      success: true, \
      message: 'Data successfully stored in Google Sheets' \
    \});\
  \} catch (error) \{\
    console.error('Error storing data in Google Sheets:', error);\
    return res.status(500).json(\{ \
      success: false, \
      message: 'Failed to store data in Google Sheets',\
      error: error.message \
    \});\
  \}\
\};\
\
/**\
 * Create a proper sheet structure if it doesn't exist yet\
 * This function should be run once to set up your Google Sheet\
 */\
exports.setupGoogleSheet = async (req, res) => \{\
  try \{\
    // Initialize Google Sheets document\
    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID);\
    \
    // Authenticate with Google\
    await doc.useServiceAccountAuth(\{\
      client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,\
      private_key: GOOGLE_PRIVATE_KEY.replace(/\\\\n/g, '\\n'),\
    \});\
    \
    // Load the sheet\
    await doc.loadInfo();\
    \
    // Get or create the first sheet\
    let sheet = doc.sheetsByIndex[0];\
    if (!sheet) \{\
      sheet = await doc.addSheet(\{ title: 'Quiz Responses' \});\
    \}\
    \
    // Set up the header row with all our fields\
    await sheet.setHeaderRow([\
      'timestamp',\
      'gender',\
      'hasInsurance',\
      'insuranceSource',\
      'monthlyPayment',\
      'insuranceReasons',\
      'ageRange',\
      'healthIssues',\
      'employmentStatus',\
      'homeOwnership',\
      'smoker',\
      'householdIncome',\
      'occupation',\
      'firstName',\
      'lastName',\
      'email',\
      'phone'\
    ]);\
    \
    return res.status(200).json(\{ \
      success: true, \
      message: 'Google Sheet successfully set up' \
    \});\
  \} catch (error) \{\
    console.error('Error setting up Google Sheet:', error);\
    return res.status(500).json(\{ \
      success: false, \
      message: 'Failed to set up Google Sheet',\
      error: error.message \
    \});\
  \}\
\};}
