const fs = require('fs');
const {google} = require('googleapis');
const colors = require('./colors');
const auth = require("./auth");

var blueEvents = []
var redEvents = []
var greenEvents = []

const main = async () => {
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err)
    auth.authorize(JSON.parse(content), listEvents)
  })
}


async function listEvents(auth) {
    try {
        const calendar = google.calendar({version: 'v3', auth})
        const res = await calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        })
        const events = res.data.items
        if (events.length) {
            events.map((event) => {
              if (event.colorId === colors.blue) blueEvents.push(event)
              else if (event.colorId === colors.red) redEvents.push(event)
              else if (event.colorId === colors.green) greenEvents.push(event)
              })
            console.log("blue events: " + blueEvents.length)
            console.log("red events: " + redEvents.length)
            console.log("green events: " + greenEvents.length)
        }            
    }
    catch (err) {
        console.log(err)
    }
}

main()