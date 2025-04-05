import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import CopyAllUrlsButton from '../CopyAllUrlsButton';

describe('CopyAllUrlsButton', () => {
  const mockSetMessage = jest.fn();

  beforeEach(() => {
    mockSetMessage.mockClear();

    global.chrome = {
      tabs: {
        query: jest.fn().mockResolvedValue([
          { url: 'https://a.com' },
          { url: 'https://b.com' },
        ]),
      },
    } as any;

    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('コピー成功時にsetMessageが呼ばれる', async () => {
    const { getByText } = render(<CopyAllUrlsButton setMessage={mockSetMessage} />);
    fireEvent.click(getByText('URL一覧コピー'));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://a.com\nhttps://b.com');
      expect(mockSetMessage).toHaveBeenCalledWith('アクティブなタブのURLをコピーしました');
    });
  });

  it('コピー失敗時にsetMessageが呼ばれる', async () => {
    (global.chrome.tabs.query as jest.Mock).mockRejectedValue(new Error('fail'));
    const { getByText } = render(<CopyAllUrlsButton setMessage={mockSetMessage} />);
    fireEvent.click(getByText('URL一覧コピー'));

    await waitFor(() => {
      expect(mockSetMessage).toHaveBeenCalledWith('コピーに失敗しました');
    });
  });
});
