declare module 'react-qr-scanner' {
  import React from 'react';

  interface QrScannerProps {
    onDecode: (result: string) => void;
    onError?: (error: Error) => void;
    constraints?: MediaTrackConstraints;
    scanDelay?: number;
    className?: string;
    style?: React.CSSProperties;
  }

  const QrScanner: React.FC<QrScannerProps>;
  export default QrScanner;
}
