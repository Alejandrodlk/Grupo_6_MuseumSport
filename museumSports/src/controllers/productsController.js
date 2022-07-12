const fs = require('fs');
const path = require('path');

const db = require('../database/models')

const toThousand = n => n.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const readJSON = () => {
    const products = JSON.parse(fs.readFileSync("src/data/products.json", 'utf-8'));	
	return products
}

const saveJSON = (e) => fs.writeFileSync("src/data/products.json" , JSON.stringify(e,null,3))

module.exports = {

    //Todos los productos
    all : (req,res) => {

        db.Category.findAll({
            include : ['athletes']
        })
            .then(products => {
                return res.send(products)
            })
            .catch(error => console.log(error))

        //////////////////////
        /* let products = readJSON()

        res.render("products" , {
            products,
            toThousand
        }) */
         //////////////////////
    },

    // Creacion de producto
    create : (req,res) => {
        
        return res.render("./admin/productAdd" , {

        })
    },

    store : (req,res) => {
       let products = readJSON()
       const {id,name,description,price,discount,image,sport,category} = req.body 
        
       const newProduct = {
           id : products[products.length -1].id +1,
           name,
           description,
           price : +price,
           discount : +discount,
           image : req.file ? req.file.filename : "default-image.png",
           sport,
           category
       }
       
       products.push(newProduct)
       saveJSON(products)

       res.redirect("/products/all")
    },

    //Edicion de producto
    edit : (req,res) => {

        let products = readJSON()
		let product = products.find(product => product.id === +req.params.id)

		return res.render("./admin/productEdit" , {
			product
		})

    },

    update: (req, res) => {
		let products = readJSON()
		const {name,price,discount,description,category,sport} = req.body

		const product = products.find(product => product.id === +req.params.id)

		const productsModify = products.map(product => {
			if (product.id === +req.params.id) {
				let productModify = {
					...product,
					name : name.trim(),
					price : +price,
					discount: +discount,
					description : description.trim(),
					image : req.file ? req.file.filename : product.image,
					category,
                    sport 	
				}	
                
				return 	productModify		
			}
			return product
		})

		saveJSON(productsModify)

		return res.redirect("/products/all")
	},

    
    //detalle de producto
    detail : (req,res) => {

        
        let products = readJSON()
		let product = products.find(product => product.id === +req.params.id)

		return res.render("productDetail" , {
			product,
            toThousand,
            priceDiscount : toThousand((product.price - (product.price * product.discount) / 100) / 6)
		})

    },

    //Carrito de compras
    cart : (req,res) => res.render("productCart"),

    

    //Eliminar producto
    remove : (req,res) => {

        let products = readJSON()

		const productsModify = products.filter(product => product.id !== +req.params.id)

		
		saveJSON(productsModify)

		return res.redirect("/products/all")

    },
}