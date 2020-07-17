var http = require('http'),
    https = require('https'),
    fs = require('fs');

var getOptions = function (options, method) {
    options.method = method;
    if (options.headers) {
        options.headers['Content-Type'] = 'application/json';
    } else {
        options.headers = {
            'Content-Type': 'application/json',
            //'Content-Length': Buffer.byteLength(post_data)
        };
    }
    return options;
};

//need to get the existing pins.
var sendAPI = function (protocol, post_options, post_data) {
    /*console.log({
        protocol: protocol,
        post_options: post_options,
        post_data: post_data
    });*/
    return new Promise(function (resolve, reject) {
        // Set up the request
        var post_req = protocol.request(post_options, function (res) {
            res.setEncoding('utf8');
            var receivedData = "";
            res.on('data', function (chunk) {
                //console.log('Response: ' + chunk);
                receivedData += chunk.toString();
            });
            res.on('end', function () {
                /*console.log({
                    receivedData: receivedData
                });*/
                if (receivedData)
                    resolve(JSON.parse(receivedData));
                else
                    reject("No data");
            });
            res.on('error', function (err) {
                reject(err);
            });
        });

        // post the data
        if (post_data)
            post_req.write(post_data);

        post_req.end();
    });
};

var sendPost = function (protocol, options, data) {
    var post_data = JSON.stringify(data);
    var post_options = getOptions(options, 'POST');
    post_options.headers['Content-Length'] = Buffer.byteLength(post_data);
    //console.log(post_options);
    // Set up the request
    return sendAPI(protocol, post_options, post_data);
};

var sendPut = function (protocol, options, data) {
    var post_data = JSON.stringify(data);
    var post_options = getOptions(options, 'PUT');
    post_options.headers['Content-Length'] = Buffer.byteLength(post_data);

    //console.log(post_options);
    // Set up the request
    return sendAPI(protocol, post_options, post_data);
};

var sendGet = function (protocol, options) {
    var post_options = getOptions(options, 'GET');
    delete post_options.headers['Content-Length'];
    //console.log(post_options);
    return sendAPI(protocol, post_options, undefined);
};

var httpAPI = {
    httpGet: function (host, port, path, headers) {
        var options = {
            host: host,
            port: port,
            path: path,
            headers: headers
        };
        return sendGet(http, options);
    },
    httpsGet: function (cert, host, port, path, headers) {
        var options = {
            host: host,
            port: port,
            path: path,
            headers: headers
        };
        if (cert)
            options.ca = fs.readFileSync(cert);
        return sendGet(https, options);
    },
    httpPost: function (host, port, path, headers, data) {
        var options = {
            host: host,
            port: port,
            path: path,
            headers: headers
        };
        return sendPost(http, options, data);
    },
    httpsPost: function (cert, host, port, path, headers, data) {
        var options = {
            host: host,
            port: port,
            path: path,
            ca: fs.readFileSync(cert),
            headers: headers
        };
        return sendPost(https, options, data);
    },
    httpPut: function (host, port, path, headers, data) {
        var options = {
            host: host,
            port: port,
            path: path,
            headers: headers
        };
        return sendPut(http, options, data);
    },
    httpsPut: function (cert, host, port, path, headers, data) {
        var options = {
            host: host,
            port: port,
            path: path,
            ca: fs.readFileSync(cert),
            headers: headers
        };
        return sendPut(https, options, data);
    }
};

module.exports = httpAPI;