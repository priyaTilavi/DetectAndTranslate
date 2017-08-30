var api_key = 'AIzaSyCSkJzCc7-jPArWHMYCeWSaIstDTzO7iYY';
var googleTranslate = require('google-translate')(api_key);
var query = 'hallo';
exports.translate = function(req,res){
    googleTranslate.translate({'q':query}, function(err, translation) {
        console.log(translation);
})
}

