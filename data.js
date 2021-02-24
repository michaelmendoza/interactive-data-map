
const random = (min, max) => {
    return Math.random() * (max - min) + min;
};

const randomCircle = (center, radius) => {
    let rRadius = random(0, radius);
    let rAngle = random(-Math.PI, Math.PI)    
    let x = rRadius * Math.cos(rAngle) + center[0];
    let y = rRadius * Math.sin(rAngle) + center[1];
    return [x, y]
}

function mockData(N) {
    geoCenter = [0,20];
    geoLocs = Array.from({ length:N }, (_, i) => randomCircle(geoCenter, 40))
    return geoLocs;
}

window.data = {
    mockData: mockData
}


//Algo -> Filter from Shape
//Algo -> Group by Shape 