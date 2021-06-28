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
     * DIALOGUE AVEC DES SERVEURS DE JEU 
     ****************************************************************/
    async getAllServers() {
        return this.client('GET','/servers/list');
    }

    async joinServer(server) {
       return this.client('POST','/servers/join', {server: server});
    }

    /**************************************************************** 
     * CLIENT WRAPPER FOR REST API CALLS
     ****************************************************************/
     async fetchWithTimeout(resource, options) {
        
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), options.timeout);
      
        const response = await fetch(resource, {
          ...options,
          signal: controller.signal  
        });
        clearTimeout(id);
      
        return response;
      }


    async client(method, endpoint, body) {
        const options = {
            method: method,
            headers: this.headers,
            timeout: 8000
        }

        if (body) {
            options.body = JSON.stringify(body)
        }

        let uri =  this.baseURL + endpoint;

        try {
            const response = await this.fetchWithTimeout(uri, options);
            if (response.ok) {
                console.log(await response.clone().text());
                const resJeson = await response.json();
                return resJeson;
            } else {
                return Promise.reject(new Error('Invalid response'))
            }
        } catch (error) {
            // Timeouts if the request takes
            // longer than 6 seconds
            console.log(error);
            return Promise.reject(new Error('Invalid response'))

        }

    }

}
