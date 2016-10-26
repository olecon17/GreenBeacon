var pg = require('pg')
var Sequelize = require('sequelize');

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var db = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: true
  }
});

//Establishes the connection to the database
db
  .authenticate()
  .then(function (err) {
    console.log('Connection established');
  })
  .catch(function (err) {
    console.log('Unable to connect: ', err);
  });

//Creates table of users
var User = db.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: Sequelize.STRING, //GitHub username
  displayname: Sequelize.STRING //full first and last name
});

//Creates table of tickets
var Ticket = db.define('ticket', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  message: Sequelize.TEXT,
  location: Sequelize.STRING,
  //pulsing dot coordinates
  x: Sequelize.INTEGER,
  y: Sequelize.INTEGER,
  //dot color
  color: Sequelize.STRING,

  claimed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  solved: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  preSolved: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

//creates table of claimed tickets
var Claim = db.define('claim', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  //id of the user who claimed the ticket
  helpeeId: Sequelize.INTEGER
});

//creates table of fellers
var Fellers = db.define('fellers', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fellerName: Sequelize.STRING
});

//Defines relationships between tables
User.hasMany(Ticket);
Ticket.belongsTo(User);

User.hasMany(Claim);
Claim.belongsTo(User);

Ticket.hasOne(Claim);
Claim.belongsTo(Ticket);

//Create Tables
db
  .sync()
  .then(function() {
    console.log('Tables created');
 });

module.exports = {
  User: User,
  Ticket: Ticket,
  Claim: Claim
};