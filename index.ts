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
    placeID: number | null; // placeID should be null by default, MySQL has an auto incrementer
    placeName: string;
    address: string | null;
    city?: string | null;
    state?: string | null; // Length must == 2
    postalCode?: number | null;
    placeDescription?: string;
}

// Map data structure to insert a place into MySQL DB
// const uniquePlacesMap: Map<string, number> = new Map<string, number>(); // Global declaration for global and program lifetime access
const placeMap: Map<string, PlaceInterface> = new Map<string, PlaceInterface>();
// Map data structure for the junction table (N to M relationship of Place to Tag)
const placesAssocTagMap: Map<string, Array<string>> = new Map<string, Array<string>>(); // Map for the junction table


// write and format to markdown for display purposes
function writeToMD(): number {
    const filename: string = "./places-and-tags-2.md";
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
    const filename: string = "./insert-places.sql";
    try {
        fs.writeFileSync(filename, "INSERT INTO place (address, name, city, state, postalCode, rating, description) \nVALUES\n");
        const mapKeys = placeMap.keys();
        let mkSize = placeMap.size;
        let counter: number = 0;
        for (const key of mapKeys) {
            counter++;
            const singlePlace: PlaceInterface | undefined = placeMap.get(key);
            // It's unlikely for singlePlace to be undefined since we are getting all the keys of the map which have been previously assigned an object that uses PlaceInterface
            let addr = singlePlace?.address;
            let name = singlePlace?.placeName;
            let city = singlePlace?.city;
            let state = singlePlace?.state;
            let postalCode = singlePlace?.postalCode;
            if (addr?.includes("'")) {
                addr = addr?.replace("'", "\\'")
            }
            if (name?.includes("'")) {
                name = name.replace("'", "\\'");
            }
            if (state?.includes("'")) {
                state = state.replace("'", "\\'");
            }
            if (city?.includes("'")) {
                city = city.replace("'", "\\'");
            }
            // Rating will be 0 by default and review will be null by default
            if (counter >= mkSize) {
                // Writing last item (does not end with comma)
                fs.writeFileSync(filename, `\t('${addr}', '${name}', '${city}', '${state}', ${postalCode}, 0, ${null});`, { flag: "a" });    
            } else {
                fs.writeFileSync(filename, `\t('${addr}', '${name}', '${city}', '${state}', ${postalCode}, 0, ${null}),\n`, { flag: "a" });
            }
        }
    } catch (err) {
        console.log("There was an error trying to write to place sql script");
        return -1;
    }
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
        console.log("There was an error trying to write to tag sql script");
        return -1;
    }
    return 0;
}

function getPostalCode(formattedAddress: string): number {
    const postalCodeRegex = /,[ ]([A-Z]{2})[ ]([0-9]{5})/;
    const postalCodeTextRegex = /[0-9]{5}/;
    let regexResult = formattedAddress.match(postalCodeRegex);
    if (regexResult === null) {
        return NaN;
    }
    let postalCode = regexResult[0].match(postalCodeTextRegex);
    if (postalCode === null) {
        return NaN;
    }
    return parseInt(postalCode[0]);
}

function getState(formattedAddress:string): string {
    const stateRegex = /, ([A-Z]{2})/;
    const stateTextRegex = /[A-Z]{2}/;
    let regexResult = formattedAddress.match(stateRegex);
    if (regexResult === null) {
        return "";
    }
    let state = regexResult[0].match(stateTextRegex);
    if (state === null) {
        return "";
    }
    return state[0];
}

function getAddress(formattedAddress: string): string {
    const addressRegex = /^([a-z]|[A-Z]|[0-9]|[ ])+/;
    let address = formattedAddress.match(addressRegex);
    if (address === null) {
        return "";
    }
    return address[0];
}

function getCity(formattedAddress: string): string {
    // const cityRegex = /, ([a-z]|[A-Z]|[ ])/;
    // const cityRegexFormat = /[A-Z]([a-z]|[A-Z]|[ ])/;
    const cityRegex = /, ([a-z]|[A-Z]|[ ])+/;
    const cityTextRegex = /[A-Z]([a-z]|[A-Z]|[ ])+/;
    let regexResult = formattedAddress.match(cityRegex);
    if (regexResult === null) {
        return "";
    }
    let cityName = regexResult[0].match(cityTextRegex);
    if (cityName === null) {
        return "";
    }
    return cityName[0];
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
            // let placeCount: number | undefined = uniquePlacesMap.get(placeKey);
            let placeMapValue: PlaceInterface | undefined = placeMap.get(placeKey);
            if (placeMapValue === undefined) { // First time place is being read
                let addr = getAddress(placeData.formatted_address);
                let cityName = getCity(placeData.formatted_address);
                let stateName = getState(placeData.formatted_address);
                let postalCodeRes = getPostalCode(placeData.formatted_address);
                placeMap.set(placeKey, {
                    placeID: null,
                    placeName: placeKey,
                    address: (addr === "" ? null : addr),
                    city: (cityName === "" ? null : cityName),
                    state: (stateName === "" ? null : stateName),
                    postalCode: (postalCodeRes === NaN ? null : postalCodeRes)
                });
                let first_assocTagsArray: Array<string> = [placeTypeStr]; // Initialize the associated tags array with the current tag
                placesAssocTagMap.set(placeKey, first_assocTagsArray); // Assign associated tags as value to the place key for places-tags map
            } else {
                // This mean the same place popped up twice or more
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
    if (writeToSQLScript_Places() !== 0) {
        return 4;
    }
    // if (writeToMD() !== 0) {
    //     return 2;
    // }
    /*
    if (writeToSQLScript_Tags() !== 0) {
        return 3;
    }
    */

    return 0;
}

// Error code 1: initPlacesMapData
// 2: writeToMD
// 3: write

const exitStatus = main();
if (exitStatus !== 0) {
    console.log(`An error has occured. Exit status: ${exitStatus}`);
} else {
    console.log(`Successful run!`);
}