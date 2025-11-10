const express = require('express');
const app = express();
const {nanoid} = require("nanoid")


app.use(express.json());

let products = []

app.get("/produits",(req, res) => {
    res.status(200).json(products)
});

app.post("/creer",(req, res) => {
    const{name, description, price} = req.body;

    if(!name){
        return res.status(400).json({message: "nom  manquant !"})
    }
    if(!description){
        return res.status(400).json({message: "description  manquant !"})
    }
    if(!price){
        return res.status(400).json({message: "price  manquant !"})
    }

    const newProduct = {
        id: nanoid(),
        name,
        description,
        price
    };

    products.push(newProduct);

    res.status(201).json({
        message: "c'est noté",
        produit: newProduct
    })
});


app.get("/produitbyid/:id", (req, res) => {
    const produit = products.find(p => p.id == req.params.id)
    if (!produit) {
        return res.status(404).json({message: "produit non trouvé"})
    }
    return res.status(200).json(produit)
});

app.put('/modif/:id', (req, res) => {
  const resource = products.find(r => r.id === req.params.id);
  if (!resource) return res.status(404).json({error: 'Non trouvé'});
  const { name, description, price } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: {
      field: 'name',
      message: 'Le champ "name" est requis et doit être une chaîne non vide.'
    } });
  }
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return res.status(400).json({ error: {
      field: 'description',
      message: 'Le champ "description" est requis et doit être une chaîne de caractères.'
    } });
  }
  if (!price || typeof parseInt(price) !== 'number' || parseInt(price) <= 0) {
    return res.status(400).json({ error: {
      field: 'price',
      message: 'Le champ "price" est requis et doit être un nombre et supérieur à 0.'
    } });
  }
  resource.name = req.body.name.trim();
  resource.description = req.body.description.trim();
  resource.price = req.body.price;
  return res.json(resource);
});

app.delete('/items/:id', (req, res) => {
  const id = req.params.id;         
  const index = products.findIndex(i => i.id === id);  
  if (index !== -1) {
    products.splice(index, 1);                     
    res.status(200).json({message:'Item supprimer avec succes'});                    
  } else {
    res.status(404).json({ error: 'Item not found' });
  
  }
});

module.exports = app;