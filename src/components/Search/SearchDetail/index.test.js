import { render, screen } from '@testing-library/react';
import SearchDetail from './index';

describe('Unit test: SearchDetail', () => {

    test('Test for rendering', () => {
        render(<SearchDetail />);

        // Do some tests here  
          const testElement = screen.getByTestId('Search detail');
          expect(testElement).toBeInTheDocument();
    });
});
