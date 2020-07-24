<template>

    <!-- SIGN IN -->

    <v-card width="400px" class="mx-auto" style="text-align:center; margin-top:100px; margin-bottom:50px">
        <v-col cols="12">
            <v-card class="mx-auto" width="360px" elevation="0">
                <h1 style="padding-bottom:10px">Identification</h1>
                <!-- SIGN IN FORM -->
                
                <v-card elevation="0" class="mx-auto" width="300px" style="padding-bottom:10px;">
                    <form ref="loginForm" style="padding-bottom:50px;" @submit="checkForm">
                        <v-text-field
                            name="username"
                            value=""
                            type="text" 
                            label="User name"
                            v-model="username"
                            required
                        ></v-text-field>

                        <v-text-field
                            name="password"
                            style="padding-bottom:20px"
                            type="password"
                            label="Password"
                            v-model="password"
                            required
                        ></v-text-field>

                        <v-btn class="mr-4" type="submit">Valider</v-btn>
                        <v-btn @click="reset">Effacer</v-btn>
                    </form>

                    <p style="display:inline;">Mot de passe oublié ? </p><router-link to="/resetpass"><p style="display:inline;">Réinitialisation.</p></router-link>
                    <br />
                    <p style="display:inline;">Pas de compte ? </p><router-link :to="{ name: 'signup'}"><p style="display:inline;">Créer un compte.</p></router-link>
                </v-card>
            </v-card>
        </v-col>
    </v-card>
</template>

<script>

export default {
    data: () => ({
        username: '',
        password: ''
    }),
    created() {
        if (this.$store.state.user.loggedIn) {
          this.returnToHome();
        }
    },
    beforeRouteUpdate (to, from, next) {

        if (this.$store.state.user.loggedIn) {
          this.returnToHome();
        } else {
            next();
        }
    },

    methods: {
        returnToHome() {
            this.$router.push({ name: 'Home' });
        },
        reset () {
            this.password = '';
            this.username = '';
            this.$refs.loginForm.reset();
        },
        checkForm (e) {
            this.$api.signIn( {username: this.username, password: this.password }).then( result => {
                if (result.success) {
                    this.$api.setToken(result.data.token);
                    this.$store.commit('user/LOGIN_SUCCESS', result.data.profile);
                    this.$router.push({ name: 'Home' });
     
                } else {

                    if (result.reason === 'deleted') {
                        this.$eventHub.$emit('setAlert', "Compte supprimé", 'error', 3000);
                    } else {
                        this.$eventHub.$emit('setAlert', "Erreur de login ou de mot de passe", 'error', 3000);
                    }
                }

            }).catch(error => {
                console.error(error);
            });

            e.preventDefault();
        }
    }
}
</script>