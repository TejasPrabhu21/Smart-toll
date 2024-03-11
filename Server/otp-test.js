// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
const accountSid = "ACfa0b4fb8544abb729fa7320f320d4c19";
const authToken = "c7f538d9036c5e77aa57c44ad58d63fc";
const verifySid = "VAbbe0ba231d37cd19055cc72406f066cd";
const client = require("twilio")(accountSid, authToken);

client.verify.v2
    .services(verifySid)
    .verifications.create({ to: "+918277770747", channel: "sms" })
    .then((verification) => console.log(verification.status))
    .then(() => {
        const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        readline.question("Please enter the OTP:", (otpCode) => {
            client.verify.v2
                .services(verifySid)
                .verificationChecks.create({ to: "+918277770747", code: otpCode })
                .then((verification_check) => console.log(verification_check.status))
                .then(() => readline.close());
        });
    });