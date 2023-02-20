var express = require('express');
const replaceInlineCss = require('replace-inline-css');
var app = express();
var cors = require('cors')
app.use(cors())

const {JSDOM} = require('jsdom');

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
    convertedData = handleLowerCaseIssue(req.body.data, finalHtml, convertedData);
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


function handleLowerCaseIssue(oldText, newText, convertedData){
  var newStr = convertedData;
  var document = new JSDOM(newStr).window.document;
  var doc = document.documentElement;
  const elements = doc.getElementsByTagName('*');
  for (let i = 0; i < elements.length; i++) {
    var attributes = elements[i].attributes;
    if(attributes){
      for (let j = 0; j < attributes.length; j++) {
        var index = oldText.toLocaleLowerCase().indexOf(attributes[j].name);
        if (index !== -1) {
          const extractedString = oldText.substr(index, attributes[j].name.length);
          newStr = newStr.replaceAll(attributes[j].name, extractedString);
        }
      }
    }
  }
  return newStr
}
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});