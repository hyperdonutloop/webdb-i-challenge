const express = require('express');

const knex = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
  knex.select('*')
    .from('accounts')
    .orderBy('name') // added in this as a stretch goal
    .then(accounts => {
      res.status(200).json(accounts)
    })
    .catch(error => {
      console.log(error);
      res.status(500),json({ errorMessage: 'Error getting accounts'})
    })
})

router.get('/:id', (req, res) => {
  knex.select('*')
    .from('accounts')
    .where({ id: req.params.id })
    .first()
    .then (account => {
      res.status(200).json(account)
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: 'Error getting the specified account' })
    })
})

router.post('/', validateAccount, (req, res) => {
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

// custom middleware to Validate whether or not there is a name and budget on POST request.
// was not able to figure out how to add this in the POST, so added it here

function validateAccount(req, res, next) {
  const accountInfo = req.body;
  if (!accountInfo.name || !accountInfo.budget) {
    res.status(400).json({ errorMessage: 'Please provide name and budget for account' })
  } else {
    next();
  }
}


module.exports = router;