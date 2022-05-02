export function getPostalCode(formattedAddress: string): number {
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

export function getState(formattedAddress: string): string {
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

export function getAddress(formattedAddress: string): string {
    const addressRegex = /^([a-z]|[A-Z]|[0-9]|[ ]|[\-]|[\&]|[\#]|[\'])+/;
    let address = formattedAddress.match(addressRegex);
    if (address === null) {
        return "";
    }
    return address[0];
}

export function getCity(formattedAddress: string): string {
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