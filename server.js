//@ts-check
// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
const fs = require("fs");
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3001;


//sets up data
const dataTablePath = path.join(__dirname, "data/tables.json")
// if (!fs.existsSync(path)) {
//     console.log("data/tables.json didnt exists so it was created :)")
//     fs.writeFileSync(dataTablePath, JSON.stringify({
//         tables: []
//     }));
// }
// else {
//     fs.readFileSync(dataTablePath, "UTF-8", function (err, stringdata) {
//         console.log("stored data:\n\n", stringdata)
//     });
// }

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/home.html"));
});
app.get("/home", function (req, res) {
    res.sendFile(path.join(__dirname, "public/home.html"));
});
app.get("/res", function (req, res) {
    res.sendFile(path.join(__dirname, "public/res.html"));
});
app.get("/table", function (req, res) {
    res.sendFile(path.join(__dirname, "public/tables.html"));
});

app.post("/api/setres", function (req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    var reservation = req.body;
    console.log(reservation);

    //id, name, email, phone
    fs.readFile(dataTablePath, "UTF-8", function (err, stringdata) {

        let tabledata = JSON.parse(stringdata);
        console.log("data:", tabledata);

        tabledata.tables.push(reservation);
        fs.writeFile(dataTablePath, JSON.stringify(tabledata), function (err) {
            if (err) { console.log("err", err); }
        });
    })

});
app.post("/api/getres", function (req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    var waitlist = req.body;
    console.log(waitlist);

    //id, name, email, phone

    fs.readFile(dataTablePath, "UTF-8", function (err, stringdata) {
        let returndata = JSON.parse(stringdata);

        let first5 = returndata.tables.slice(0, 5);
        console.log("first5: ", first5);
        let waitlist;
        console.log(returndata.tables.length);
        if (returndata.tables.length > 5) {
            waitlist = returndata.tables.slice(5, returndata.tables.length + 1);
            console.log("waitlist: ", waitlist)
        }
        res.json(
            { "tables": first5, "waitlist": waitlist, }
        );
    })
});


app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

/*
  --data '{"name":"abhi","id":"id1","phone":"taksd","email":"abhi@gmail.com"}' \

curl --header "Content-Type: application/json" \
  --request POST \
    --data '' \
  http://localhost:3000/api/getres
*/