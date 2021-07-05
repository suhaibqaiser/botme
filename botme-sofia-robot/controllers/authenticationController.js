const authService = require('../services/authenticationService');

async function authenticateClient(request, response) {
    console.log(request.body);
    let clientToken = await authService.login(request.body.clientId, request.body.clientSecret);
    if(clientToken) {
        response.cookie('clientToken', clientToken).render('index.html');
    } else {
        response.render('login.html', {errorMessage : "Provided client id or secret is incorrect. Please try again"});
    }

}
async function navigateHome(request, response) {
    try {
        if(request.cookies && request.cookies.clientToken && request.cookies.clientToken != "j:null") {
            console.log("got cookie token = " + request.cookies.clientToken)
            response.render("index.html", {title: "Home"});
        } else {
            response.render("login.html", {title: "Login"})
        }
    } catch(e) {
        console.log(e)
    }


}

module.exports = ({authenticateClient, navigateHome})