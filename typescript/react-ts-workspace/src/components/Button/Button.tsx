import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";

// Define custom styles using MUI's `styled` utility
const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2, 4), // 16px 32px
  borderRadius: theme.shape.borderRadius,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const CustomButton: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <StyledButton variant="contained" onClick={onClick}>
      {children}
    </StyledButton>
  );
};

export default CustomButton;