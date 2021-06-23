import Vue from 'vue';

export default class Api {

    constructor() {
        this.baseURL = this.getRESTApiUri();
        this.headers = {
            'Accept' : 'application/json',
            'Content-Type': 'application/json'
        },
        this.tokenName = 'tarotclub-token';
    }

    /**************************************************************** 
     * API VARIOUS PATH GETTERS
     ****************************************************************/
    // API REST 
    getRESTApiUri()
    {
        let uri = this.getRootUrl() + "/api/v1";
        //console.log("REST API: " + uri);
        return uri;
    }

    getRootUrl()
    {
        let uri = window.location.protocol + "//" + window.location.hostname;
        return uri;
    }

    // API WEBSOCKET
    getWebSocketHost()
    {
        // let wsHost = (((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.hostname + '/clients');
        let wsHost = "wss://" + window.location.hostname + '/clients';
        
        //console.log("Web socket host: " + wsHost);
        return wsHost;
    }

    /**************************************************************** 
     * LOCAL STORAGE 
     ****************************************************************/
    loadToken() {
        let token = Vue.$cookies.get(this.tokenName);//localStorage.getItem(this.tokenName);
        this.headers["Authorization"] = "Bearer "  + token;
    }

    setToken(token) {
        // localStorage.setItem(this.tokenName, token);
        Vue.$cookies.set(this.tokenName, token);
        this.loadToken();
    }

    destroyToken() {
        Vue.$cookies.set(this.tokenName, '');
        this.loadToken();
    }

    /**************************************************************** 
     * API AUTHENTIFICATION 
     ****************************************************************/
    async signup(user) {
        return this.client('POST','/auth/signup', user);
    }

    async signin(user) {
        return this.client('POST','/auth/signin', user);
    }

    async setNewPassword(info) {
        return this.client('POST','/auth/newpassword', info);
    }

    async requestResetPassword(info) {
        return this.client('POST','/auth/resetpassword', info);
    }

    /**************************************************************** 
     * API DU PROFIL UTILISATEUR
     ****************************************************************/

     async setMyProfile(user) {
        return this.client('POST','/dashboard/user/profile', user);
    }

    async getMyProfile() {
        return this.client('GET','/dashboard/user/profile');
    }

    /**************************************************************** 
     * GESTION DES UTILISATEURS PAR LES ADMINS 
     ****************************************************************/
     async setUserProfile(user) {
        return this.client('POST','/dashboard/users/profile', user);
    }

    async getUsers() {
        return this.client('GET','/dashboard/users/users');
    }

    async deleteUser(user) {
        return this.client('POST','/dashboard/users/delete', user);
    }

    /**************************************************************** 
     * GESTION DES SERVEURS DE JEU
     ****************************************************************/
    async getAllServers() {
        return this.client('GET','/servers/list');
    }

    /**************************************************************** 
     * CLIENT WRAPPER FOR REST API CALLS
     ****************************************************************/
    client(method, endpoint, body) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const options = {
            method: method,
            signal: controller.signal,
            headers: this.headers
        }

        if (body) {
            options.body = JSON.stringify(body)
        }

        let uri =  this.baseURL + endpoint;
        
        const promise = fetch(uri, options)
        .then(async response => {
            if (response.status === 401) {
                window.location.assign(window.location);
                return;
            }
            const data = await response.json();
            if (response.ok) {
                return data;
            } else {
                return Promise.reject(new Error('Invalid response'))
            }
        });
        return promise.finally(() => clearTimeout(timeout));
    }

}
