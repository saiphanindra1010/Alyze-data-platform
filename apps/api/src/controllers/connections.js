async function getMysqlTables(host,port,username,password,database)
{
    // Create a connection to the database
    const connection = mysql.createConnection({
      host: host,
      port: port,
      user: username,
      password: password,
      database: database
    });
  
    // Return a promise for the connection
    const connectPromise = new Promise((resolve, reject) => {
      connection.connect((error) => {
        if (error) {
          reject('Error connecting to the database: ' + error);
        } else {
          resolve();
        }
      });
    });
  
    try {
      // Wait for the connection to be established
      await connectPromise;
  
      // Query the database and return a promise
      const queryPromise = new Promise((resolve, reject) => {
        connection.query('SHOW TABLES FROM temp;', (error, results) => {
          if (error) {
            reject('Error executing query: ' + error);
          } else {
            let finalarr = results.map(row => row['Tables_in_temp']);
            resolve(finalarr);
          }
        });
      });
  
      // Get the query results
      const finalarr = await queryPromise;
  
      // End the connection and return the results
      connection.end((err) => {
        if (err) {
          console.error('Error ending the connection:', err);
        } else {
          console.log('Connection ended.');
        }
      });
  
      // Send the response
      res.json({ "listOfTables": finalarr });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ "error": error });
    }

}

export default getMysqlTables