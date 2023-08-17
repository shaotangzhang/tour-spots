import { render, screen } from '@testing-library/react';
import ListItem from '.';

describe('Unit test: GridItem', () => {

    test('Test for rendering', () => {
        const xid = 'R285416';

        render(<ListItem item={xid} onLoad={function () {

            // Do some tests here  
            const testElement = screen.getByTestId(xid);
            expect(testElement).toBeInTheDocument();

        }} />);

    });
});
