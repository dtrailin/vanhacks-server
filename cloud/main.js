// console.log(JSON.stringify(yourObject)); To print out out objects
Parse.Cloud.define('submitForm', function(request, response) {
    var firstName = request.params.firstName;
    var lastName = request.params.lastName;
    var phoneNumber = request.params.phoneNumber;
    var username = request.params.username;
    var password = request.params.password;
    var email = request.params.email;

    var query = new Parse.Query(Parse.User);
    
    query.equalTo('email', email);
    // First is efficient for returning one user
    query.first({
        success: function(user) {
            if (user) {
                // User already exists
                user.set('firstName', firstName);
                user.set('lastName', lastName);
                user.set('phoneNumber', phoneNumber);
                user.set('username', username);
                user.set('email', email);
                user.save(null. {
                    success: function(user) {
                        response.success();
                    },
                    error: function(user) {
                        response.error('Unable to save user.');
                    }
                });
            } else {
                // Create new user
                var attrs = {
                    'firstName': firstName,
                    'lastName': lastName,
                    'phone': phoneNumber,
                    'email': email
                };

                var user = new Parse.User();

                user.signUp(username, password, attrs, {
                    success: function(user) {
                        // Success
                        response.success();
                    },
                    error: function(error) {
                        // Error
                        response.error('Unable to save user.');
                    }
                });
            }
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

    if (!request.object.get("email")) response.error("Email is required for signup");
});

// TO_DO
Parse.Cloud.define('sendAudio', function(req, res) {

});

// TO_DO
Parse.Cloud.define('sendPicture', function(req, res) {

});


