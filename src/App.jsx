import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ClinicProvider } from './context/ClinicContext';
import { router } from './app/router';

function App() {
  return (
    <ClinicProvider>
      <RouterProvider router={router} />
    </ClinicProvider>
  );
}

export default App;
