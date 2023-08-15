import { render, screen } from '@testing-library/react';
import Login from './index';

describe('Unit test: Login page', () => {

    test('Test for rendering', () => {
        render(<Login />);

        // Do some tests here  
        const testElement = screen.getByText(/User Login/i);
        expect(testElement).toBeInTheDocument();
    });
});
