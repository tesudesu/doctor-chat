"use client";

import { useState } from "react";
const { DateTime } = require('luxon');
import "./chat.css";

let threads = [
    [
        {
            "doctor": true,
            "time": "2024-03-26T13:37",
            "message": "Hi Alex! I see that you're concerned about your weight?"
        },
        {
            "doctor": false,
            "time": "2024-03-26T14:52",
            "message": "Yes, I've been struggling with my weight, and I want to make some changes to lose weight in an easy and healthy way."
        },
        {
            "doctor": true,
            "time": "2024-03-26T15:10",
            "message": "I'm glad you're taking steps to improve your health. Can you tell me more about your current lifestyle?"
        },
        {
            "doctor": false,
            "time": "2024-03-26T15:25",
            "message": "Sure."
        },
        {
            "doctor": false,
            "time": "2024-03-26T15:26",
            "message": "I work a desk job and don't get much exercise. My diet hasn't been the healthiest either, with lots of fast food and sugary snacks."
        },
        {
            "doctor": true,
            "time": "2024-03-26T15:45",
            "message": "Have you tried any diets or exercise routines in the past?"
        },
        {
            "doctor": false,
            "time": "2024-03-26T17:03",
            "message": "I've tried a few diets I found online, but I struggled to stick with them long-term."
        },
        {
            "doctor": true,
            "time": "2024-03-26T17:22",
            "message": "Losing weight can be challenging.\n\nWhile you should still work on being consistent with a diet or exercise routine, we can help you by offering you a weekly injection or a daily pill. The weekly injection works by reducing blood sugar and regulating insulin. The daily pill works by decreasing appetite. Are you interested in learning more about them?"
        },
        {
            "doctor": false,
            "time": "2024-03-27T08:29",
            "message": "Yeah, can you tell me more about the differences between the two options?"
        }
    ],
    [
        {
            "doctor": false,
            "time": "2024-04-03T10:50",
            "message": "Hi doctor,\n\nI have tried the pills for a week, but I haven't noticed any changes in my weight."
        },
        {
            "doctor": true,
            "time": "2024-04-03T11:37",
            "message": "One week is usually too short to see any significant effects. Why don't you give it some more time?"
        },
        {
            "doctor": false,
            "time": "2024-04-03T13:12",
            "message": "Ok, but I want to lose weight quickly. Can we switch to the injection?"
        },
        {
            "doctor": true,
            "time": "2024-04-03T14:02",
            "message": "I understand that you want to lose weight quickly, but losing weight is a journey. Different people may react differently to the pills and injections. One might work better for some people than others. Try out the pills for a few more weeks. Let me know your progress, and we can discuss if the injections would be a better option for you."
        }
    ]
]


export default function Chat() {
    const [windowIndex, setWindowIndex] = useState(-1);
    const [radioChoice, setRadioChoice] = useState("");
    const [pendingMessage, setPendingMessage] = useState("");

    const handleChangeWindow = (e) => {
        setWindowIndex(e);
    }

    const handleRadio = (e) => {
        setRadioChoice(e.target.value);
    }

    const handleText = (e) => {
        setPendingMessage(e.target.value);
    }

    const handlePostMessage = (e) => {
        e.preventDefault();
        const isDoctor = radioChoice === "doctor" ? true : false;
        threads[windowIndex].push({
            "doctor": isDoctor,
            "time": new Date(),
            "message": pendingMessage
        })
        setPendingMessage("");
    }

    const handlePostNewThread = (e) => {
        e.preventDefault();
        const isDoctor = radioChoice === "doctor" ? true : false;
        threads.push([
            {
                "doctor": isDoctor,
                "time": new Date(),
                "message": pendingMessage
            }
        ])
        setPendingMessage("");
        setWindowIndex(threads.length - 1);
    }

    const handleCreateNewThread = () => {
        setWindowIndex(-1);
    }


    return (
        <container>
            <sidebar>
                {threads.map((thread, threadIndex) => (
                    <div key={threadIndex} onClick={() => handleChangeWindow(threadIndex)} style={{ backgroundColor: windowIndex === threadIndex && "#c2e9da" }}>
                        <div>
                            {thread[thread.length - 1].message.length < 40 ? thread[thread.length - 1].message : thread[thread.length - 1].message.slice(0, thread[thread.length - 1].message.lastIndexOf(" ", 40)) + "..."}
                        </div>
                        <div className="threaddate">
                            {DateTime.fromJSDate(new Date(thread[thread.length - 1].time)).monthShort + " " + DateTime.fromJSDate(new Date(thread[thread.length - 1].time)).day}
                        </div>
                    </div>
                ))}
                <button onClick={handleCreateNewThread} style={{ backgroundColor: windowIndex === -1 && "#c2e9da" }}>New Thread</button>
            </sidebar>

            <mainbar>
                <chatwindow>
                    {windowIndex >= 0 && threads[windowIndex].map((convo, ind) => (
                        <div key={ind}>
                            {/* Only show a date if the previous date is over half an hour ago */}
                            <div style={{ marginLeft: !convo.doctor && "auto" }} className="messagedate">{(ind === 0 || new Date(convo.time) - new Date(threads[windowIndex][ind - 1].time) >= 1800000) && DateTime.fromJSDate(new Date(convo.time)).toLocaleString(DateTime.DATETIME_SHORT)}</div>
                            <div style={{ marginLeft: !convo.doctor && "auto", backgroundColor: !convo.doctor && "#E8EDFF" }} className="message"><span style={{ display: convo.doctor ? "inline" : "none", paddingRight: "10px" }} role="img" aria-label="doctor">🧑‍⚕️</span>{convo.message}</div>
                        </div>
                    ))}
                </chatwindow>

                <newmessage>
                    <form onSubmit={windowIndex === -1 ? handlePostNewThread : handlePostMessage}>
                        <div id="radio">
                            <div>
                                <input type="radio" required name="doctororpatient" value="doctor" onChange={handleRadio}></input>
                                <label htmlFor="doctor">Doctor</label>
                            </div>
                            <div>
                                <input type="radio" name="doctororpatient" value="patient" onChange={handleRadio}></input>
                                <label htmlFor="patient">Patient</label>
                            </div>
                        </div>
                        <textarea required value={pendingMessage} onChange={handleText} id="input" maxLength="1200"></textarea>
                        <input type="submit" value={windowIndex === -1 ? "Post New Thread" : "Add Message"} id="submitbtn"></input>
                    </form>
                </newmessage>
            </mainbar>
        </container>
    );
}