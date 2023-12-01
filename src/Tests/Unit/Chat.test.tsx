import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { PortsGlobal, LOCAL_SERVER_URL } from '../../ServerDataDefinitions';
import Chat from '../../Components/Chat';

describe('Chat Component', () => {
  const serverPort = PortsGlobal.serverPort;
  const baseURL = `${LOCAL_SERVER_URL}:${serverPort}`;

  it('renders chat component correctly', () => {
    const userName = 'Test User';
    const documentName = 'document1';

    render(<Chat documentName={documentName} userName={userName} baseURL={baseURL} />);
    expect(screen.queryByText('Chat')).not.toBeInTheDocument();
  });

  it('Send Button exists', () => {
    const userName = 'Test User';
    const documentName = 'document2';

    render(<Chat documentName={documentName} userName={userName} baseURL={baseURL} />);
    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('Type a message... in placeholder', () => {
    const documentName = 'document3';
    const userName = 'Test User';

    render(<Chat documentName={documentName} userName={userName} baseURL={baseURL} />);
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
  });

  it('user can type in the message box', () => {
    const userName = 'Test User';
    const documentName = 'document4';

    render(<Chat documentName={documentName} userName={userName} baseURL={baseURL} />);
    fireEvent.change(screen.getByPlaceholderText('Type a message...'), {
      target: { value: 'Hello, world!' },
    });
    expect(screen.getByPlaceholderText('Type a message...')).toHaveValue('Hello, world!');
  });
  
  beforeEach(() => {
    global.fetch = jest.fn((url, options) => {
      const urlString = typeof url === 'string' ? url : url.toString();
  
      if (urlString.includes('/chat/') && options && options.method === 'POST') {
        // Simulate a successful send action
        return Promise.resolve(new Response(null, { status: 200 }));
      } else if (urlString.includes('/chat/')) {
        // Simulate fetching messages, including the new 'Bitte!' message
        const mockResponse = JSON.stringify([{ user: 'Test User', message: 'Bitte!' }]);
        return Promise.resolve(new Response(mockResponse, { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
      return Promise.reject(new Error('not found'));
    });
  });

  it('Test send button is pressed', async () => {
    const userName = 'Test User';
    const message = 'Bitte!';
    const documentName = 'document5';

    render(<Chat documentName={documentName} userName={userName} baseURL={baseURL} />);
    fireEvent.change(screen.getByPlaceholderText('Type a message...'), {
      target: { value: message },
    });
    fireEvent.click(screen.getByText('Send'));
    const received = await screen.findByText('Bitte!');
    expect(received).toHaveTextContent('Bitte!');
  });
});

    
    
    
  