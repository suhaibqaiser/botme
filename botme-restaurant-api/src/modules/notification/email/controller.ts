var nodemailer = require('nodemailer');

export async function sendOrderMail(request:any) {
    // console.log(nodemailer)
    console.log("sending email")
    nodemailer.createTestAccount((err:any,account:any) => {
        var transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.secure,
            auth: {
                user: 'x4odp6nxtybl6yez@ethereal.email',
                pass: 'zsEgxWEMjvhKEgdqG4'
        }
    });
        console.log(account.user)
        console.log(account.pass)
        var mailOptions = {
            from: account.user,
            to: 'taha@matacs.com',
            subject: 'Your order has been placed',
            text: "Hello world?",
            html: `
            <!Doctype Html>  
            <Html>     
            <Head>     
            <script type="text/javascript">  
                function func() {  
                    alert("You are Successfully Called the JavaScript function");  
                    window.location.href = redirect_url;
                }  
        </script>  
        </Head> 
        <body>   
            <div style="background: #222222;font-family: Roboto, sans-serif; list-style: none; color: white; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; max-width: 600px; width: 600px; margin: 0px auto; padding: 60px 0px;">
    <div style="font-family: Roboto, sans-serif; margin: 0px 0px 26px; list-style: none; color: white; padding: 0px; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; text-align: center;background: #222222">
        <a target="_blank" href="https://stg.gofindmenu.com/home" style="font-family: Roboto, sans-serif; margin: 0px; list-style: none; color: white; padding: 0px; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; display: block;">
            <img src="https://stg.gofindmenu.com/assets/images/logo/web-logo.png" alt="" style="width: 100px;">
        </a>
    </div>
    <div style="font-family: Roboto, sans-serif; margin: 0px; list-style: none; color: white; padding: 0px; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; text-align: center; box-shadow: rgba(184, 189, 209, 0.2) 0px 0px 20px 0px; border-top: 4px solid #E7272D; background: #222222;">
        <div style="font-family: Roboto, sans-serif; margin: 0px; list-style: none; color: white; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; padding: 60px 35px 0px;background: #222222">
            <div style="font-family: Roboto, sans-serif; margin: 0px; list-style: none; color: white; padding: 0px 0px 60px; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; border-bottom: 1px solid rgb(207, 210, 220);background: #222222">
                <h3 style="font-family: Roboto, sans-serif; margin: 0px 0px 35px; list-style: none; color: white; padding: 0px; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; font-size: 22px; font-weight: normal;">Your order has been placed!</h3>
                <p style="font-family: Roboto, sans-serif; margin: 0px; list-style: none; color: white; padding: 0px; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; line-height: 1.59; font-size: 18px; text-align: left; font-weight: normal;">
                    Hi taha@matacs.com,
                    <br>
                    <br>
                    ORDER INFO SUMMARY:
                    <br>
                    OrderId:
                    <br>
                    Items:
                    <br>
                    Total Amount:
                    <br>
                    <br>
                    <br>
                   <small style="color: #E7272D"></small>
                </p>
           
                <p style="font-family: Roboto, sans-serif; margin: 0px; list-style: none; color: white; padding: 0px; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; line-height: 1.59; font-size: 18px; text-align: left; font-weight: normal;">
                    <br>
                    Thank you for ordering from BotME
                </p>
                <p style="font-family: Roboto, sans-serif; margin: 0px; list-style: none; color: white; padding: 0px; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; line-height: 1.59; font-size: 18px; text-align: left; font-weight: normal;"><br>
                    Until next time,<br>
                </p>
            </div>
        </div>
        <div style="font-family: Roboto, sans-serif; margin: 0px; list-style: none; color: white; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; padding: 35px;">
            <table style="width: 100%;">
                <tbody>
                <tr>
                    <td style="width: 50%;">
                        <p style="font-family: Roboto, sans-serif; margin: 0px; list-style: none; color: white; padding: 0px; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; text-align: left; line-height: 1.59; font-size: 18px; font-weight: normal;">The <a href="https://stg.gofindmenu.com/home" target="_blank" style="font-family: Roboto, sans-serif; margin: 0px; list-style: none; padding: 0px; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; color: #E7272D;">Botme</a>
                            Team</p>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</body>
       
            `
        };

        transporter.sendMail(mailOptions, function(error:any, info:any){
            if (error){
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response)
            } 
        });
    });
}