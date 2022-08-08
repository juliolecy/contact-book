const Contact = require('../models/ContactModel')

exports.index = async(req, res) => {
  const contacts = await Contact.searchContacs();
  res.render('index', {contacts})
};

