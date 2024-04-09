const array = process.env.EVENT_ISSUE_BODY.split("### ")
const nonascii = /[^\u0000-\u007F]+/
array.forEach((item, index) => {
  array[index] = item.split("\n\n")
})
const original = array[3][1]
array[3][1] = original.split("\n")[0]
array[3].push(original.split("\n")[1])
if (
  !(
    array.length == 4 &&
    array[0].length == 1 &&
    array[0][0] == "" &&
    array[1][0] == "Subdomain Name" &&
    array[1].length == 3 &&
    array[2][0] == "DNS Record" &&
    array[2].length == 3 &&
    array[3].length == 3 &&
    array[3][0] == "Agreement" &&
    array[3][1] ==
      "- [X] I have ensured that no one registered this subdomain" &&
    array[3][2] ==
      "- [X] I have ensured that I did not reach the five subdomain limit" &&
    !array[1][1].includes(" ") &&
    !array[2][1].includes(" ") &&
    !nonascii.test(array[1][1]) &&
    !nonascii.test(array[2][1]) &&
    array[1][1] != ".is-probably.gay" &&
    array[1][1].endsWith(".is-probably.gay")
  )
) {
  return console.log(
    "not planned|Format invalid! It's usually because you didn't check the agreements, or the domain/record you entered is invalid!|"+array[1][1]
  )
}
var flare = require("cloudflare")
var cf = new flare({
  token: process.env.CF_TOKEN,
})
const ipv4 =
  /^\s*((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))\s*$/gm
const ipv6 =
  /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/gm
const hostname =
  /^\s*((?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?)*\.?)\s*$/gm
cf.dns.records.list({ zone_id: "2bf779292ec80723b8b7a94bb651ea7d" }).then((records) => {
  const availabilityFilter = records.result.filter((record) => {
    return record.name == array[1][1]
  })
  if (availabilityFilter[0]) {
    return console.log(
      "not planned|This subdomain was taken, please try another subdomain!|"+array[1][1]
    )
  }
  const countFilter = records.result.filter((record) => {
    return record.comment == process.env.EVENT_USER_LOGIN
  })
  if (countFilter.length == 5) {
    return console.log(
      "not planned|You have reached your 5 subdomain limit, please consider deleting some.|"+array[1][1]
    )
  }
  var type = "invalid"
  if (hostname.test(array[2][1])) type = "CNAME";
  if (ipv4.test(array[2][1])) type = "A";
  if (ipv6.test(array[2][1])) type = "AAAA";
  if (type == "hostname"&&!array[2][1].includes(".")) type = "invalid"
  if (type == "invalid") {
    return console.log(
      "not planned|The record destination you entered is invalid!|"+array[1][1]
    )
  }
  cf.dns.records
    .add({ zone_id: "2bf779292ec80723b8b7a94bb651ea7d" }, {
      zone_id: "2bf779292ec80723b8b7a94bb651ea7d",
      content: array[2][1],
      name: array[1][1],
      proxied: false,
      type: type,
      ttl: 60,
      comment: process.env.EVENT_USER_LOGIN,
    })
    .then((response) => {
      if (!response.success) {
        return console.log(`not planned|CloudFlare Error:${response.errors[0].message}|${array[1][1]}`)
      }
      console.log(
        "completed|Your subdomain has been successfully registered! Enjoy it!|"+array[1][1]
      )
    })
    .catch(e=>{return console.log(`not planned|Error occurred! Dump: Domain:${array[1][1]} Content:${array[2][1]} Type:${type}|${array[1][1]}`)})
})
