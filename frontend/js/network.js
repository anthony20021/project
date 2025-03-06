const API_BASE_URL = 'http://localhost:8000/api';

async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}/${endpoint}`;
    
    const defaultHeaders = {
        'Content-Type': 'application/json'
    };
    
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(url, config);
        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Retourner à la fois le statut et les données
        return {
            status: response.status,
            data: responseData
        };
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}


export function get(endpoint, headers = {}) {
    return request(endpoint, { method: 'GET', headers });
}

export function post(endpoint, body, headers = {}) {
    return request(endpoint, { method: 'POST', body: JSON.stringify(body), headers });
}

export function put(endpoint, body, headers = {}) {
    return request(endpoint, { method: 'PUT', body: JSON.stringify(body), headers });
}

export function del(endpoint, headers = {}) {
    return request(endpoint, { method: 'DELETE', headers });
}

export default {
    get,
    post,
    put,
    del
};
