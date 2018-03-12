module.exports = {
    'port': process.env.WWW_PORT || 3000,
    'secret': 'robocode-cup-jwt-secret',
    'database': 'mongodb://localhost:27017/robocodecup',
    'admin': {
        'name':'robocup-admin',
        'password':'robocup-admin'
    }
};
