README: 


TEST USERS: 

123@gmail.com
pass: 123
role: Admin


1234@gmail.com
pass: 1234
role: User


12345@gmail.com
pass: 12345
role: Premium



CART ID AND PRODUCT ID PROVIDED FOR ENDPOINTS:

TEST CART ID: 6675f02561950335fec550bf
TEST PRODUCT ID: 667604436cf9036ea03bd433



SCRIPTS: 


Run with Nodemon: npm run dev




TESTS (CHANGE AT package.json)

NOTE: NEEDS TO RUN SERVER AND TESTS AT THE SAME TIME

"test": "mocha src/test/Test_Carts.js"
"test": "mocha src/test/Test_Products.js"
"test": "mocha src/test/Test_Users.js"

Run tests: npm run test





ENDPOINTS DOCUMENTATION

http://localhost:8080/apidocs/




----------------------------------------------------------------------------

RAILWAY APP: 


RAILWAY APP HAD SOME SERIOUS ISSUES WITH BCRYPT (DOCKER TOO), AND REQUIRED AN SPECIFC PORT TO RUN. 

ALSO, FRONT END NAVIGATION BUTTONS DO NOT WORK. SHOULD THE USER WANT TO NAVIGATE IT IS RECOMMENDED 

THAT HE USES THE PROVIDED ENDPOINTS IN DOCUMENTATION ON THE DIRECTION GIVEN BY RAILWAY AND ADD MANUALLY THE ENDPOINT AND PARAMETERS: 


EXAMPLE:

https://backendproyectofinal-production-f04b.up.railway.app/api/carts


OR BETTER, RUN PROJECT LOCALLY