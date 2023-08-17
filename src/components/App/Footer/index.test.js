import { render, screen } from '@testing-library/react';
import Footer from '.';

describe('Unit test: Footer', () => {

    test('Test for rendering', () => {
        render(<Footer />);

        // Do some tests here  
          const linkElement = screen.getByText(/Copyright reserved/i);
          expect(linkElement).toBeInTheDocument();
    });
});
