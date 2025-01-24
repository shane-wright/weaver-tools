import React, { useState } from "react";
import { Fab, Modal, Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const ChatModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
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
        <Box
          role="dialog" // Add role="dialog" here
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {/* Modal Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography id="chat-modal-title" variant="h6">
              Chat
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ color: "text.primary" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chat Messages (Placeholder) */}
          <Box
            id="chat-modal-description"
            sx={{
              height: 300,
              overflowY: "auto",
              border: "1px solid #ddd",
              borderRadius: 1,
              p: 2,
              mb: 2,
            }}
          >
            <Typography>Chat messages will go here.</Typography>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ChatModal;