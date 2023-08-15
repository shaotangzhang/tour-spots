import { render, screen } from '@testing-library/react';
import Header from './index';

describe('Unit test: Header', () => {


    test('Test for rendering', () => {
        render(<Header />);

        // Do some tests here  
          const linkElement = screen.getByText(/Tour Spots/i);
          expect(linkElement).toBeInTheDocument();
    });
});
