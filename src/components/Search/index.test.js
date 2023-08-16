import { render, screen } from '@testing-library/react';
import Search from './index';
import { BrowserRouter } from 'react-router-dom';

describe('Unit test: Search', () => {

    test('Test for rendering', () => {
        render(<BrowserRouter><Search /></BrowserRouter>);

        // Do some tests here  
          const testElement = screen.getByTestId('Search page');
          expect(testElement).toBeInTheDocument();
    });
});
