// Utility import
import { getAddress, getCity, getState, getPostalCode, cleanString } from "./utils/extract-address-data";

// Library imports
import fs from "fs"; // Node file system

// Place imports
// NC is short for North County (North County, San Diego)
import AmusementPark_NC from "./MorePlacesData/amusement-parks-north-county-san-diego-ca.json";
import AmusementPark_SD from "./MorePlacesData/amusement-parks-san-diego-ca.json";
import Aquarium_SD from "./MorePlacesData/aquarium-san-diego-ca.json";
import Arcade_NC from "./MorePlacesData/arcades-north-county-san-diego-ca.json";
import ArtGallery_SD from "./MorePlacesData/art-gallery-san-diego-ca.json";
import ArtMuseum_SD from "./MorePlacesData/art-museums-san-diego-ca.json";
import Bakery_NC from "./MorePlacesData/bakeries-north-county-san-diego-ca.json";
import Bakery_SD from "./MorePlacesData/bakeries-san-diego-ca.json";
import Bar_NC from "./MorePlacesData/bars-north-county-san-diego-ca.json";
import Bar_SD from "./MorePlacesData/bars-san-diego-ca.json";
import Beach_NC from "./MorePlacesData/beaches-north-county-san-diego-ca.json";
import Beach_SD from "./MorePlacesData/beaches-san-diego-ca.json";
import Bowling_NC from "./MorePlacesData/bowling-north-county-san-diego-ca.json";
import Brewery_NC from "./MorePlacesData/breweries-north-county-san-diego-ca.json";
import Brunch_NC from "./MorePlacesData/brunch-north-county-san-diego-ca.json";
import Brunch_SD from "./MorePlacesData/brunch-san-diego-ca.json";
import Cafe_NC from "./MorePlacesData/cafes-north-county-san-diego-ca.json";
import Cafe_SD from "./MorePlacesData/cafes-san-diego-ca.json";
import Casino_SD from "./MorePlacesData/casino-san-diego-ca.json";
import DateNight_SD from "./MorePlacesData/date-night-san-diego-ca.json";
import EscapeRoom_NC from "./MorePlacesData/escape-rooms-north-county-san-diego-ca.json";
import FarmersMarket_NC from "./MorePlacesData/farmers-markets-north-county-san-diego-ca.json";
import FineDining_NC from "./MorePlacesData/fine-dining-north-county-san-diego-ca.json";
import FineDining_SD from "./MorePlacesData/fine-dining-san-diego-ca.json";
import Library_NC from "./MorePlacesData/libraries-north-county-san-diego-ca.json";
import MovieTheater_NC from "./MorePlacesData/movie-theatres-north-county-san-diego-ca.json";
import Museum_NC from "./MorePlacesData/museums-north-county-san-diego-ca.json";
import Museum_SD from "./MorePlacesData/museums-san-diego-ca.json";
import NightClub_NC from "./MorePlacesData/night-clubs-north-county-san-diego-ca.json";
import NightClub_SD from "./MorePlacesData/night-clubs-san-diego-ca.json";
import Park_NC from "./MorePlacesData/parks-north-county-san-diego-ca.json";
import Park_SD from "./MorePlacesData/parks-san-diego-ca.json";
import ShoppingMall_NC from "./MorePlacesData/shopping-malls-north-county-san-diego-ca.json";
import ShoppingMall_SD from "./MorePlacesData/shopping-malls-san-diego-ca.json";
import SkatePark_NC from "./MorePlacesData/skate-parks-north-county-san-diego-ca.json";
import TeaShop_NC from "./MorePlacesData/tea-shops-north-county-san-diego-ca.json";
import ThriftShop_NC from "./MorePlacesData/thrift-stores-north-county-san-diego-ca.json";
import ThriftShop_SD from "./MorePlacesData/thrift-stores-san-diego-ca.json";
import VeganFood_NC from "./MorePlacesData/vegan-food-north-county-san-diego-ca.json";
import Winery_SD from "./MorePlacesData/wineries-san-diego-ca.json";

const AllPlaces = [
    AmusementPark_NC,
    AmusementPark_SD,
    Aquarium_SD,
    Arcade_NC,
    ArtGallery_SD,
    ArtMuseum_SD,
    Bakery_NC,
    Bakery_SD,
    Bar_NC,
    Bar_SD,
    Beach_NC,
    Beach_SD,
    Bowling_NC,
    Brewery_NC,
    Brunch_NC,
    Brunch_SD,
    Cafe_NC,
    Cafe_SD,
    Casino_SD,
    DateNight_SD,
    EscapeRoom_NC,
    FarmersMarket_NC,
    FineDining_NC,
    FineDining_SD,
    Library_NC,
    MovieTheater_NC,
    Museum_NC,
    Museum_SD,
    NightClub_NC,
    NightClub_SD,
    Park_NC,
    Park_SD,
    ShoppingMall_NC,
    ShoppingMall_SD,
    SkatePark_NC,
    TeaShop_NC,
    ThriftShop_NC,
    ThriftShop_SD,
    VeganFood_NC,
    Winery_SD
];


// formatting of the fields / column names of tags in the MySQL Database
// **** THIS HAS TO BE IN THE SAME ORDER AS allPlaces ARRAY
const PlaceTags = [
    "amusement-park",
    "amusement-park",
    "aquarium",
    "arcade",
    "art-gallery",
    "art-museum",
    "bakery",
    "bakery",
    "bar",
    "bar",
    "beach",
    "beach",
    "bowling",
    "brewery",
    "brunch",
    "brunch",
    "cafe",
    "cafe",
    "casino",
    "date-night",
    "escape-room",
    "farmers-market",
    "fine-dining",
    "fine-dining",
    "library",
    "movie-theater",
    "museum",
    "museum",
    "night-club",
    "night-club",
    "park",
    "park",
    "shopping-mall",
    "shopping-mall",
    "skate-park",
    "tea-shop",
    "thrift-shop",
    "thrift-shop",
    "vegan-food",
    "winery"
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
const PlaceMap: Map<string, PlaceInterface> = new Map<string, PlaceInterface>(); // Purpose is for each place to be unique
// Map data structure for the junction table (N to M relationship of Place to Tag)
const PlacesAssocTagMap: Map<string, Array<string>> = new Map<string, Array<string>>(); // Map for the junction table

function addBackSlashes(textData: string | null | undefined): string {
    if (textData === undefined || textData === null) {
        return "";
    }
    if (textData.includes("'")) {
        textData = textData.replaceAll("'", "\\\'");
    }
    return textData;
}

function writeToSQLScript_Places(): number {
    const filename: string = "./insert-places.sql";
    try {
        fs.writeFileSync(filename, "INSERT INTO place (address, name, city, state, postalCode, rating, description) \nVALUES\n");
        const mapKeys = PlaceMap.keys();
        let mkSize = PlaceMap.size;
        let counter: number = 0;
        for (const key of mapKeys) {
            counter++;
            const singlePlace: PlaceInterface | undefined = PlaceMap.get(key);
            // It's unlikely for singlePlace to be undefined since we are getting all the keys of the map which have been previously assigned an object that uses PlaceInterface
            let addr = singlePlace?.address;
            let name = singlePlace?.placeName;
            let city = singlePlace?.city;
            let state = singlePlace?.state;
            let postalCode = singlePlace?.postalCode;
            if (addr !== null) {
                addr = addBackSlashes(addr);
            }
            name = addBackSlashes(name);
            if (city !== null) {
                city = addBackSlashes(city);
            }
            if (state !== null) {
                state = addBackSlashes(state);
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

// Script to write into the Junction Table
function writeToSQLScript_PlaceDetails(): number {
    const filename: string = "./insert-place-details.sql";
    try {
        fs.writeFileSync(filename, ""); // Replace and existing data
        let mapKeys = PlacesAssocTagMap.keys();
        let mkSize = PlacesAssocTagMap.size;
        let counter: number = 0;
        for (const key of mapKeys) {
            counter++;
            let tags: string[] | undefined = PlacesAssocTagMap.get(key);
            if (tags === undefined) {
                continue; // Skip the iteration
            }
            for (let i = 0; i < tags.length; i++) {
                fs.writeFileSync(filename, "INSERT INTO place_details (place_id, tag_id)\n", { flag: "a" });
                fs.writeFileSync(filename, `SELECT p.place_id, t.tag_id FROM place AS p, tag AS t WHERE p.name = '${addBackSlashes(key)}' AND t.label = '${tags[i]}';\n`, { flag: "a" });
                /*
                if (i == tags.length - 1) {
                    fs.writeFileSync(filename, `;\n\n`, { flag: "a" });
                } else {
                    fs.writeFileSync(filename, `,\n`, { flag: "a" });
                }
                */
            }
        }
    } catch (err) {
        console.log("There was an error writing to Place Details SQL Script");
        return -1;
    }
    return 0;
}

// For the 
function writeToSQLScript_Tags(): number {
    const filename: string = "insert-tags.sql";
    const usedTags: Map<string, number | undefined> = new Map();
    try {
        fs.writeFileSync(filename, "INSERT INTO tag (label) VALUES"); // Do not set to append mode to reset any existing data in the script
        for (let i = 0; i < PlaceTags.length; i++) {
            if (usedTags.get(PlaceTags[i]) !== undefined) {
                let currentCount: number = usedTags.get(PlaceTags[i])!; // Use non null asseertion, value cannot be undefined, it's already been evaluated
                usedTags.set(PlaceTags[i], currentCount++);
                continue;
            }
            fs.writeFileSync(filename, `('${PlaceTags[i]}')`, { flag: "a" });
            usedTags.set(PlaceTags[i], 1);
            if (i == PlaceTags.length - 1) {
                fs.writeFileSync(filename, ";", { flag: "a" });
            } else {
                fs.writeFileSync(filename, ",\n\t", { flag: "a" });
            }
        }
    } catch (err) {
        console.log("There was an error trying to write to tag sql script");
        return -1;
    }
    return 0;
}

// Group the places to avoid duplicate rows

function initPlacesMapData(): number {
    // Use a map structure
    AllPlaces.forEach((placeType: any, index: number) => {
        let placeTypeStr: string = PlaceTags[index];
        placeType.results.forEach((placeData: any) => {
            let placeKey: string | undefined = placeData.name;
            if (placeData.business_status !== "OPERATIONAL") { // If the place is closed, do not add to the database
                return;
            }
            if (placeKey === undefined) {
                return; // Skip the place if name does not exist
            }
            placeKey = cleanString(placeKey);
            // let placeCount: number | undefined = uniquePlacesMap.get(placeKey);
            let placeMapValue: PlaceInterface | undefined = PlaceMap.get(placeKey);
            if (placeMapValue === undefined) { // First time place is being read
                let addr = getAddress(placeData.formatted_address);
                let cityName = getCity(placeData.formatted_address);
                let stateName = getState(placeData.formatted_address);
                let postalCodeRes = getPostalCode(placeData.formatted_address);
                PlaceMap.set(placeKey, {
                    placeID: null,
                    placeName: placeKey,
                    address: (addr === "" ? null : addr),
                    city: (cityName === "" ? null : cityName),
                    state: (stateName === "" ? "CA" : stateName), // We can set state to CA since we are just focusing locally, however, this is very much a bandage fix..
                    postalCode: (isNaN(postalCodeRes) ? null : postalCodeRes)
                });
                let first_assocTagsArray: Array<string> = [placeTypeStr]; // Initialize the associated tags array with the current tag
                PlacesAssocTagMap.set(placeKey, first_assocTagsArray); // Assign associated tags as value to the place key for places-tags map
            } else {
                // This mean the same place popped up twice or more
                // We need to assign it's multiple associated tags (if it showed up in another file)
                let assocTagsArray: Array<string> | undefined = PlacesAssocTagMap.get(placeKey);
                if (assocTagsArray === undefined) { // First tag instance
                    PlacesAssocTagMap.set(placeKey, [placeTypeStr]);
                    return;
                }
                if (assocTagsArray.includes(placeTypeStr)) {
                    return; // do not include the same tag twice
                }
                assocTagsArray.push(placeTypeStr);
                PlacesAssocTagMap.set(placeKey, assocTagsArray);
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

    // Remove comments for sql command generation

    if (writeToSQLScript_Tags() !== 0) {
        return 1;
    }

    if (writeToSQLScript_Places() !== 0) {
        return 1;
    }

    if (writeToSQLScript_PlaceDetails() !== 0) {
        return 1;
    }
    return 0;
}

const exitStatus = main();
if (exitStatus !== 0) {
    console.log(`An error has occured. Exit status: ${exitStatus}`);
} else {
    console.log(`Successful run!`);
}