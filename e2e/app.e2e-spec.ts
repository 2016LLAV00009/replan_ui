import { ReplanPage } from './app.po';

describe('replan App', () => {
  let page: ReplanPage;

  beforeEach(() => {
    page = new ReplanPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
