import { prefix, baseUrl } from "./routes";

const getUrl = (options) => {
    return baseUrl + prefix + options.route
}

export const get = async (opitons) => {
    const url = getUrl(opitons);
    const request = await fetch(url);
    return request
}