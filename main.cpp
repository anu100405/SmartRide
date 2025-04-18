#include "./Include/main.h"

int main()
{
    auto locations = getPredefinedLocations();

    string source, dest;
    cout << "Enter source: ";
    getline(cin, source);
    cout << "Enter destination: ";
    getline(cin, dest);

    if (locations.count(source) && locations.count(dest))
    {
        double dist = haversine(locations[source].lat, locations[source].lon,
                                locations[dest].lat, locations[dest].lon);
        cout << "Calculated Distance = " << dist * 1.1 << " km\n"; // dist*1.1 adds ~10% road curve buffer
    }

    return 0;
}
