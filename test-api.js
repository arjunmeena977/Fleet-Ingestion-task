const http = require('http');

const postData = (path, data) => {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });

    req.on('error', (error) => {
        console.error(error);
    });

    req.write(data);
    req.end();
};

const getData = (path) => {
    http.get(`http://localhost:3000${path}`, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log(JSON.parse(data));
        });
    }).on('error', (err) => {
        console.log("Error: " + err.message);
    });
}


const meterData = JSON.stringify({
    meterId: 'meter-001',
    kwhConsumedAc: 100,
    voltage: 240,
    timestamp: new Date().toISOString()
});

const vehicleData = JSON.stringify({
    vehicleId: 'vehicle-A',
    soc: 80,
    kwhDeliveredDc: 85, // Efficiency 0.85
    batteryTemp: 25,
    timestamp: new Date().toISOString()
});

// Wait for server to start then run
setTimeout(() => {
    console.log('Sending Meter Data...');
    postData('/v1/ingestion', meterData);

    setTimeout(() => {
        console.log('\nSending Vehicle Data...');
        postData('/v1/ingestion', vehicleData);

        setTimeout(() => {
            console.log('\nGetting Analytics...');
            getData('/v1/analytics/performance/vehicle-A');
        }, 2000);
    }, 1000);
}, 5000);
