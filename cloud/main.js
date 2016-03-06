// console.log(JSON.stringify(yourObject)); To print out out objects
Parse.Cloud.define('submitForm', function(request, response) {
    var firstName = request.params.firstName;
    var lastName = request.params.lastName;
    var phone = request.params.phone;
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
                user.set('phone', phone);
                user.set('username', username);
                user.set('email', email);
                user.save(null, {
                    success: function(user) {
                        response.success(user);
                    },
                    error: function(err) {
                        response.error('Unable to save user.');
                    }
                });
            } else {
                // Create new user
                var attrs = {
                    'firstName': firstName,
                    'lastName': lastName,
                    'phone': phone,
                    'email': email
                };

                var user = new Parse.User();

                user.signUp(username, password, attrs, {
                    success: function(user) {
                        // Success
                        response.success(user);
                    },
                    error: function(error) {
                        // Error
                        response.error('Unable to save user.');
                    }
                });
            }
        },
        error: function(err) {
            response.error('bad query');
        }
    });
});

Parse.Cloud.beforeSave(Parse.User, function(request, response) {
    // var firstName = request.object.get('firstName');
    // var lastName = request.object.get('lastName');
    // var birthDate = request.object.get('birthDate');
    // var mobilePhone = request.object.get('mobilePhone');
    // var workPhone = request.object.get('workPhone');
    // var username = request.object.get('username');
    // var password = request.object.get('password');
    // var email = request.object.get('email');
    // var height = request.object.get('height');
    // var weight = request.object.get('weight');
    // var workAddress = request.object.get('workAddress');
    // var homeAddress = request.object.get('homeAddress');
    // var licensePlate = request.object.get('licensePlate');

    // var firstNamePartner = request.object.get('firstNamePartner');
    // var lastNamePartner = request.object.get('lastNamePartner');
    // var birthDatePartner = request.object.get('birthDatePartner');
    // var mobilePhonePartner = request.object.get('mobilePhonePartner');
    // var workPhonePartner = request.object.get('workPhonePartner');
    // var usernamePartner = request.object.get('usernamePartner');
    // var passwordPartner = request.object.get('passwordPartner');
    // var emailPartner = request.object.get('emailPartner');
    // var heightPartner = request.object.get('heightPartner');
    // var weightPartner = request.object.get('weightPartner');
    // var workAddressPartner = request.object.get('workAddressPartner');
    // var homeAddressPartner = request.object.get('homeAddressPartner');
    // var licensePlatePartner = request.object.get('licensePlatePartner');

    // validateName(firstName, lastName);
    // validateName(firstNamePartner, lastNamePartner);
    // validatePhone(workPhone);
    // validatePhone(workPhonePartner);
    // validatePhone(mobilePhone);
    // validatePhone(mobilePhonePartner);
    // validateUsername(username);
    // validateUsername(usernamePartner);
    // validatePassword(password);
    // validatePassword(passwordPartner);
    // validateEmail(email);
    // validateEmail(emailPartner);
    // validateAddress(workAddress);
    // validateAddress(workAddressPartner);
    // validateAddress(homeAddress);
    // validateAddress(homeAddressParnter);
    // validateLicensePlate(licensePlate);
    // validateLicensePlate(licensePlatePartner);

    // // TODO - validate birthday, height, weight

    // var validateName = function(firstName, lastName) {
    //     if (!firstName || !lastName) return response.error('Please enter both first and last name.');
    //     if (!firstName.match(/[a-z]/i) || !lastName.match(/[a-z]/i)) return response.error('Please enter a valid first and last name.');
    // }

    // var validatePhone = function(phone) {
    //     var isNum = /^\d+$/.test(phone);
    //     if (!isNum || phone.length !== 10) return response.error('Please enter a valid phone number.');
    // }

    // var validateUsername = function(userName) {
    //     if (!userName) return response.error('Please enter a valid user name');
    // }

    // var validatePassword = function(password) {
    //     if (!password) return response.error('Please enter a valid password');
    // }

    // var validateEmail = function(email) {
    //     if (!email) return response.error('Please enter a valid email');
    // }

    // var validateAddress = function(address) {
    //     if (!address) return response.error('Please enter a valid address');
    // }

    // var validateLicensePlate = function(licensePlate) {
    //     if (!licensePlate) return response.error('Please enter a valid license plate');
    // }
    response.success('YESSSSS MOTHERFUCKER');
});

Parse.Cloud.afterSave('HelpEvent',function(request) {
  query = new Parse.Query('User');
  query.equalTo('email', 'absb@gmail.com');
  query.find({
    success: function(results) {
      alert("Successfully retrieved " + results.length + " scores.");
      // Do something with the returned Parse.Object values
      console.log(results);
    },
    error: function(error) {
      console.log(error);
      alert("Error: " + error.code + " " + error.message);
    }
  });

  console.log('afterSave HelpEvent being called');
  var object = request.object;
  var lat = object.lat;
  var lon = objct.lon;
  var email = request.user.email;
  console.log(object, lat, long, email);

  // query = new Parse.Query('User');
  // query.get(request.body('user').id, {
  //   success: function(user) {
  //     console.log('successful post');
  //     // post.increment("comments");
  //     // post.save();
  //   },
  //   error: function(error) {
  //     console.error("Got an error " + error.code + " : " + error.message);
  //   }
});
