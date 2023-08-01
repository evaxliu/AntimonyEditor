interface Model {
    name: string;
    url: string;
    id: string;
}

interface Models {
    models: Map<String, Model>;
}

const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';

export function searchModels(search: string) {
    return fetch(`${corsProxyUrl}https://www.ebi.ac.uk/biomodels/search?query=${search}&numResults=100&format=json`, {
        method: 'GET',
    })
    .then(response => {
        console.log(response);
        return response;
    })
    .catch(error => {
        console.log(error);
        throw error;
    });
}

export function getModel() {

}