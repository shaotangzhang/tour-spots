import { render, screen } from '@testing-library/react';
import GridView from './index';

describe('Unit test: GridView', () => {

    test('Test for rendering', () => {
        render(<GridView />);

        // Do some tests here  
          const testElement = screen.getByTestId('Grid view');
          expect(testElement).toBeInTheDocument();
    });
});
