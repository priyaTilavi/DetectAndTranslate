var http = require('https');
var request = require('request');
var fs = require('fs');
var csvWriter = require('csv-write-stream');
var writer = csvWriter({ headers: ["GoogletranslatedText"]});
writer.pipe(fs.createWriteStream('out.csv'));
var baseURL = 'https://www.googleapis.com/language/translate/v2?key=AIzaSyCSkJzCc7-jPArWHMYCeWSaIstDTzO7iYY&target=en&q=';
var sysBaseURL = 'https://api-platform.systran.net/nlp/lid/detectLanguage/paragraph?key=1051ecf3-4a10-41eb-ad73-18ee21e8dd68&input=';
var sysTranslateURL = 'https://api-platform.systran.net/translation/text/translate?key=1051ecf3-4a10-41eb-ad73-18ee21e8dd68&target=en&input=';
//var microBaseURL = 'https://api.microsofttranslator.com/V2/Http.svc/Detect?text=';
  fs.readFile('asia.txt','utf8', function(err, data) {
      var keys= splitValue(data);
      detectKeys(keys);
  });

  function splitValue(parameter){
    return parameter.split('\n');
  }

  function detectKeys(keys) {
      Promise.all([sysApiConvertions(keys),]).then(function (result) {
          fs.writeFile('a.csv', 'sysDetectLanguage,\n'.concat(result[0].join(',\n')), function (res,err) {
              if(err){
                  console.log(err);
              }
          })
      });

  }

  function googleApiConvertions(keys) {
      var googlePromise = keys.reduce(function (result, key) {
          var tempPromise = new Promise(function (res) {
              http.get(encodeURI(baseURL+key),function (response,error) {
                  if(error){
                      console.log(error);
                  }
                  console.log(baseURL+key);
                  response.on('data', (d) => {
                      var translateJson = JSON.parse(d.toString());
                      var translatedText = translateJson.data.translations[0].detectedSourceLanguage;
                      res(translatedText);
                });
              })
          });
          result.push(tempPromise);
          return result;
      },[]);
      return new Promise(function(resolve){
          Promise.all(googlePromise).then(function (data) {
              resolve(data);
          })
      });
  }

    function sysApiConvertions(keys) {
        var googlePromise = keys.reduce(function (result, key) {
            var tempPromise = new Promise(function (res) {
                http.get(encodeURI(sysTranslateURL+key),function (response,error) {
                    if(error){
                        console.log(error);
                        res(error);
                    }
                    console.log(sysTranslateURL+key);
                    response.on('error', (d) => {
                        var translateJson = JSON.parse(d.toString());
                        res('error');
                    });
                    response.on('data', (d) => {
                        var translateJson = JSON.parse(d.toString());
                        var detect = translateJson.outputs[0].output;
                        res(detect);
                    });
                })
            });
            result.push(tempPromise);
            return result;
        },[]);
        return new Promise(function(resolve){
            Promise.all(googlePromise).then(function (data) {
                resolve(data);
            })
        });
    }

function microApiConvertions(keys) {
    var microsoftPromise =  keys.reduce(function (result, key) {
        var tempPromise = new Promise(function (res) {
            request.get({url: encodeURI(microBaseURL+key),
            headers: {
                'Ocp-Apim-Subscription-Key': 'ce1b405424f34aac93c469ec49d17fdb'
            },
            method: 'GET'},function (error,re, body) {
                if(error){
                    console.log(error);
                }
                res(body.toString().replace(/<[^>]*>/g,''));
            });
        });
        result.push(tempPromise);
        return result;
    },[]);
    return new Promise(function(resolve){
        Promise.all(microsoftPromise).then(function (data) {
            resolve(data);
        })
    });
}

