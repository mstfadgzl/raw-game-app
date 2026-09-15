import { createPaginatedList } from '../app/utils/paginated-list';

it('retries the same page and deduplicates overlapping results', async () => {
    const fetchPage = jest.fn()
        .mockResolvedValueOnce({ results: [{ id: 1 }], next: 'page2' })
        .mockRejectedValueOnce(new Error('Offline'))
        .mockResolvedValueOnce({ results: [{ id: 1 }, { id: 2 }], next: null });
    const onChange = jest.fn();
    const list = createPaginatedList(fetchPage, onChange);
    await list.load();
    await list.load();
    await list.load();
    expect(fetchPage).toHaveBeenCalledTimes(2);
    await list.load(true);
    expect(fetchPage.mock.calls.map(call => call[0])).toEqual([1, 2, 2]);
    expect(onChange).toHaveBeenLastCalledWith({ items: [{ id: 1 }, { id: 2 }], loading: false, error: false, hasMore: false });
    await list.load();
    expect(fetchPage).toHaveBeenCalledTimes(3);
});
it('ignores responses after leaving a screen', async () => {
    let resolve!: (value: { results: { id: number }[] }) => void;
    const fetchPage = jest.fn(() => new Promise<{ results: { id: number }[] }>(done => { resolve = done; }));
    const onChange = jest.fn();
    const list = createPaginatedList(fetchPage, onChange);
    const request = list.load();
    list.dispose();
    resolve({ results: [{ id: 1 }] });
    await request;
    expect(onChange).toHaveBeenCalledTimes(1);
});
