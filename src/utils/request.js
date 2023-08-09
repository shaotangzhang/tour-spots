export function createFetch(context) {
    return function(input, init) {
        return fetch(...arguments);
    }
}

const request = createFetch();
export default request;