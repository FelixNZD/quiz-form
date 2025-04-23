{\rtf1\ansi\ansicpg1252\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // serverless.js - A simple serverless function for Twilio Verify integration\
// Can be deployed to Netlify, Vercel, or AWS Lambda\
\
// Required dependencies:\
// - twilio\
\
const twilio = require('twilio');\
\
// Replace with your Twilio credentials (store in environment variables)\
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;\
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN; \
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;\
\
// Initialize Twilio client\
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);\
\
/**\
 * Send OTP via SMS using Twilio Verify\
 * \
 * Example usage:\
 * \
 * POST /api/send-otp\
 * \{\
 *   "phone": "+12345678901"\
 * \}\
 */\
exports.sendOtp = async (req, res) => \{\
  try \{\
    const \{ phone \} = req.body;\
    \
    if (!phone) \{\
      return res.status(400).json(\{ success: false, message: 'Phone number is required' \});\
    \}\
    \
    // Send verification code via Twilio Verify\
    const verification = await client.verify.v2\
      .services(TWILIO_VERIFY_SERVICE_SID)\
      .verifications.create(\{\
        to: phone,\
        channel: 'sms'\
      \});\
    \
    return res.status(200).json(\{ \
      success: true, \
      message: 'Verification code sent successfully',\
      status: verification.status \
    \});\
  \} catch (error) \{\
    console.error('Error sending OTP:', error);\
    return res.status(500).json(\{ \
      success: false, \
      message: 'Failed to send verification code',\
      error: error.message \
    \});\
  \}\
\};\
\
/**\
 * Verify OTP code using Twilio Verify\
 * \
 * Example usage:\
 * \
 * POST /api/verify-otp\
 * \{\
 *   "phone": "+12345678901",\
 *   "otp": "1234"\
 * \}\
 */\
exports.verifyOtp = async (req, res) => \{\
  try \{\
    const \{ phone, otp \} = req.body;\
    \
    if (!phone || !otp) \{\
      return res.status(400).json(\{ \
        success: false, \
        message: 'Phone number and OTP code are required' \
      \});\
    \}\
    \
    // Check verification code via Twilio Verify\
    const verification_check = await client.verify.v2\
      .services(TWILIO_VERIFY_SERVICE_SID)\
      .verificationChecks.create(\{\
        to: phone,\
        code: otp\
      \});\
    \
    if (verification_check.status === 'approved') \{\
      return res.status(200).json(\{ \
        success: true, \
        message: 'OTP verification successful',\
        status: verification_check.status \
      \});\
    \} else \{\
      return res.status(400).json(\{ \
        success: false, \
        message: 'Invalid verification code',\
        status: verification_check.status \
      \});\
    \}\
  \} catch (error) \{\
    console.error('Error verifying OTP:', error);\
    return res.status(500).json(\{ \
      success: false, \
      message: 'Failed to verify code',\
      error: error.message \
    \});\
  \}\
\};\
\
/**\
 * Store quiz data (example function)\
 * You can customize this to send data to Google Sheets, your own database, etc.\
 * \
 * Example usage:\
 * \
 * POST /api/store-data\
 * \{\
 *   "answers": \{ ... \},\
 *   "userInfo": \{ ... \}\
 * \}\
 */\
exports.storeData = async (req, res) => \{\
  try \{\
    const quizData = req.body;\
    \
    // Here you would implement your preferred data storage method\
    // Example implementations:\
    \
    // 1. Store in a database (MongoDB, PostgreSQL, etc.)\
    // await db.collection('quiz_responses').insertOne(quizData);\
    \
    // 2. Send to Google Sheets via Google Sheets API\
    // const \{ GoogleSpreadsheet \} = require('google-spreadsheet');\
    // const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID);\
    // await doc.useServiceAccountAuth(\{ ... \});\
    // await doc.loadInfo();\
    // const sheet = doc.sheetsByIndex[0];\
    // await sheet.addRow(\{ ...quizData \});\
    \
    // 3. Or simply log it for development purposes\
    console.log('Received quiz data:', quizData);\
    \
    return res.status(200).json(\{ \
      success: true, \
      message: 'Data stored successfully' \
    \});\
  \} catch (error) \{\
    console.error('Error storing data:', error);\
    return res.status(500).json(\{ \
      success: false, \
      message: 'Failed to store data',\
      error: error.message \
    \});\
  \}\
\};}
