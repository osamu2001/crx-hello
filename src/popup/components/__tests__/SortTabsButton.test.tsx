import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SortTabsButton from '../SortTabsButton';

describe('SortTabsButton', () => {
  const mockSetMessage = jest.fn();

  beforeEach(() => {
    mockSetMessage.mockClear();

    global.chrome = {
      tabs: {
        query: jest.fn().mockResolvedValue([
          { id: 1, url: 'https://b.com', index: 0 },
          { id: 2, url: 'https://a.com', index: 1 },
        ]),
        move: jest.fn().mockResolvedValue(undefined),
      },
    } as any;
  });

  it('並び替え成功時にsetMessageが呼ばれる', async () => {
    const { getByText } = render(<SortTabsButton setMessage={mockSetMessage} />);
    fireEvent.click(getByText('タブをURL順に並び替え'));

    await waitFor(() => {
      expect(global.chrome.tabs.move).toHaveBeenCalled();
      expect(mockSetMessage).toHaveBeenCalledWith('タブをURL順に並び替えました');
    });
  });

  it('並び替え失敗時にsetMessageが呼ばれる', async () => {
    (global.chrome.tabs.query as jest.Mock).mockRejectedValue(new Error('fail'));
    const { getByText } = render(<SortTabsButton setMessage={mockSetMessage} />);
    fireEvent.click(getByText('タブをURL順に並び替え'));

    await waitFor(() => {
      expect(mockSetMessage).toHaveBeenCalledWith('並び替えに失敗しました');
    });
  });
});
