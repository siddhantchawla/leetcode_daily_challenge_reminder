import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import Alert from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/Container'

import 'bootstrap/dist/css/bootstrap.min.css';



const graphql = JSON.stringify({
    query: "query questionOfToday {  activeDailyCodingChallengeQuestion {  date   userStatus  link   question {     acRate      difficulty     freqBar      frontendQuestionId: questionFrontendId    isFavor     paidOnly: isPaidOnly      status    title    titleSlug     hasVideoSolution      hasSolution      topicTags {       name       id       slug}}}}",
  })

const alerts = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
  ].map((variant, idx) => (
    <Alert key={idx} variant={variant}>
      This is a {variant} alert with{' '}
      <Alert.Link href="#">an example link</Alert.Link>. Give it a click if you
      like.
    </Alert>
  ));


function Popup() {
    const [res, setRes] = useState("Loading");
    const [errorMsg, setErrorMsg] = useState("");
    const [problem, setProblem] = useState("");
    const [problemLink, setProblemLink] = useState("");
    const [userLogin, setUserLogin] = useState(true);

    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    chrome.cookies.getAll({domain: "leetcode.com", name: "LEETCODE_SESSION"}, (res) => { 
                        if(res.length == 0){
                            setUserLogin(false);
                        }
                        else {
                            myHeaders.append("LEETCODE_SESSION", res[0].value) }});

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql
        };
    
    

    useEffect(() => {
        fetch("https://leetcode.com/graphql", requestOptions)
        .then(response => response.json())
        .then(result => {
            setRes(result.data.activeDailyCodingChallengeQuestion.userStatus);
            setProblem(result.data.activeDailyCodingChallengeQuestion.question.title);
            setProblemLink("https://leetcode.com"+result.data.activeDailyCodingChallengeQuestion.link);
            console.log(result);
        })
        .catch(error => {
            setRes("Error");
            setErrorMsg(error);
        })
    }, [])
    return (
        
        <Container>
            
            <Alert variant="dark">
                <center><h1> Leetcode Daily Challenge Reminder! </h1></center>
            

            {res == "Loading" &&
                <Container>
                    <center><h3>Loading...</h3></center>
                </Container>
            }
            
            {res == "NotStart" && userLogin &&
                <Container>
                    <Alert variant="danger">
                        <h4>You haven't completed problem for today!</h4>
                        <h6>Here are the details: </h6>
                        <p>Today's Problem: &emsp; 
                            <a href={ problemLink }  target="_blank">{ problem }</a>
                        </p>
                        
                    </Alert>
                </Container>
            }

            {res == "Finish" &&
                <Container>
                    <Alert variant="success">
                        <h4>Good Job! You have already completed the question for today!</h4>
                        <h6>Come back tomorrow for another question! :)</h6>
                    </Alert>
                </Container>
            }

            {res == "Error" && 
                <Container>

                </Container>
            }
            </Alert>
        </Container>
    );
}

render(<Popup />, document.getElementById("react-target"));