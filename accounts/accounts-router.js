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

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  knex('accounts')
    .where({ id })
    .update(changes)
    .then(count => {
      if(count > 0) {
        res.status(200).json({ message: `${count} record(s) updated 🎉` })
      } else {
        res.status(404).json({ message: 'Account not found! 🚫' })
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: 'Error updating the account' })
    });
});

router.delete('/:id', (req, res) => {
  knex('accounts')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      res.status(200).json({ message: `${count} record(s) removed 💀` })
    })
    .catch(error => {
      console.log(error);
      res.status(200).json({ errorMessage: 'Error removing account' })
    })
})




module.exports = router;