<template>

    <!-- SIGN UP -->

    <v-card width="400px" class="mx-auto" style="text-align:center; margin-top:100px; margin-bottom:50px">
        <v-col cols="12">

            <v-card class="mx-auto" width="360px" elevation="0">

                <h1 style="padding-bottom:10px">Créer un compte</h1>

                <!-- SIGN UP FORM -->

                <v-card elevation="0" class="mx-auto" width="300px">
                    <form ref="signupForm" style="padding-bottom:30px;" @submit="checkForm">
      
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
                            type="password" 
                            label="Password"
                            v-model="password"
                            style="padding-bottom:20px;"
                            required
                        ></v-text-field>

                        <v-text-field
                            name="email"
                            type="email" 
                            label="email"
                            v-model="email"
                            autocomplete="off"
                            style="display:none !important; visibility:hidden !important;"
                        ></v-text-field>

                        <v-btn type="submit" class="mr-4">Valider</v-btn>
                        <v-btn @click="reset">Effacer</v-btn>
                    </form>
                    
                    <router-link to="/"><p style="display:inline;">Revenir à l'identification.</p></router-link>
                    
                </v-card>
            </v-card>
        </v-col>
    </v-card>
</template>

<script>

export default {
    
    data: () => ({
        password: '',
        username: '',
        email: ''
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
            this.$eventHub.$emit('setAlert', 'Vous êtes déjà connecté!', 'error', 3000);
            this.$router.push({ name: 'Home' });
        },

        reset() {
            this.password = '';
            this.username = '';
            this.$refs.signupForm.reset();
        },
        checkForm (e) {
            this.$api.signup( {password: this.password, username: this.username, email: this.email }).then( result => {
                if (result.success) {
                    this.$eventHub.$emit('setAlert', 'Compte créé, en attente de validation', 'success', 3000);
                } else {
                    this.$eventHub.$emit('setAlert', 'Erreur lors de la création du compte', 'error', 3000);
                }

                this.reset();

            }).catch(error => {
                console.error(error);
            });

            e.preventDefault();
        }
    }
}
</script>