const dns = require("dns");

let url = "http://forum.freecodecamp.org/t/"
  .replace("http://", "")
  .replace("https://", "");

dns.lookup(url, (err, val) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(val);
});
