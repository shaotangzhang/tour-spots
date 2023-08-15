import { render, screen } from '@testing-library/react';
import Search from './index';

describe('Unit test: Search', () => {

    test('Test for rendering', () => {
        render(<Search />);

        // Do some tests here  
          const testElement = screen.getByTestId('Search page');
          expect(testElement).toBeInTheDocument();
    });
});
