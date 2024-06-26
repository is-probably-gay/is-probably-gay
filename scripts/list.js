var flare = require("cloudflare")
var cf = new flare({
  apiToken: process.env.CF_TOKEN,
})
cf.dns.records
  .list({
    zone_id: "2bf779292ec80723b8b7a94bb651ea7d",
    comment: { exact: process.env.EVENT_USER_LOGIN },
    per_page: 5000000
  })
  .then((records) => {
    const availabilityFilter = records.result.filter((record) => {
      return record.comment == process.env.EVENT_USER_LOGIN
    })
    if (availabilityFilter[0]) {
      const mappedRecords = availabilityFilter.map((record) => {
        return record.name
      })
      return console.log(
        `completed|Your subdomains:\\n${mappedRecords.join("\\n")}`
      )
    } else {
      return console.log("completed|You don't have any subdomains!")
    }
  })
