import { describe, it, expect } from 'vitest';
import { detectContentType } from '../../services/openai';
import { detectContentType, analyzeHealth } from '../../services/openai';

describe('Content Type Detection', () => {
  it('detects scientific content', () => {
    const text = 'A recent study in Nature (2024) showed p-value < 0.05';
    expect(detectContentType(text)).toBe('scientific');
  });

  it('detects news content', () => {
    const text = 'According to CNN, new research suggests...';
    expect(detectContentType(text)).toBe('news');
  });

  it('detects social media content', () => {
    const text = '@healthexpert posted on Twitter about #wellness';
    expect(detectContentType(text)).toBe('social');
  });

  it('returns general for unspecific content', () => {
    const text = 'This is some basic text';
    expect(detectContentType(text)).toBe('general');
  });

  it('handles API errors gracefully', async () => {
    // Mock OpenAI client
    vi.mock('openai', () => ({
      default: vi.fn().mockImplementation(() => ({
        chat: {
          completions: {
            create: vi.fn().mockRejectedValue(new Error('API Error'))
          }
        }
      }))
    }));
  
    try {
      await analyzeHealth('test content');
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).toBe('API Error');
    }
  });

});