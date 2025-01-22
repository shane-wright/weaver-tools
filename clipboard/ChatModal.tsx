import React, { useState, useContext } from 'react';
import { Modal, Box, TextField, Button, Fab, Typography } from '@mui/material';
import { WebSocketProvider, WebSocketContext } from '../../../context/WebSocketContext';

interface ChatModalProps {
    title: string;
    children: React.ReactNode;
    open: boolean; // Add this line
    onClose: () => void;
    onSendMessage: (message: string) => void;
  }

const ChatModal: React.FC<ChatModalProps> = ({ title, children }) => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const webSocketContext = useContext(WebSocketContext);

  const handleSendMessage = () => {
    // TO DO: implement send message logic
    if (webSocketContext) {
      webSocketContext.sendMessage(message);
      setMessage('');
    }
  };

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="open chat"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={handleToggleModal}
      >
        <span className="material-symbols-outlined">chat</span>
      </Fab>
      <Modal open={showModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '1px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box
            sx={{
              maxHeight: 200,
              overflowY: 'scroll',
              marginBottom: 2,
            }}
          >
            {webSocketContext?.messages.map((message, index) => (
              <Typography key={index} sx={{ color: 'black' }}>{message}</Typography>
            ))}
          </Box>
          <h2>{title}</h2>
          <TextField
            label="Type a message"
            value={message}
            onChange={handleInputChange}
            sx={{ width: '100%', marginBottom: 2 }}
          />
          <Button variant="contained" onClick={handleSendMessage}>
            Send
          </Button>
          {children}
        </Box>
      </Modal>
    </>
  );
};

export default ChatModal;
