# Smart-toll

https://smart-toll.onrender.com

# Routes:

Get nearest tollgate -
Method : GET, URL : "https://smart-toll.onrender.com/nearestTollGate", JsonData : {'latitude" : 12.423423, "longitude" : 57.235553}

Get vehicle details -
Method : GET, URL : "https://smart-toll.onrender.com/user/vehicle", JsonData : {"registrationNumber" : "MH01AB1234"}

Send OTP -
Method : POST, URL : "https://smart-toll.onrender.com/user/send-otp", JsonData : {"phoneNumber" : "8277770747"}

Verify OTP -
Method : POST, URL : "https://smart-toll.onrender.com/user/verify-otp", JsonData : { "phoneNumber" : "8277770747", "otp" : "552191" }
