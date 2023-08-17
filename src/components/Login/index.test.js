import { render, screen } from '@testing-library/react';
import Login from './index';
import { BrowserRouter } from 'react-router-dom';

describe('Unit test: Login page', () => {

    test('Test for rendering', () => {
        render(<BrowserRouter><Login /></BrowserRouter>);

        // Do some tests here  
        const testElement = screen.getByText(/User Login/i);
        expect(testElement).toBeInTheDocument();
    });
});
