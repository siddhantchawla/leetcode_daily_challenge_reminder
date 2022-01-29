import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import Alert from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/Container';
import { Navbar } from "react-bootstrap";
import { ListGroup } from "react-bootstrap";
import Chevron from "react-chevron";

import 'bootstrap/dist/css/bootstrap.min.css';


function QuestionDifficulty(props) {
    const [toggleChevron, setChevron] = useState(true);
    return (
        <Container>
            { toggleChevron &&
            <div onClick={() => {setChevron(!toggleChevron)}}>
              <Chevron direction={ "right" } /> Question Difficulty  
            </div>
            }
            { !toggleChevron &&
            <div onClick={() => {setChevron(!toggleChevron)}}>
                <Chevron direction={ "down" } /> Question Difficulty: 
                <h6>&emsp;&nbsp;&nbsp; {props.difficulty} </h6> 
            </div>
            }
        </Container>
    )
}

function TopicTags(props) {
    console.log(props)
    const [toggleChevron, setChevron] = useState(true);
    const topicTags = []
    props.topicTags.map(topic => {
        topicTags.push(<li>{topic}</li>)
    })
    return (
        <Container>
            { toggleChevron &&
            <div onClick={() => {setChevron(!toggleChevron)}}>
              <Chevron direction={ "right" } /> Topic Tags  
            </div>
            }
            { !toggleChevron &&
            <div onClick={() => {setChevron(!toggleChevron)}}>
                <Chevron direction={ "down" } /> Topic Tags: 
                <ul>
                    {topicTags}
                </ul>
                
            </div>
            }
        </Container>
    )
}




const graphql = JSON.stringify({
    query: "query questionOfToday {  activeDailyCodingChallengeQuestion {  date   userStatus  link   question {     acRate      difficulty     freqBar      frontendQuestionId: questionFrontendId    isFavor     paidOnly: isPaidOnly      status    title    titleSlug     hasVideoSolution      hasSolution      topicTags {       name       id       slug}}}}",
  })

const userInfo = JSON.stringify({
    query: "query globalData { userStatus {userId isSignedIn  username  }}"
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
    const [problemDifficulty, setProblemDifficulty] = useState("");
    const [topicTags, setTopicTags] = useState([]);
    const [problemLink, setProblemLink] = useState("");
    const [userLogin, setUserLogin] = useState(true);
    const [userName, setUserName] = useState("null")
    const [profileLink, setProfileLink] = useState("")

    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    chrome.cookies.getAll({domain: "leetcode.com", name: "LEETCODE_SESSION"}, (res) => { 
                        if(res.length == 0){
                            setUserLogin(false);
                        }
                        else {
                            myHeaders.append("LEETCODE_SESSION", res[0].value) 
                        }});

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql
        };
    
    var userInfoRequest = {
        method: "POST",
        headers: myHeaders,
        body: userInfo
    };

    useEffect(() => {
        fetch("https://leetcode.com/graphql", requestOptions)
        .then(response => response.json())
        .then(result => {
            setRes(result.data.activeDailyCodingChallengeQuestion.userStatus);
            setProblem(result.data.activeDailyCodingChallengeQuestion.question.title);
            setProblemLink("https://leetcode.com"+result.data.activeDailyCodingChallengeQuestion.link);
            setProblemDifficulty(result.data.activeDailyCodingChallengeQuestion.question.difficulty);
            const topics = []
            result.data.activeDailyCodingChallengeQuestion.question.topicTags.forEach( topic => {
                topics.push(topic.name);
            })
            setTopicTags(topics);


            console.log(result)
        })
        .catch(error => {
            setRes("Error");
            setErrorMsg(error);
        });

        fetch("https://leetcode.com/graphql", userInfoRequest)
        .then(response => response.json())
        .then(result => {
            setUserName(result.data.userStatus.username);
            setProfileLink("https://leetcode.com/"+result.data.userStatus.username);
        })
        .catch(error => {
            console.log(error);
        })

    }, [])
    return (
        
        <Container>
            <Navbar>
            <Navbar.Brand>
                <img
                    src="/leetcode-logo.png"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                    alt="React Bootstrap logo"
                />
            </Navbar.Brand>
                <Navbar.Brand href="#home">Daily-Challenge Reminder</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    { userName != "null" && userName != "" && 
                        <Navbar.Text>
                            Signed in as: <a href={ profileLink } target="_blank">{ userName }</a>
                        </Navbar.Text>
                    }

                    { userName == "" &&
                        <Navbar.Text>
                            Please Sign-in <a href="https://leetcode.com" target="_blank">here</a>
                        </Navbar.Text>
                    }
                </Navbar.Collapse>
            </Navbar>
            

            {res == "Loading" &&
                <Container>
                    <center><h3>Loading...</h3></center>
                </Container>
            }
            
            {res == "NotStart" &&
                <Container>
                    <Alert variant="danger">
                        { userLogin && 
                                <h4>You haven't completed the today's challenge!</h4>
                                
                        }
                        <p><b>Today's Problem: &emsp;</b>
                            <a href={ problemLink }  target="_blank">{ problem }</a>
                        </p>
                        < QuestionDifficulty difficulty = {problemDifficulty} />
                        < TopicTags topicTags = {topicTags}/>
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
                    <Alert variant="danger">
                        <h4> Oh Crap!</h4>
                        <h6> There is some technical error :/</h6>
                    </Alert>
                </Container>
            }
        </Container>
    );
}

render(<Popup />, document.getElementById("react-target"));