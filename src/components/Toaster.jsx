'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export default function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{ style: { fontFamily: 'Josefin Sans', fontSize: '12px', letterSpacing: '0.05em' } }}
    />
  );
}
