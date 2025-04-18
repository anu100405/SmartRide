#include "../Include/location.h"
#include <cmath>

map<string, Location> getPredefinedLocations() {
    return {
        { "ISBT", {"ISBT", 30.2900, 77.9900} },
        { "Clock Tower", {"Clock Tower", 30.3256, 78.0437} },
        { "Railway Station", {"Railway Station", 30.3150, 78.0335} },
        { "Graphic Era", {"Graphic Era", 30.2700, 78.0800} },
        { "Pacific Mall", {"Pacific Mall", 30.3350, 78.0650} }
    };
}

double haversine(double lat1, double lon1, double lat2, double lon2) {
    const double R = 6371;
    double dLat = (lat2 - lat1) * M_PI / 180.0;
    double dLon = (lon2 - lon1) * M_PI / 180.0;
    lat1 = lat1 * M_PI / 180.0;
    lat2 = lat2 * M_PI / 180.0;

    double a = pow(sin(dLat / 2), 2) +
               pow(sin(dLon / 2), 2) * cos(lat1) * cos(lat2);
    double c = 2 * atan2(sqrt(a), sqrt(1 - a));
    return R * c;
}
