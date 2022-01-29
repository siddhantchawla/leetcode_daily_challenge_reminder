
chrome.alarms.create("Reminder-Alarm", {delayInMinutes: 0.1, periodInMinutes: 120} );
chrome.alarms.onAlarm.addListener(function(alarm) {

    const graphql = JSON.stringify({
        query: "query questionOfToday {  activeDailyCodingChallengeQuestion {  date   userStatus  link   question {     acRate      difficulty     freqBar      frontendQuestionId: questionFrontendId    isFavor     paidOnly: isPaidOnly      status    title    titleSlug     hasVideoSolution      hasSolution      topicTags {       name       id       slug}}}}",
      })

    var flag = true;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    chrome.cookies.getAll({domain: "leetcode.com", name: "LEETCODE_SESSION"}, (res) => { 
                        if(res.length == 0){
                            flag = false;
                        }
                        else {
                            myHeaders.append("LEETCODE_SESSION", res[0].value) }});

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql
        };

    if (flag)
    {
        fetch("https://leetcode.com/graphql", requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.data.activeDailyCodingChallengeQuestion.userStatus != "Finish")
            {
                chrome.notifications.clear('Leetcode Reminder', () => {chrome.notifications.create('Leetcode Reminder', {
                    type: 'basic',
                    iconUrl: '/logo5.png',
                    title: 'Daily-Challenge Reminder!',
                    message: 'You haven\'t completed today\'s Problem: ' + result.data.activeDailyCodingChallengeQuestion.question.title,
                    priority: 2
                    }, () => {chrome.notifications.onClicked.addListener(() => {
                        chrome.tabs.create({url: "https://leetcode.com"+result.data.activeDailyCodingChallengeQuestion.link});
                      });  })
                });
            }
            else
            {
                chrome.notifications.clear('Leetcode Reminder')
            }
        })
        .catch(error => {
            console.log(error);
        })
    }
        
    
});