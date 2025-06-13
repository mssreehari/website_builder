import Page from '../models/Page.js';

export const createPage = async (req, res) => {
  const { title, layout } = req.body;
  const page = await Page.create({ title, layout });
  res.status(201).json(page);
};

export const getPage = async (req, res) => {
  const page = await Page.findById(req.params.id);
  res.json(page);
};
