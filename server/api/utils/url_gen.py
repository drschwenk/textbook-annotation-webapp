import pickle
import os


def load_book_info():
    with open('server/book_data/breakdowns.pkl', 'rb') as f:
        # book_breakdowns = pickle.load(f, encoding='latin1')
        book_breakdowns = pickle.load(f)

    with open('server/book_data/page_ranges.csv') as f:
        ranges = f.readlines()
    range_lookup = {line.split(' ')[0]:[int(num) for num in line.strip().split(' ')[1:]] for line in ranges}
    return book_breakdowns, range_lookup


def form_hit_url(book_name, page_n):
    book_name_no_ext = book_name.replace('.pdf', '_')
    base_url = 'https://s3-us-west-2.amazonaws.com/ai2-vision-turk-data/textbook-annotation-test/build/index.html'
    full_url = base_url + '?url={}{}.jpeg&id={}'.format(book_name_no_ext, page_n, page_n)
    return full_url


def make_book_group_urls(book_groups, book_group, ranges):
    def get_start_end(start_page, end_page):
        return start_page, end_page

    group_urls = []
    for tb in book_groups[book_group]:
        start, end = get_start_end(*ranges[tb])
        for page_n in range(start, end):
            group_urls.append(form_hit_url(tb, page_n))
    return group_urls
