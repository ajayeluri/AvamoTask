const fetch = require('node-fetch')
const axios = require('axios');

let url = "http://norvig.com/big.txt";
/** fetches the document from a given url */
fetch(url)
    .then(response => response.text())
    .then(data => {
        var wordsArr = splitWords(data)
        var words = wordsCount(wordsArr)
        var count = sortByCount(words)
        jsonArr = []
        for (var i = 0; i < count.length; i++) {
            item = {}
            item["Count"] = count[i].total
            item["Word"] = count[i].name
            jsonArr.push(item)
            dictCall(count[i].name).then(result => {
                let dictRes = result.data.def[0]
                if (dictRes != null) {
                    JsonOutput = []
                    for (var j = 0; j < jsonArr.length; j++) {
                        if (jsonArr[j].Word === result.data.def[0].text) {
                            // console.log(result.data.def[0].pos)
                            items = {}
                            items["Count"] = jsonArr[j].Count
                            items["Word"] = jsonArr[j].Word
                            items["Pos"] = result.data.def[0].pos

                            JsonOutput.push(items)

                        }
                    }
                   
                    console.log(JSON.stringify(JsonOutput))
                }

            })

        }
    });

/**function will split the words in doc by empty space */
function splitWords(text) {
    var wordsArr = text.split(/\s+/)
    return wordsArr;
}

/** function counts the repeated words in a words array. */
function wordsCount(wordsArr) {
    var words = {}

    wordsArr.forEach(key => {

        if (words.hasOwnProperty(key)) {
            words[key]++;
        } else {
            words[key] = 1
        }

    });
    return words;
}
/** underlying function will sorts word count in descending order and returns top 10 words by occurance. */
function sortByCount(words) {
    var topTenWords = [];
    topTenWords = Object.keys(words).map(key => {
        return {
            name: key,
            total: words[key]
        };
    });
    topTenWords.sort((a, b)=>{
        return b.total - a.total;
    });
    return topTenWords.slice(0, 12);
}
/** underlying function will will call the dictionary api and returns the response. */
async function dictCall(word) {
    //top 10 words
    try {
        const resp = await axios({
            method: 'post',
            url: 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf&lang=en-en&text=' + `${word}`
        })
        const data = resp
        return data;
    } catch (error) {
        console.log(error)
    }
}