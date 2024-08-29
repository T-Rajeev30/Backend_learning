require('dotenv').config()
const express = require('express')
const app = express()
const port = 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})
const githubData = {
    "login": "T-Rajeev30",
    "id": 113722532,
    "node_id": "U_kgDOBsdEpA",
    "avatar_url": "https://avatars.githubusercontent.com/u/113722532?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/T-Rajeev30",
    "html_url": "https://github.com/T-Rajeev30",
    "followers_url": "https://api.github.com/users/T-Rajeev30/followers",
    "following_url": "https://api.github.com/users/T-Rajeev30/following{/other_user}",
    "gists_url": "https://api.github.com/users/T-Rajeev30/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/T-Rajeev30/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/T-Rajeev30/subscriptions",
    "organizations_url": "https://api.github.com/users/T-Rajeev30/orgs",
    "repos_url": "https://api.github.com/users/T-Rajeev30/repos",
    "events_url": "https://api.github.com/users/T-Rajeev30/events{/privacy}",
    "received_events_url": "https://api.github.com/users/T-Rajeev30/received_events",
    "type": "User",
    "site_admin": false,
    "name": "Rajeev Tiwari",
    "company": null,
    "blog": "",
    "location": null,
    "email": null,
    "hireable": null,
    "bio": null,
    "twitter_username": null,
    "public_repos": 14,
    "public_gists": 0,
    "followers": 0,
    "following": 3,
    "created_at": "2022-09-16T19:33:44Z",
    "updated_at": "2024-08-16T23:18:31Z"
  }


app.get('/twitter' ,(req, res)=>{
    res.send('Rajeev Tiwari')
})
app.get('/login' , (req, res) => {
    res.send('<h1>Welcome Back</h1>')
})
app.get('/youtube' , (req, res) => {
    res.send('<h2>Welcome coffee Lover</h2>')
})
app.get('/github' ,(req, res) =>{
  res.json(githubData)

})
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})