import { render, screen } from '@testing-library/react';
import Register from './index';
import { BrowserRouter } from 'react-router-dom';

describe('Unit test: Register', () => {

    test('Test for rendering', () => {
        render(<BrowserRouter><Register /></BrowserRouter>);

        // Do some tests here  
          const testElement = screen.getByText(/User Registration/i);
          expect(testElement).toBeInTheDocument();
    });
});
