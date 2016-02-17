var dbConfig = {
    client    : 'postgres',
    debug     : true,
    connection: {
        host     : 'kim.planetek.it',
        user     : 'postgres',
        password : 'PKT284postgRHES',
        //database : 'RHETICUS',
        database : 'RHETICUS_DEV',
        charset  : 'utf8',
        timezone : 'UTC'
  }
};

module.exports = dbConfig;

