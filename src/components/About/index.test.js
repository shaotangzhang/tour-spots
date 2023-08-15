import { render, screen } from '@testing-library/react';
import About from './index';

describe('Unit test: About page', () => {
    test('Test for rendering', () => {
        render(<About />);

        // Do some tests here  
          const linkElement = screen.getByTestId('About page');
          expect(linkElement).toBeInTheDocument();
    });
});
