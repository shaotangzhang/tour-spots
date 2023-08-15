import { render, screen } from '@testing-library/react';
import App from './index';

describe('Unit test: App page', () => {

    test('Test for rendering', () => {
        render(<App />);

        // Do some tests here  
          const testElement = screen.getByTestId('App main');
          expect(testElement).toBeInTheDocument();
    });
});
