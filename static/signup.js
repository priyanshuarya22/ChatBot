export const signup = {
    template: `
        <div class="row">
            <h1 class="text-center">Chat App</h1>
            <div class="col-lg-4"></div>
            <div class="col-lg-4">
                <div class="card mt-5">
                    <div class="card-body">
                        <h3 class="text-center mb-3">Signup</h3>
                        <form @submit.prevent="signup">
                            <div class="mb-3">
                                <label class="form-label">Username</label>
                                <input class="form-control" type="text" v-model="username" placeholder="username" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Password</label>
                                <input class="form-control" type="password" v-model="password" placeholder="********" id="password" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Confirm Password</label>
                                <input class="form-control" type="password" v-model="confirmPassword" placeholder="********" @change="checkPassword" id="confirmPassword" required>
                            </div>
                            <div class="mb-3 form-text text-danger" v-if="error">
                                {{ error }}
                            </div>
                            <div class="mb-3">
                                Already have an account? <router-link to="/login" style="text-decoration: none;">Login</router-link>!
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary mb-3" id="button">Signup</button>
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
            confirmPassword: null,
            error: null
        };
    },
    methods: {
        signup() {
            fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.username,
                    password: this.password
                })
            }).then(response => {
                if (response.status === 400) {
                    this.error = "Username already exists!";
                } else if (response.status === 200) {
                    this.$router.push('/login');
                } else {
                    console.error(response);
                }
            })
                .catch((error) => {
                    console.error('Error:', error);
                });
        },
        checkPassword() {
            let password = document.getElementById('password').value;
            let confirmPassword = document.getElementById('confirmPassword').value;
            if (confirmPassword !== password) {
                document.getElementById('button').disabled = true;
                this.error = 'Password in both the fields should be same!';
            } else {
                document.getElementById('button').disabled = false;
                this.error = null;
            }
        }
    }
}