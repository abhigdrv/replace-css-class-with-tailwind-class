var express = require('express');
const replaceInlineCss = require('replace-inline-css');
var app = express();
var cors = require('cors')
app.use(cors())

var fConverted = null;
var fConvertedHtml = null;
app.set('view engine', 'hbs')

const path = require("path")
const publicDir = path.join(__dirname, './public')
app.use(express.static(publicDir))

app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())

app.get('/', function (req, res) {
  res.render("index")
});

app.get('/register', function(req, res){
  res.render("register");
});
app.get('/inline', function(req, res){
  res.render("inline");
});

app.get('/getStyle', function(req, res){
  return res.json(
    {
      data:fConverted
    }
  );
})

app.get('/getHtml', function(req, res){
  return res.json(
    {
      data:fConvertedHtml
    }
  );
})



app.post("/inline-css", (req, res) => { 
  const { data } = req.body
  if(data != null && data != undefined){
    var convertedData = replaceInlineCss(data);
    var styles = convertedData.slice(convertedData.indexOf('<style>')+7,convertedData.indexOf('</style>'))
    var finalHtml = convertedData.slice(convertedData.indexOf('<body>')+6,convertedData.indexOf('</body>'))
    fConverted = styles
    fConvertedHtml = finalHtml
    return res.render('inline', {
      data: convertedData,
      styles:styles,
      finalHtml: finalHtml
    })
  }  
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});