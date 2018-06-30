import express from 'express';
import authenticate from '../middlewares/authenticate';
import request from 'request-promise';
import { parseString } from 'xml2js';

const router = express.Router();

router.use(authenticate);

router.get('/search', (req, res) => {
  request
    .get(
      `https://www.goodreads.com/search/index.xml?key=${
        process.env.GOODREADS_KEY
      }&q=${req.query.q}`
    )
    .then(result => {
      parseString(result, (err, goodreadsResult) => {
        let books = goodreadsResult.GoodreadsResponse.search[0].results[0].work;

        res.status(200).json(
          books.map(work => ({
            goodreadsId: work.best_book[0].id[0]._,
            title: work.best_book[0].title[0],
            authors: work.best_book[0].author[0].name,
            covers: work.best_book[0].image_url[0]
          }))
        );
      });
    });
});

router.get('/fetchPages', (req, res) => {
  request
    .get(
      `https://www.goodreads.com/book/show.xml?key=${
        process.env.GOODREADS_KEY
      }&id=${req.query.q}`
    )
    .then(result => {
      parseString(result, (err, goodreadsResult) => {
        const page_num = goodreadsResult.GoodreadsResponse.book[0].num_pages[0];
        const pages = page_num ? parseInt(page_num, 10) : 0;

        res.status(200).json(pages);
      });
    });
});

export default router;
