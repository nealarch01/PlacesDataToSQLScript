// Places imports
import AmusementPark from "./PlacesData/amusement-park.json";
import Aquarium from "./PlacesData/aquarium.json";
import Arcade from "./PlacesData/arcade.json";
import Bakery from "./PlacesData/bakery.json";
import Bar from "./PlacesData/bar.json";
import Bowling from "./PlacesData/bowling.json";
import Cafe from "./PlacesData/cafe.json";
import Casino from "./PlacesData/casino.json";
import FarmersMarket from "./PlacesData/farmers-market.json";
import Museum from "./PlacesData/museum.json";
import NightClub from "./PlacesData/night-club.json";
import Parks from "./PlacesData/parks.json";
import Restaurant from "./PlacesData/restaurant.json";
import ShoppingMalls from "./PlacesData/shopping-malls.json";
import ThriftStores from "./PlacesData/thrift-stores.json";
import Trails from "./PlacesData/trails.json";

// Library imports
import fs from "fs"; // Node file system

const allPlaces = [
    AmusementPark,
    Aquarium,
    Arcade,
    Bakery,
    Bar,
    Bowling,
    Cafe,
    Casino,
    FarmersMarket,
    Museum,
    NightClub,
    Parks,
    Restaurant,
    ShoppingMalls,
    ThriftStores,
    Trails
];

// formatting of the fields / column names of tags in the MySQL Database
// **** THIS HAS TO BE IN THE SAME ORDER AS allPlaces ARRAY
const placeTags = [
    "amusement-park",
    "aquarium",
    "arcade",
    "bakery",
    "bar",
    "bowling",
    "cafe-coffee",
    "casino",
    "farmers-market",
    "museum",
    "nightclub",
    "parks",
    "restaurant",
    "shopping-malls",
    "thrift-stores",
    "trails"
];

interface PlaceInterface {
    placeID: null | number; // placeID should be null by default, MySQL has an auto incrementer
    placeName: string;
    address: string;
    city: string;
    state: string; // Length must == 2
    placeDescription?: string;
}

// Map data structure to insert a place into MySQL DB
const uniquePlacesMap: Map<string, number> = new Map<string, number>(); // Global declaration for global and program lifetime access

// Map data structure for the junction table (N to M relationship of Place to Tag)
const placesAssocTagMap: Map<string, Array<string>> = new Map<string, Array<string>>(); // Map for the junction table


// write and format to markdown for display purposes
function writeToMD(): number {
    const filename: string = "./places-and-tags.md";
    try {
        fs.writeFileSync(filename, "```\n"); // Clear the readme to re-write with new data
        const mapKeys = placesAssocTagMap.keys();
        for (const key of mapKeys) {
            const displayText: string = `'${key}' => [ ${placesAssocTagMap.get(key)} ]\n`;
            fs.writeFileSync(filename, displayText, { flag: "a" }); // Flag sets append mode on
        }
        fs.writeFileSync(filename, "```", { flag: "a" }); // closing tag
    } catch (err) {
        console.log("There was an error trying to write to readme");
        fs.writeFileSync(filename, "```", { flag: "a" }); // closing tag
        return -1;
    }
    return 0; // Successful run
}

function writeToSQLScript_Places(): number {
    let valuesQuery = "VALUES(";

    valuesQuery += ")";
    return 0;
}

// For the junction table
function writeToSQLScript_PlaceDetails(): number {
    return 0;
}

// For the 
function writeToSQLScript_Tags(): number {
    const filename: string = "insert-tags.sql";
    try {
        fs.writeFileSync(filename, "INSERT INTO tag (label) VALUES"); // Do not set to append mode to reset any existing data in the script
        for (let i = 0; i < placeTags.length; i++) {
            fs.writeFileSync(filename, `('${placeTags[i]}')`, { flag: "a" });
            if (i == placeTags.length - 1) {
                fs.writeFileSync(filename, ";", { flag: "a" });
            } else {
                fs.writeFileSync(filename, ", ", { flag: "a" });
            }
        }
    } catch (err) {
        console.log("There was an error trying to write to ScriptTags");
        return -1;
    }
    return 0;
}

// Group the places to avoid duplicate rows
function initPlacesMapData(): number {
    // Use a map structure
    allPlaces.forEach((placeType: any, index: number) => {
        let placeTypeStr: string = placeTags[index];
        placeType.results.forEach((placeData: any) => {
            let placeKey: string | undefined = placeData.name;
            if (placeKey === undefined) {
                return; // Skip the place if name does not exist
            }
            let placeCount: number | undefined = uniquePlacesMap.get(placeKey);
            if (placeCount === undefined) { // First time place is being read
                uniquePlacesMap.set(placeKey, 1); // Assign 1 instance found
                let first_assocTagsArray: Array<string> = [placeTypeStr]; // Initialize the associated tags array with the current tag
                placesAssocTagMap.set(placeKey, first_assocTagsArray); // Assign associated tags as value to the place key for places-tags map
            } else {
                // This mean the same place popped up twice or more
                placeCount++; // increase the count
                uniquePlacesMap.set(placeKey, placeCount); // update place count value

                // We need to assign it's multiple associated tags (if it showed up in another file)
                let assocTagsArray: Array<string> | undefined = placesAssocTagMap.get(placeKey);
                if (assocTagsArray === undefined) { // First tag instance
                    placesAssocTagMap.set(placeKey, [placeTypeStr]);
                    return;
                }
                if (assocTagsArray.includes(placeTypeStr)) {
                    return; // do not include twice
                }
                assocTagsArray.push(placeTypeStr);
                placesAssocTagMap.set(placeKey, assocTagsArray);
            }
        });
    });
    return 0;
}


// Notes: Tags will be its own table
function main(): number {
    if (initPlacesMapData() !== 0) {
        return 1;
    }
    if (writeToMD() !== 0) {
        return 2;
    }
    if (writeToSQLScript_Tags() !== 0) {
        return 3;
    }
    return 0;
}

// Error code 1: initPlacesMapData
// 2: writeToMD
// 3: write

const exitStatus = main();
if (exitStatus !== 0) {
    console.log(`An error has occured. Exit status: ${exitStatus}`);
} else {
    console.log(`Program terminated with no errors`);
}