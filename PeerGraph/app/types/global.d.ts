interface NeynarSignInResponse {
  is_authenticated: boolean;
  signer_uuid: string;
  fid: string;
  user: {
    // Add user properties if needed
  };
  signer_permissions: any[];
}

declare global {
    interface Window {
      onSignInSuccess: (data: NeynarSignInResponse) => void;
    }
  }
  
  export {}