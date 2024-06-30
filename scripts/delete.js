const array = process.env.EVENT_ISSUE_BODY.split("### ")
const nonascii = /[^\u0000-\u007F]+/
array.forEach((item, index) => {
  array[index] = item.split("\n\n")
})
const original = array[3][1]
array[3][1] = original.split("\n")[0]
array[3].push(original.split("\n")[1])
//return console.log(array)
if (
  !(
    array.length == 4 &&
    array[0].length == 1 &&
    array[0][0] == "" &&
    array[1][0] == "Subdomain Name" &&
    array[1].length == 3 &&
    array[2].length == 3 &&
    array[2][0] == "Agreement" &&
    array[2][1] == "- [X] I have ensured that this subdomain is mine" &&
    array[2][2] == "" &&
    array[3].length == 3 &&
    array[3][0] == "Type your domain name + DELETE to confirm" &&
    array[3][1] == `${array[1][1]} DELETE` &&
    array[3][2] == undefined &&
    !array[1][1].includes(" ") &&
    !nonascii.test(array[1][1]) &&
    array[1][1] != ".is-probably.gay" &&
    array[1][1].endsWith(".is-probably.gay")
  )
) {
  return console.log(
    "not planned|Format invalid! It's usually because you didn't check the agreements, or the domain/record you entered is invalid!|" +
      array[1][1]
  )
}
var flare = require("cloudflare")
var cf = new flare({
  apiToken: process.env.CF_TOKEN,
})
cf.dns.records
  .list({
    zone_id: "2bf779292ec80723b8b7a94bb651ea7d",
    name: array[1][1],
    comment: { exact: process.env.EVENT_USER_LOGIN },
    per_page: 5000000,
  })
  .then((records) => {
    const availabilityFilter = records.result.filter((record) => {
      return (
        record.name == array[1][1] &&
        record.comment == process.env.EVENT_USER_LOGIN
      )
    })
    if (availabilityFilter[0]) {
      cf.dns.records
        .delete(availabilityFilter[0].id, {
          zone_id: "2bf779292ec80723b8b7a94bb651ea7d",
        })
        .then((response) => {
          return console.log(
            "completed|Your subdomain has been successfully deleted!|" +
              array[1][1]
          )
        })
    } else {
      return console.log(
        "not planned|This subdomain is not yours or the subdomain is not found!|" +
          array[1][1]
      )
    }
  })
