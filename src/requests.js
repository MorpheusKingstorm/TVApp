export const getShowsByKey = key => {
    return fetch(`https://api.tvmaze.com/search/shows?q=${key}`)
        .then(response => response.json())
}

export const getShowById = id => {
    return fetch(`https://api.tvmaze.com/shows/${id}?embed=cast`)
        .then(response => response.json())
}