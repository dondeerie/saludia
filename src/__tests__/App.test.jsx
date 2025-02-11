import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';  // Add this import
import { analyzeHealth } from '../services/openai';


describe('App', () => {
  it('renders the main title', () => {
    render(<App />);
    expect(screen.getByText('Welcome to Saludia')).toBeTruthy();
  });

  it('toggles dark mode', () => {
    render(<App />);
    const darkModeButton = screen.getByText(/Dark Mode/i);
    fireEvent.click(darkModeButton);
    expect(screen.getByText(/Light Mode/i)).toBeTruthy();
  });

  it('switches language and updates UI text', () => {
    render(<App />);
    const languageSelect = screen.getByRole('combobox');
    
    // Check input placeholder text
    fireEvent.change(languageSelect, { target: { value: 'es' } });
    expect(screen.getByPlaceholderText('Ingrese texto para análisis')).toBeTruthy();
    expect(screen.getByText('Analizar Texto')).toBeTruthy();
    
    fireEvent.change(languageSelect, { target: { value: 'en' } });
    expect(screen.getByPlaceholderText('Enter text for analysis')).toBeTruthy();
    expect(screen.getByText('Analyze Text')).toBeTruthy();
  });

  it('handles text input', () => {
    render(<App />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test input' } });
    expect(textarea.value).toBe('Test input');
  });

  it('switches language and updates content', () => {
    render(<App />);
    const languageSelect = screen.getByRole('combobox');
    fireEvent.change(languageSelect, { target: { value: 'es' } });
    
    expect(screen.getByText('Bienvenido a Saludia')).toBeTruthy();
    expect(screen.getByText('Analizar Texto')).toBeTruthy();
  });
  
  it('maintains analysis state when switching language', async () => {
    render(<App />);
    // Test analysis state persistence
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test content' } });
    
    const languageSelect = screen.getByRole('combobox');
    fireEvent.change(languageSelect, { target: { value: 'es' } });
    
    expect(input.value).toBe('test content');
  });

  describe('API Error Handling', () => {
    it('shows error message on API failure', async () => {
      // Mock the module
      vi.mock('../services/openai', () => ({
        analyzeHealth: vi.fn().mockRejectedValue(new Error('API Error'))
      }));
  
      render(<App />);
      const textarea = screen.getByRole('textbox');
      const analyzeButton = screen.getByText('Analyze Text');
      
      // Enter text and submit
      fireEvent.change(textarea, { 
        target: { 
          value: 'This is a test content that is longer than fifty characters to trigger analysis.' 
        } 
      });
      
      fireEvent.click(analyzeButton);
      
      // Use findByRole instead of findByText
      const errorElement = await screen.findByRole('alert');
      expect(errorElement).toHaveTextContent('An error occurred. Please try again');
  
      // Clean up
      vi.clearAllMocks();
    });
  });
});