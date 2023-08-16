import { render, screen } from '@testing-library/react';
import User from './index';
import { BrowserRouter } from 'react-router-dom';

describe('Unit test: User', () => {

    test('Test for rendering', () => {
        render(<BrowserRouter><User /></BrowserRouter>);

        // Do some tests here  
        //   const testElement = screen.getByText(/User/i);
        //   expect(testElement).toBeInTheDocument();
    });
});
