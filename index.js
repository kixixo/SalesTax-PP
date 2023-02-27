// importing dependencies
const express = require('express');
const path = require('path');
// set up express validator
const { check, validationResult, param } = require('express-validator');
const { toNamespacedPath } = require('node:path');

// Set up variables to use the packages
var myApp = express();
myApp.use(express.urlencoded({ extended: false }));

//set path to public and views folder

myApp.set('views', path.join(__dirname, 'views'));
// using public folder for css, js e.t.c.
myApp.use(express.static(__dirname + '/public'));
myApp.set('view engine', 'ejs');

// declaring the Phone Number regex
var phoneRegex = /^[0-9]{3}\s[0-9]{3}\s[0-9]{4}$/;
//function to check using the regular expression
function checkRegex(userInput, regex) {
    if (regex.test(userInput)) {
        return userInput;
    }
}

// declaring positive Number regex
var positiveNum = /^[1-9][0-9]*$/;

// -----------Validation Functions----------------

//custom phone validation function 
function customPhoneValidation(value) {
    if (!checkRegex(value, phoneRegex)) {
        throw new Error('Phone should be in the format of 000-000-0000');
    }
    return true;
}

// Function to validate item price input by the user




// set up the routes (pages of the website)
//render the home page
myApp.get('/', function(req, res) {
    res.render('home');
});

myApp.get('/shop', function(req, res) {
    res.render('shop');
});

myApp.get('/about', function(req, res) {
    res.render('about');
})

myApp.post('/shop', [

    // Validating form input
    check('name', 'Please enter a valid name').not().isEmpty(),
    check('number', '').custom(customPhoneValidation),
    check('email', 'Please enter a valid email. e.g.. test@test.com').isEmail(),
    check('address', 'Please enter a street address').not().isEmpty(),
    check('city', 'Please enter a city').not().isEmpty(),
    check('province', 'Please select a province').not().isEmpty()
], function(req, res) {
    let errors;
    errors = validationResult(req);
    console.log(errors);
    // renders the home page with an error message if errors were found, if not, it proceed to render that calculation
    if (errors.isEmpty()) {

        var book = parseInt(req.body.book);
        var bag = parseInt(req.body.bag);
        var bottle = parseInt(req.body.bottle);
        var charger = parseInt(req.body.charger);
        var lamp = parseInt(req.body.lamp);

        console.log('books' + book);
        console.log('bags' + bag);
        console.log('bottle' + bottle);
        console.log('charger' + charger);
        console.log('lamp' + lamp);

        // fetching the input fields
        var name = req.body.name;
        var number = req.body.number;
        var email = req.body.email;
        var address = req.body.address;
        var city = req.body.city;

        // Variable to store the name of the province selected
        var Province;
        var province = req.body.province;

        switch (province) {
            case '1':
                province = 0.05;
                Province = 'Alberta';
                break;
            case '2':
                province = 0.12;
                Province = 'British Columbia';
                break;
            case '3':
                province = 0.12;
                Province = 'Manitoba';
                break;
            case '4':
                province = 0.15;
                Province = 'New Brunswick';
                break;
            case '5':
                province = 0.15;
                Province = 'Newfoundland & Labrador';
                break;
            case '6':
                province = 0.05;
                Province = 'Northwest Territories';
                break;
            case '7':
                province = 0.15;
                Province = 'Nova Scotia';
                break;
            case '8':
                province = 0.05;
                Province = 'Nunavut';
                break;
            case '9':
                province = 0.13;
                Province = 'Ontario';
                break;
            case '10':
                province = 0.15;
                Province = 'Prince Edward Island';
                break;
            case '11':
                province = 0.14975;
                Province = 'Quebec';
                break;
            case '12':
                province = 0.11;
                Province = 'Saskatchewan';
                break;
            case '13':
                province = 0.05;
                Province = 'Yukon';
        }
        var tax = province;

        /* 
        //creating the constants to be used for calculation
        
        /* Custom validation to check if subtotal is greater than $10 
        function customSubTotalValidation(value) {
            if (value < 10) { throw new Error('You must purchase $10 or more'); } else {
                return true;
            }
        }
        check('subTotal').custom(customSubTotalValidation); */
        /*function subTotalValidation(value) {
            book = parseInt(req.body.book);
            bag = parseInt(req.body.bag);
            bottle = parseInt(req.body.bottle);
            charger = parseInt(req.body.charger);
            lamp = parseInt(req.body.lamp);

            subTotal = book + bag + bottle + charger + lamp;
            value = subTotal;
            if (value < 10) { throw new Error('You must purchase $10 or more') }
            return value;
        }
*/
        param('subTotal').custom(value => {
            book = parseInt(req.body.book);
            bag = parseInt(req.body.bag);
            bottle = parseInt(req.body.bottle);
            charger = parseInt(req.body.charger);
            lamp = parseInt(req.body.lamp);

            value = book + bag + bottle + charger + lamp;
            if (value < 10) { throw new Error('You must purchase $10 or more') }
        })

        //param('subTotal').custom(subTotalValidation);
        var subTotal = book + bag + bottle + charger + lamp;
        tax = subTotal * tax;

        var total = subTotal + tax;

        // New variable to convert province value back to percentage
        var taxPerProvince = province * 100;

        // creating an object with the fetched data to send to the view
        var formResult = {
            fname: name,
            fnumber: number,
            femail: email,
            faddress: address,
            fcity: city,
            fprovince: Province + ' @ ' + taxPerProvince + '%',
            ftax: tax,
            fsubTotal: subTotal,
            Total: total
        }
        console.log(formResult);
        // send the data to the view and render it
        res.render('shop', formResult);
    } else {
        res.render('shop', {
            errors: errors.array() // stores the errors as an array to be iterated in the home page 
        });
    }
});

//start the server and listen at port 8080.... localhost:8080
myApp.listen(8080);

// console message
console.log('Everything executed fine...website listening at port 8080.....');