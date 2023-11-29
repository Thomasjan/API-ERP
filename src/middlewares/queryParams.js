


const validateFieldNames = (fields) => {
    // Your validation logic for field names
    // Add any necessary validation checks
    return fields;
  };



const queryMiddleware = (req, res, next) => {
    const queryParams = req.query;
    let displayFields = "*";
  
    if (queryParams.display) {
      try {

        displayFields = JSON.parse(queryParams.display);
  
        // Check if displayFields is an array
        if (Array.isArray(displayFields)) {
          // Validate and sanitize the displayFields array
        const validateFields = validateFieldNames(displayFields);
        //   console.log('validateFields : ' + validateFields)
       
          req.displayFields = validateFields.join(', ');
        } else {
          console.error('Invalid display parameter format. Expected an array.');
          res.status(400).json({ Error: 'Invalid display parameter format. Expected an array.' });
          return;
        }
      } catch (parseError) {
        console.error('Error parsing display parameter:', parseError);
        res.status(400).json({ Error: 'Invalid display parameter format.' });
        return;
      }
    }

    console.log('req.displayFields : ' + req.displayFields)
    // Continue to the next middleware or route handler
    next();
  };
  
  module.exports = { queryMiddleware };