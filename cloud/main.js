// console.log(JSON.stringify(yourObject)); To print out out objects

Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('submitForm', function(request, response) {
    var firstName = request.params.firstName;
    var lastName = request.params.lastName;
    var phoneNumber = request.params.phoneNumber;
    var username = request.params.username;
    var password = request.params.password;
    var email = request.params.email;

    var user = new Parse.User();
    var attrs = {
        'firstName': firstName,
        'lastName': lastName,
        'phoneNumber': phoneNumber,
        'email': email
    }

    user.signUp(username, password, attrs, {
        success: function(user) {
            // Success
            response.success();
        },
        error: function(error) {
            // Error
            response.error("Unable to save user.");
        }
    });
});

Parse.Cloud.beforeSave(Parse.User, function(request, response) {
    var firstName = request.object.get('firstName');
    var lastName = request.object.get('lastName');
    var phoneNumber = request.object.get('phoneNumber');
    var username = request.object.get('username');
    var password = request.object.get('password');
    var email = request.object.get('email');

    var isNum = /^\d+$/.test(phoneNumber);

    if (!firstName || !lastName) response.error('Please enter both first and last name.');

    if (!firstName.match(/[a-z]/i) || !lastName.match(/[a-z]/i)) response.error('Please enter a valid first and last name.');

    if (!isNum || phoneNumber.length !== 10) response.error('Please enter a valid phone number.');

    if (!userName) response.error('Please enter a valid user name');

    if (!request.object.get("email")) response.error("email is required for signup");
});