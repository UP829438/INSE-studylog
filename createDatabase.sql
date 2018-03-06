CREATE DATABASE IF NOT EXISTS studylog; -- create the Database to store all the Tables for the system
USE studylog; -- select the new Database
CREATE TABLE User ( -- create the table for storing Users
     ID INT NOT NULL AUTO_INCREMENT,
     googleCode VARCHAR(50) NOT NULL, -- For now this is a complete guess
     PRIMARY KEY (id)
);
/*If we add password with hashing etc. then it will be stored in the users table*/

CREATE TABLE Unit ( -- create the table for storing Units
      ID INT NOT NULL AUTO_INCREMENT,
      userID INT NOT NULL,
      colour CHAR(7) NOT NULL,
      name VARCHAR(60) NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (userID) REFERENCES User(ID)
 );

CREATE TABLE IF NOT EXISTS ScheduledDate ( -- create the table for storing Calander Events
     ID INT NOT NULL AUTO_INCREMENT,
     unitID INT NOT NULL,
     title VARCHAR(40) NOT NULL,
     description TEXT NOT NULL,
     time DATETIME NOT NULL,
     PRIMARY KEY (id),
     FOREIGN KEY (unitID) REFERENCES Unit(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS StudyHours ( -- create the table for storing Study Hours
     ID INT NOT NULL AUTO_INCREMENT,
     unitID INT NOT NULL,
     hours INT NOT NULL,
     date DATE NOT NULL,
     PRIMARY KEY (id),
     FOREIGN KEY (unitID) REFERENCES Unit(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Grade ( -- create the table for storing Calander Events
     ID INT NOT NULL AUTO_INCREMENT,
     unitID INT NOT NULL,
     title VARCHAR(40) NOT NULL,
     score INT NOT NULL, --internally to be stored as a number 0-100, calculate based on degree class
     time DATETIME NOT NULL,
     PRIMARY KEY (id),
     FOREIGN KEY (unitID) REFERENCES Unit(ID) ON DELETE CASCADE
);

CREATE USER 'webuser'@'localhost' --Create the user to be used by the webserver
  IDENTIFIED BY 'HugVcP8y9reLMuJtUXSy' PASSWORD; --Random 20 char password
  GRANT ALL ON studylog.* TO 'webuser'@'localhost'; --Give access only to the studylog database