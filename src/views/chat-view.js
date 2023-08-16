import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Stack, Typography, Paper, TextField, Button } from '@mui/material';
import MenuAppBar from '../components/AppBarView';

export default function ChatView() {
    const { id } = useParams();
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const chatContainerRef = useRef(null);
    const token = localStorage.getItem('token');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (!token) {
            alert('คุณต้องเข้าสู่ระบบก่อน')
            navigate('/log-in')
        }
    }, [])

    useEffect(() => {
        const getUserById = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response) {
                    setUser(response?.data[0]);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getUserById()
    }, [])

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER}/getMessageIsent?receiver_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response) {
                setMessages(response?.data.sort((a, b) => a.send_time.localeCompare(b.send_time)));
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [id]);

    const getMaxMessageId = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER}/getMaxMessageId`);
            if (response) {
                const maxId = response?.data[0].maxId;

                if (maxId) {
                    const currentId = parseInt(maxId.slice(1));
                    const nextId = currentId + 1;
                    return `M${nextId.toString().padStart(4, '0')}`;
                } else {
                    return 'M0001';
                }
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const handleSendMessage = async () => {
        try {
            const generatedID = await getMaxMessageId()
            const response = await axios.post(`${process.env.REACT_APP_SERVER}/sendmessage`, {
                message_id: generatedID,
                message_text: newMessage,
                receiver_id: id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response?.status === 200) {
                setNewMessage('');
                fetchMessages();
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        // Scroll to the bottom whenever new messages arrive or when the component initially loads
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div>
            <div style={{ marginBottom: 60 }}>
                <div style={{ position: 'fixed', top: 0, width: "100%" }}>
                    <MenuAppBar />
                </div>
            </div>
            <div
                ref={chatContainerRef}
                style={{ maxHeight: '85vh', overflowY: 'auto' }} // Limit the chat container's height
            >
                <Stack direction="column" spacing={2} alignItems="flex-start" p={2}>
                    {messages
                        .filter(person => person.sender_id === id || person.sender_id === user?.user_id)
                        .sort((a, b) => a.send_time.localeCompare(b.send_time))
                        .map((message) => (
                            <Paper
                                key={message?.message_id}
                                elevation={3}
                                sx={{
                                    maxWidth: '60%',
                                    alignSelf: message.sender_id === user?.user_id ? 'flex-end' : 'flex-start',
                                    backgroundColor: message.sender_id === user?.user_id ? '#E4E6EB' : '#007AFF',
                                    color: message.sender_id === user?.user_id ? 'black' : '#FFF',
                                    padding: '10px',
                                }}
                            >
                                <Typography variant="body2">{message?.sender}</Typography>
                                <Typography variant="body1">{message?.message_text}</Typography>
                                <Typography variant="body2">{message?.send_time}</Typography>
                            </Paper>
                        ))}
                </Stack>
            </div>
            <div style={{ marginTop: 80 }}>
                <div style={{ position: 'fixed', bottom: 0, width: "100%" }}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Stack justifyContent={"center"} direction={"row"}>
                            <TextField
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{ marginRight: 2 }}
                            />
                            <Button onClick={handleSendMessage} variant="contained" color="primary">
                                Send
                            </Button>
                        </Stack>
                    </Paper>
                </div>
            </div>
        </div>
    );
};
