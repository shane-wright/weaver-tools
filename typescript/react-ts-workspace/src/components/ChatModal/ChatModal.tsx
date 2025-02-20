import React, { useState, useEffect } from "react";
import ChatDialog from "../ChatDialog/ChatDialog";
import { Fab, Modal, Box, Typography, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// import CloseIcon from "@mui/icons-material/Close";

import SendIcon from "@mui/icons-material/Send";
import apiClient from "../../libs/api-client";

const ChatModal: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [chatDialogApp, setChatDialogApp] = useState<ChatDialogApp | null>(null);

    const handleSendMessage = async () => {
        try {
            console.log("MESSAGE", message);

            chatDialogApp.addMessage('user', message);

            const response = await apiClient.post('/chat', { model: "gemma2:2b", messages: [{ "role": "user", "content": message }]});

            setResponse(response.data.response);
            if (chatDialogApp) {
                    chatDialogApp.addMessage('assistant', response.data.message.content);
            }
            console.log("RESPONSE",response.data.response);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpen = () => setOpen(true);

    useEffect(() => {
        const options = {
                id: "chat-dialog",
                classes: ["custom-chat-dialog"],
                style: { maxHeight: '200px' }
        };

        const chatDialogElement = ChatDialog(options);

        setChatDialogApp((chatDialogElement as any).app);

    }, []);

    const handleClose = () => setOpen(false);

    return (
        <>
            {/* Floating Button */}
            <Fab
                color="primary"
                aria-label="add"
                onClick={handleOpen}
                sx={{
                    position: "fixed",
                    bottom: 16,
                    right: 16,
                }}
                data-testid="chat-modal-fab" // Add this line

            >
                <AddIcon />
            </Fab>

            {/* Modal */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="chat-modal-title"
                aria-describedby="chat-modal-description"
            >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 500,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h6" component="h2">
                        Palantir
                    </Typography>
                    <Box
                        sx={{
                            mb: 2,
                        }}
                    >
                </Box>
                <div id="chat-dialog" />
                    <Box
                        component="form"
                        // onSubmit={handleSendMessage}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            mb: 2,
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TextField
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message here"
                                variant="outlined"
                                fullWidth
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSendMessage}
                                startIcon={<SendIcon />}
                            >
                                Send
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
            </Modal>
        </>
    );
};

export default ChatModal;
