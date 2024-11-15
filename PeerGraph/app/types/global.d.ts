declare global {
    interface Window {
      onSignInSuccess: (data: { signerUuid: string; fid: string }) => void;
    }
  }
  
  export {}