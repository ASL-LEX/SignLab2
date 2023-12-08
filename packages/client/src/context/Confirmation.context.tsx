import { createContext, useContext, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Typography } from '@mui/material';

export interface ConfirmationRequest {
  message: string;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface ConfirmationContextProps {
  pushConfirmationRequest: (confirmationRequest: ConfirmationRequest) => void;
}

const ConfirmationContext = createContext<ConfirmationContextProps>({} as ConfirmationContextProps);

export interface ConfirmationProviderProps {
  children: React.ReactNode;
}

export const ConfirmationProvider: React.FC<ConfirmationProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [confirmationRequest, setConfirmationRequest] = useState<ConfirmationRequest | null>(null);


  const pushConfirmationRequest = (confirmationRequest: ConfirmationRequest) => {
    setConfirmationRequest(confirmationRequest);
    setOpen(true);
  };

  const handleConfirm = () => {
    if (confirmationRequest) {
      confirmationRequest.onConfirm();
    }
    setOpen(false);
  };

  const handleCancel = () => {
    if (confirmationRequest) {
      confirmationRequest.onCancel();
    }
    setOpen(false);
  };


  return (
    <ConfirmationContext.Provider value={{ pushConfirmationRequest }}>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
        maxWidth="xs"
        open={open}
      >
        <DialogTitle>{confirmationRequest && confirmationRequest.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmationRequest && confirmationRequest.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Ok</Button>
        </DialogActions>
      </Dialog>
      {children}
    </ConfirmationContext.Provider>
  );
}

export const useConfirmation = () => useContext(ConfirmationContext);
