const array = process.env.EVENT_ISSUE_BODY.split("### ")
const nonascii = /[^\u0000-\u007F]+/
array.forEach((item, index) => {
  array[index] = item.split("\n\n")
})
if (
  !(
    array[0].length == 1 &&
    array[0][0] == "" &&
    array[1].length == 2 &&
    array[1][0] == "Subdomain Name" &&
    !array[1][1].includes(" ") &&
    !nonascii.test(array[1][1]) &&
    array[1][1] != ".is-probably.gay" &&
    array[1][1].endsWith(".is-probably.gay")
  )
)
  return console.log("not planned|The domain you entered is invalid!|"+array[1][1])
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
var type = "invalid"
if (hostname.test(array[1][1])) type = "CNAME"
if (ipv4.test(array[1][1])) type = "A"
if (ipv6.test(array[1][1])) type = "AAAA"
if (type == "hostname" && !array[1][1].includes(".")) type = "invalid"
if (type == "invalid") {
  return console.log(
    "not planned|The record destination you entered is invalid!|"+array[1][1]
  )
}
cf.dnsRecords.browse("2bf779292ec80723b8b7a94bb651ea7d").then((records) => {
  const availabilityFilter = records.result.filter((record) => {
    return record.name == array[1][1]
  })
  if (availabilityFilter[0]) {
    return console.log(
      `completed|Here's the domain info:\\nRecord Type: ${availabilityFilter[0].type}\\nRecord Content: ${availabilityFilter[0].content}\\nDomain Owner: ${availabilityFilter[0].comment}\\nRegistered On: ${availabilityFilter[0].created_on}\\nLast Modified: ${availabilityFilter[0].modified_on}|${array[1][1]}`
    )
  } else {
    return console.log(
      "completed|Domain not found! That means you can register it!|"+array[1][1]
    )
  }
})
