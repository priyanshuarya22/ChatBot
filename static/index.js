export const index = {
    template: `
        <div>
            <div class="float-end mb-5"><router-link to="/login" onclick="logout">Logout</router-link></div>
            <h1 class="text-center mb-5">Chat App</h1>
            
            <div class="row overflow-hidden shadow" style="border-radius: 0.5rem;">
                <div class="px-4 py-5 bg-white w-100" style="height: 510px; overflow-y: scroll;" id="messages"></div>
                
                <form @submit.prevent="sendMessage" class="bg-light">
                    <div class="input-group">
                        <input type="text" class="form-control rounded-0 border-0 py-4 bg-light focus-ring focus-ring-light" placeholder="Type a message..." id="messageText">
                        <button class="btn btn-white" type="button"> Send <i class="bi bi-send"></i> </button>
                    </div>
                </form>
            </div>
        </div>
    `,
    data() {
        return {
            ws: null
        }
    },
    methods: {
        botMessage(data) {
            var messages = document.getElementById('messages');
            var messageOuterDiv = document.createElement('div');
            messageOuterDiv.classList.add("media", "w-50", "mb-3", "d-flex", "flex-row", "w-100");
            var messageMidDiv = document.createElement('div');
            messageMidDiv.classList.add("media-body", "ms-3");
            var messageInnerDiv = document.createElement('div');
            messageInnerDiv.classList.add("bg-light", "rounded", "py-2", "px-3", "mb-2");
            var message = document.createElement('p');
            message.classList.add("text-small", "mb-0", "text-muted");
            var datetime = document.createElement('p');
            datetime.classList.add("small", "text-muted", "d-flex", "flex-row");
            var contentMessage = document.createTextNode(data.message);
            var contentDatetime = document.createTextNode(data.time);
            message.appendChild(contentMessage);
            datetime.appendChild(contentDatetime);
            messageInnerDiv.appendChild(message);
            messageMidDiv.appendChild(messageInnerDiv);
            messageMidDiv.appendChild(datetime);
            messageOuterDiv.appendChild(messageMidDiv);
            messages.appendChild(messageOuterDiv);
            messages.scrollTop = messages.scrollHeight;
        },
        userMessage(data) {
            var messages = document.getElementById('messages');
            var messageOuterDiv = document.createElement('div');
            messageOuterDiv.classList.add("media", "w-50", "mb-3", "d-flex", "flex-row-reverse", "w-100");
            var messageMidDiv = document.createElement('div');
            messageMidDiv.classList.add("media-body", "ms-3");
            var messageInnerDiv = document.createElement('div');
            messageInnerDiv.classList.add("bg-primary", "rounded", "py-2", "px-3", "mb-2");
            var message = document.createElement('p');
            message.classList.add("text-small", "mb-0", "text-white");
            var datetime = document.createElement('p');
            datetime.classList.add("small", "text-muted", "d-flex", "flex-row-reverse");
            var contentMessage = document.createTextNode(data.message);
            var contentDatetime = document.createTextNode(data.time);
            message.appendChild(contentMessage);
            datetime.appendChild(contentDatetime);
            messageInnerDiv.appendChild(message);
            messageMidDiv.appendChild(messageInnerDiv);
            messageMidDiv.appendChild(datetime);
            messageOuterDiv.appendChild(messageMidDiv);
            messages.appendChild(messageOuterDiv);
            messages.scrollTop = messages.scrollHeight;
        },
        getDateTime() {
            var date = new Date();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            return strTime + " | " + monthNames[date.getMonth()] + " " + date.getDate();
        },
        sendMessage() {
            var input = document.getElementById("messageText");
            this.ws.send(JSON.stringify({message: input.value, access_token: localStorage.getItem('access_token')}));
            let data = {message: input.value, time: this.getDateTime()};
            this.userMessage(data);
            input.value = '';
        },
        logout() {
            localStorage.removeItem('access_token');
        }
    },
    created() {
        this.ws = new WebSocket("ws://localhost:8000/chat");
        this.ws.onopen = (event) => {
            fetch('http://localhost:8000/chats', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            }).then(response => {
                if (response.status === 401) {
                    localStorage.removeItem('access_token');
                    this.$router.push('/login');
                } else {
                    return response.json();
                }
            })
                .then(data => {
                    data.forEach(chat => {
                        if (chat.sender === 'assistant') {
                            this.botMessage({message: chat.message, time: chat.timestamp});
                        } else {
                            this.userMessage({message: chat.message, time: chat.timestamp});
                        }
                    });
                });
        };
        this.ws.onmessage = (event) => {
            var data = JSON.parse(event.data);
            this.botMessage(data);
        }
    }
}