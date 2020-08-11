
import axios from "axios";

export default class Api {

    constructor() {
        this.config = {
            baseURL: 'api/v1', //this.getRESTApiUri(),
            timeout: 5000,
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'plain/text'
            }
        };
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
        let token = localStorage.getItem(this.tokenName);
        this.config.headers = {"Authorization" : "Bearer "  + token };
    }

    setToken(token) {
        localStorage.setItem(this.tokenName, token);
        this.loadToken();
    }

    destroyToken() {
        localStorage.setItem(this.tokenName, '');
        this.loadToken();
    }

    /**************************************************************** 
     * API AUTHENTIFICATION 
     ****************************************************************/
    signup(user) {
        return axios.post('/auth/signup', user, this.config).then(this.handleResponse);
    }

    signin(user) {
        return axios.post('/auth/signin', user, this.config).then(this.handleResponse);
    }

    setNewPassword(info) {
        return axios.post('/auth/newpassword', info, this.config).then(this.handleResponse);
    }

    requestResetPassword(info) {
        return axios.post('/auth/resetpassword', info, this.config).then(this.handleResponse);
    }

    /**************************************************************** 
     * API DU PROFIL UTILISATEUR
     ****************************************************************/

    setMyProfile(user) {
        return axios.post('/dashboard/user/profile', user, this.config).then(this.handleResponse);
    }

    getMyProfile() {
        return axios.get('/dashboard/user/profile', this.config).then(this.handleResponse);
    }

    /**************************************************************** 
     * GESTION DES UTILISATEURS PAR LES ADMINS 
     ****************************************************************/
    setUserProfile(user) {
        return axios.post('/dashboard/users/profile', user, this.config).then(this.handleResponse);
    }

    getUsers() {
        return axios.get('/dashboard/users/users', this.config).then(this.handleResponse);
    }

    deleteUser(user) {
        return axios.post('/dashboard/users/delete', user, this.config).then(this.handleResponse);
    }

     /**************************************************************** 
     * GESTION DES SERVEURS DE JEU
     ****************************************************************/
     getAllServers() {
        return axios.get('/server/list', this.config).then(this.handleResponse);
     }

    /**************************************************************** 
     * FONCTION UTILITAIRE 
     ****************************************************************/
    handleResponse(response) {
        if (response.status === 200) {
            return Promise.resolve(response.data)
        } else {
            return Promise.reject(response.statusText);
        }
    }
}
