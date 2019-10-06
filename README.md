# INSE-studylog

Study Logging Web App

Students:

UP829438

UP839635

GeoffreyYau96 = UP823183

UPINSE-BB = UP743299

JMadgwick = UP811863

UPTylerD = UP811402

# Running the Webserver server.js file

start your VM (https://www.port.ac.uk/myvm)

* launch a connection and create the directory you want for the github repository using mkdir and navigate to it with cd 'the name'
$~: mkdir exampleDirectory
$~: cd exampleDirectory

* clone the INSE studylog repository and install all required packages for the server to run
```
$~: git clone https://github.com/UP829438/INSE-studylog.git

$~: npm install

$~: npm start
```
* you can now enter the ip for your VM and the server should come up.


# Get the database set up

Just run the SQL in createDatabase.sql in your VM mysql.

# Running the client testing

* download the testing folder

* open the testing folder and click the on directory then type 'cmd' then press enter to open the cmd with the directory

* type 'pipe install selenium' to the cmd to download and install selenium to the folder - make sure you already installed python 3.6

* open any IDE with python (if not install one and make sure you have selenium installed) and run the test.py file

# Running the server mySql Function testing

* run the mysqlTestCases.js using 'node mysqlTestCases.js' at the VM prompt
