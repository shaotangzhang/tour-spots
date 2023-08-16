import { render, screen } from '@testing-library/react';
import Header from '.';
import AuthStore from '../../../stores/AuthStore';
import { BrowserRouter } from 'react-router-dom';

describe('Unit test: Header', () => {

    const mockUser = {
        username: 'dummy-data'
    };

    test('Test for rendering', () => {
        render(<BrowserRouter><Header /></BrowserRouter>);

        //   const linkElement = screen.getByText(/Login/i);
        //   expect(linkElement).toBeInTheDocument();

        //   AuthStore.login(mockUser);

        //   setTimeout(() => {
        //       const linkElement = screen.getByText(/My Account/i);
        //       expect(linkElement).toBeInTheDocument();            
        //   }, 1000);
    });

});
