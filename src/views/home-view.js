import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import MenuAppBar from "../components/AppBarView";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function HomeView() {
    const navigate = useNavigate()
    const [friends, setFriends] = useState()
    const token = localStorage.getItem('token')

    useEffect(() => {
        const getAllFriends = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER}/getallfriends`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (response?.data) {
                    setFriends(response?.data)
                }
            } catch (err) {
                console.error(err)
            }
        }
        getAllFriends()
    }, [])

    return (
        <div>
            <div style={{ marginBottom: 60 }}>
                <div style={{ position: 'fixed', top: 0, width: "100%" }}>
                    <MenuAppBar />
                </div>
            </div>
            <Box sx={{ p: 3 }}>
                <Paper>
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" textAlign={"center"}>
                            เพื่อนของคุณ
                        </Typography>
                    </Box>

                    <Box sx={{ p: 2 }}>
                        {friends?.length > 0 ? (
                            friends?.map((item, index) => (
                                <Stack key={index} direction={"row"} alignItems={"center"} justifyContent={"space-around"}>
                                    <Typography variant="body1">{index + 1}.</Typography>
                                    <Typography variant="body1">{item?.friend_username}</Typography>
                                    <Button
                                        variant="text"
                                        size="large"
                                        onClick={() => navigate(`/chat/${item?.user_id}`)}
                                    >
                                        แชท
                                    </Button>
                                </Stack>
                            ))
                        ) : (
                            <Box sx={{ p: 2 }}>
                                <Typography textAlign={"center"}>
                                    คุณยังไม่มีเพื่อน
                                </Typography>
                            </Box>
                        )
                        }
                    </Box>

                </Paper>
            </Box>

            <Box sx={{ p: 3 }}>
                <TextField label="ค้นหาคนที่คุณอยากคุยด้วย" variant="filled" fullWidth />
            </Box>
        </div>
    )
}