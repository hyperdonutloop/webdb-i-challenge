const express = require('express');

const knex = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
  knex.select('*')
    .from('accounts')
    .then(accounts => {
      res.status(200).json(accounts)
    })
    .catch(error => {
      console.log(error);
      res.status(500),json({ errorMessage: 'Error getting accounts'})
    })
})

router.post('/', (req, res) => {
  const accountData = req.body;

  knex('accounts')
    .insert(accountData, 'id')
    .then(ids => {
      const id = ids[0];

      return knex('accounts')
        .where({ id })
        .first()
        .then(account => {
          res.status(201).json(account)
        })
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: 'Error adding account' })
    })
})

module.exports = router;