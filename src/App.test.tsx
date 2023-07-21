import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import AntimonyEditor from './AntimonyEditor';

test('renders title', () => {
  render(<App />);
  const linkElement = screen.getByText(/The Official Antimony Web Code Editor/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders editor', () => {
  render(<App />);
  expect(<AntimonyEditor />).toBeInTheDocument();
});