DROP DATABASE IF EXISTS studylog; /* Delete the old Database if it existed*/
CREATE DATABASE studylog; /* create the Database to store all the Tables for the system*/
USE studylog; /* select the new Database*/
CREATE TABLE IF NOT EXISTS User ( /* create the table for storing Users*/
     ID INT NOT NULL AUTO_INCREMENT,
     googleToken CHAR(21) UNIQUE NOT NULL,
     PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Unit ( /* create the table for storing Units*/
      ID INT NOT NULL AUTO_INCREMENT,
      userID INT NOT NULL,
      colour CHAR(7) NOT NULL,
      hours INT DEFAULT 0, /*If no credits defined store as zero and not as a NULL*/
      name VARCHAR(60) NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (userID) REFERENCES User(ID)
 );

CREATE TABLE IF NOT EXISTS ScheduledDate ( /*create the table for storing Calander Events*/
     ID INT NOT NULL AUTO_INCREMENT,
     unitID INT NOT NULL,
     title VARCHAR(40) NOT NULL,
     description TEXT NOT NULL,
     time DATETIME NOT NULL,
     PRIMARY KEY (id),
     FOREIGN KEY (unitID) REFERENCES Unit(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Grade ( /*create the table for Grades*/
     ID INT NOT NULL AUTO_INCREMENT,
     unitID INT NOT NULL,
     title VARCHAR(40) NOT NULL,
     score INT NOT NULL, /*internally to be stored as a number 0-100, calculate based on degree class*/
     time DATETIME NOT NULL,
     PRIMARY KEY (id),
     FOREIGN KEY (unitID) REFERENCES Unit(ID) ON DELETE CASCADE
);

CREATE USER IF NOT EXISTS 'webuser'@'localhost' /*Create the user to be used by the webserver*/
  IDENTIFIED BY 'HugVcP8y9reLMuJtUXSy'; /*-Random 20 char password*/
  GRANT ALL ON studylog.* TO 'webuser'@'localhost'; /*Give access only to the studylog database*/
