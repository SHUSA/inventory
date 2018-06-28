const mongoose = require('mongoose')
const Schema = mongoose.Schema

const IssuesSchema = new Schema({
  date: {type: Date, default: Date.now},
  issue: {type: {}},
  location: {type: String}
})

module.exports.issue = (issue, location) => {
  const issues = {
    issue: issue,
    location: location
  }

  const newIssue = new IssuesSchema(issues)
  newIssue.save((err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('saved issue')
    }
  })
}
