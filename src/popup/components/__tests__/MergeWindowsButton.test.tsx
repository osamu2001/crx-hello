import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MergeWindowsButton from '../MergeWindowsButton';

describe('MergeWindowsButton', () => {
  const mockSetMessage = jest.fn();

  beforeEach(() => {
    mockSetMessage.mockClear();

    global.chrome = {
      windows: {
        getCurrent: jest.fn().mockResolvedValue({ id: 1 }),
        getAll: jest.fn().mockResolvedValue([
          { id: 1, tabs: [{ id: 10 }] },
          { id: 2, tabs: [{ id: 20 }, { id: 21 }] },
        ]),
      },
      tabs: {
        move: jest.fn().mockResolvedValue(undefined),
      },
    } as any;
  });

  it('統合成功時にsetMessageが呼ばれる', async () => {
    const { getByText } = render(<MergeWindowsButton setMessage={mockSetMessage} />);
    fireEvent.click(getByText('全ウィンドウのタブを統合'));

    await waitFor(() => {
      expect(global.chrome.tabs.move).toHaveBeenCalledWith(20, { windowId: 1, index: -1 });
      expect(global.chrome.tabs.move).toHaveBeenCalledWith(21, { windowId: 1, index: -1 });
      expect(mockSetMessage).toHaveBeenCalledWith('全ウィンドウのタブを統合しました');
    });
  });

  it('統合失敗時にsetMessageが呼ばれる', async () => {
    (global.chrome.windows.getAll as jest.Mock).mockRejectedValue(new Error('fail'));
    const { getByText } = render(<MergeWindowsButton setMessage={mockSetMessage} />);
    fireEvent.click(getByText('全ウィンドウのタブを統合'));

    await waitFor(() => {
      expect(mockSetMessage).toHaveBeenCalledWith('統合に失敗しました');
    });
  });
});
