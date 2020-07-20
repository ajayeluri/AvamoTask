const fetch = require('node-fetch')
const axios = require('axios');

let url = "http://norvig.com/big.txt";

fetch(url)
    .then(response => response.text())
    .then(data => {
        var wordsArr = splitWords(data)
        var words = wordsCount(wordsArr)
        var count = sortByCount(words)
        
        //top 10 words
         jsonObj =[]
        for(var i=0;i<10;i++){
            axios({
                method: 'post',
                url: 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf&lang=en-en&text='+`${count[i].name}`,
              })
                .then(function (response) {
                 jsonObj.push({"word":`${count[i].name}`})
                 item ={}
                 item["count"] = `${count[i].total}`
                 if(response.data.def[0].hasOwnProperty(pos)){
                 item["Pos"] =response.data.def[0].pos
                }else{
                    item["Pos"] =""
                }
                 jsonObj.push(item)
                 //item[""] =response.data.def[0].pos
                 //console.log(response.data.def[0].pos)
                });  

        }
       console.log(JSON.stringify(jsonObj))
    });


function splitWords(text) {
    var wordsArr = text.split(/\s+/)
    return wordsArr;
}

function wordsCount(wordsArr) {
    var words = {}

    wordsArr.forEach(function (key) {
        
            if (words.hasOwnProperty(key)) {
                words[key]++;
            } else {
                words[key] = 1
            }
        
    });
    return words;
}

function sortByCount(words) {
    var topTenWords = [];
    topTenWords = Object.keys(words).map(function (key) {
        return {
            name: key,
            total: words[key]
        };
    });
    topTenWords.sort(function (a, b) {
        return b.total -a.total;
    });
    return topTenWords;
}