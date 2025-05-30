export function getBearing(lat1, lon1, lat2, lon2){
    const toRad = deg => deg * Math.PI/180;
    const y = Math.sin(toRad(lon2-lon1)) * Math.cos(toRad(lat2));
    const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360 % 360);
}