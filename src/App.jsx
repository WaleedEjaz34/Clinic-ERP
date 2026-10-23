import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ClinicProvider } from './context/ClinicContext';
import { WebsiteCMSProvider } from './context/WebsiteCMSContext';
import { router } from './app/router';

function App() {
  return (
    <ClinicProvider>
      <WebsiteCMSProvider>
        <RouterProvider router={router} />
      </WebsiteCMSProvider>
    </ClinicProvider>
  );
}

export default App;
