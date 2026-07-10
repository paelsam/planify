import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            border: '4px solid black',
            boxShadow: '6px 6px 0px 0px #000000',
            fontWeight: 'bold',
          },
        }}
      />
    </>
  );
}
