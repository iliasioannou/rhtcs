var dbConfig = {
    client    : 'postgres',
    debug     : true,
    connection: {
        host     : 'kim.planetek.it',
        user     : 'rheticus',
        password : 'pkt284restiCUS ',
        //database : 'RHETICUS',
        database : 'RHETICUS_DEV',
        charset  : 'utf8',
        timezone : 'UTC'
  }
};

module.exports = dbConfig;

