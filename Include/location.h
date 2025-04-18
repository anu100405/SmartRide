#ifndef LOCATION_H
#define LOCATION_H
#include <string>
#include <map>

using namespace std;

struct Location {
    std::string name;
    double lat;
    double lon;
};

map<string, Location> getPredefinedLocations(); // Function to get predefined locations
double haversine(double lat1, double lon1, double lat2, double lon2); // Function to calculate distance between two coordinates using Haversine formula
#endif
