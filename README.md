https://moodle.afeka.ac.il/mod/assign/view.php?id=77063

running instructions:
- download and install nodejs if you don't have it installed already:
  https://nodejs.org/en/download/
- in commandline(powershell\terminal) go to project directory with 'cd' command,
  for example: "cd C:\Users\Shahar\Desktop\CloudEx1" (in windows powershell)
- in commandline run the command "npm i -y".
- in commandline run the command "npm start".

info:
The users json has to be in this format:
{
  "email":"customer1@afeka.ac.il",
  "name":{"first":"Cynthia", "last":"Chambers"},
  "password":"ab4de",
  "birthdate":"19-11-1963",
  "roles":["goldCustomer","platinumClub","primeService"]
}
- if one or more of the fields is in another form (for example - "name":"Shahar Hikri")
  You'll get error status in the HTTP request.