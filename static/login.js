export const login = {
    template: `
        <div class="row">
            <h1 class="text-center">Chat App</h1>
            <div class="col-lg-4"></div>
            <div class="col-lg-4">
                <div class="card mt-5">
                    <div class="card-body">
                        <h3 class="text-center mb-3">Login</h3>
                        <form @submit.prevent="login">
                            <div class="mb-3">
                                <label class="form-label">Username</label>
                                <input class="form-control" type="text" v-model="username" placeholder="username" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Password</label>
                                <input class="form-control" type="password" v-model="password" placeholder="********" required>
                            </div>
                            <div class="mb-3 form-text text-danger">
                                {{ error }}
                            </div>
                            <div class="mb-3">
                                New here? <router-link to="/signup" style="text-decoration: none;">Signup</router-link>!
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary mb-3">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            username: null,
            password: null,
            error: null
        };
    },
    methods: {
        login() {
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `username=${encodeURIComponent(this.username)}&password=${encodeURIComponent(this.password)}`
            }).then(response => {
                if (response.status === 401) {
                    this.error = "Incorrect Username or Password";
                } else {
                    return response.json()
                }
            })
                .then(data => {
                    localStorage.setItem('access_token', data.access_token);
                    this.$router.push('/');
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        }
    }
}