const { storeToGoogleSheets } = require('../google-sheets-integration');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const result = await storeToGoogleSheets({ body });
    
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
