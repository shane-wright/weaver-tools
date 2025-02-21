import React, { useState, useEffect } from "react";
import ChatDialog from "../ChatDialog/ChatDialog";
import { Fab, Modal, Box, Typography, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { marked } from 'marked';
import SendIcon from "@mui/icons-material/Send";
import apiClient from "../../libs/api-client";

// Define or import the ChatDialogApp type
interface ChatDialogApp {
    addMessage: (role: string, message: string) => void;
}

const ChatModal: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
    const [message, setMessage] = useState('');
    const [chatDialogApp, setChatDialogApp] = useState<ChatDialogApp | null>(null);
    const [parsedResponse, setParsedResponse] = useState<string>('');

    const handleSendMessage = async () => {
        try {
            // Add the user's message to the messages array
            const updatedMessages = [...messages, { role: 'user', content: message }];
            setMessages(updatedMessages);

            if (chatDialogApp) {
                chatDialogApp.addMessage('user', message);
            }

            // Send the message to the API
            const response = await apiClient.post('/chat', { model: "gemma2:2b", messages: updatedMessages });

            // Add the AI's response to the messages array
            const newMessages = [...updatedMessages, { role: 'assistant', content: response.data.message.content }];
            setMessages(newMessages);

            if (chatDialogApp) {
                chatDialogApp.addMessage('assistant', response.data.message.content);
            }

            // Clear the input field
            setMessage('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpen = () => setOpen(true);

    useEffect(() => {
        // Parse all messages into HTML
        const parsedMessages = messages.map(msg => {
            return `<strong>${msg.role}:</strong> ${marked.parse(msg.content)}`;
        }).join('<br>');

        setParsedResponse(parsedMessages);
    }, [messages]);

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
                data-testid="chat-modal-fab"
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
                        <Box sx={{ mb: 2 }}>
                            <div
                                id="chat-dialog"
                                style={{ overflowY: 'auto', height: '40vh' }}
                                dangerouslySetInnerHTML={{
                                    __html: parsedResponse,
                                }}
                            />
                        </Box>
                        <Box
                            component="form"
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
                                    onClick={() => {
                                        handleSendMessage();
                                    }}
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