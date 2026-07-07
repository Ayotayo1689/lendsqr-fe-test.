import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { UsersProvider } from './context/UsersContext';

function renderApp(route = '/login') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <UsersProvider>
          <App />
        </UsersProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('logs in and routes to the users page', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByRole('heading', { name: 'Users' })).toBeInTheDocument();
    expect(await screen.findByText('Grace Effiom')).toBeInTheDocument();
  });

  it('keeps protected pages behind login', async () => {
    renderApp('/users');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument();
    });
  });
});
