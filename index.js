
const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment');
const fs = require('fs');




app.get('/', (req, res) => {
    res.send("Server Is Working......")
});


//app.use(express.json());
app.post('/webhook', express.json(), (req, res)=>{
    const agent = new dfff.WebhookClient({
        request : req,
        response : res
    });
  
    
    

    function Verify_PolicyNum(agent) {
        //agent.add("Sending response from Webhook server as v1.1.11.1");
        var policy_num = agent.context.get("awaiting_pnum").parameters.policyNum;
        console.log(policy_num);
        let pattern1 = /^\d{10}$/;
        let pattern2 = /^\d{8}$/;
        let regex1 = pattern1.test(policy_num);
        console.log(regex1);
        let regex2 = pattern2.test(policy_num);
        console.log(regex2);

       
            if (regex1 || regex2 === true) {
                agent.add("Please enter your Date of Birth for verification. For example : If your date of birth is 6 Jan 1992 enter 06 01 1992.");
            } else {
               
                agent.add("Sorry I can't validate you. Please enter the correct policy number (8 digit) or mobile number (10 digit) !!");
                
            }
       
        
    }

    


    function Verify_DOB(agent) {
        //agent.add("Sending response from Webhook server as v1.1.11.1");
        var user_dob = agent.context.get("awaiting_dob").parameters.dob;
        console.log(user_dob);
        let regex = /^(0?[1-9]|[12][0-9]|3[01])[\s](0?[1-9]|1[012])[\s]\d{4}$/;
        let result = regex.test(user_dob);
        console.log(result);
       
            if (result === true) {
                agent.add(" Thanks! I got that. Now please enter the confirmation code sent to your mobile number: 9856428524 and registered email-id : ms@gmail.com");
            } else {
               
                agent.add("Sorry I can't validate you. If your date of birth is 6 Jan 1992 Please enter 06 01 1992");
            }

    }
 function Confirmation_code(agent) {
        //agent.add("Sending response from Webhook server as v1.1.11.1");
        var name = agent.context.get("details").parameters.ProposerName;
        var pname = agent.context.get("details").parameters.policyname;
        var date = agent.context.get("details").parameters.riskdate; 
        var status = agent.context.get("details").parameters.policystatus; 

        console.log(name);
      
        agent.add("Hi " + name + "! here are the details for policy number 86455 - " + pname + " plan issued on " + date + " which is currently  " + status + ". The life assured is Secured.Your annual annuity amount is Rs 500000.");

    }
    
    

    var intentMap = new Map();
   // intentMap.set('finalConfirmation', finalConfirmation)
    intentMap.set('Verify_PolicyNum', Verify_PolicyNum)
    intentMap.set('Verify_DOB', Verify_DOB)
    intentMap.set('Confirmation_code', Confirmation_code)

    agent.handleRequest(intentMap);

});



app.listen(5000, ()=>console.log("Server is live at port 5000 "));
