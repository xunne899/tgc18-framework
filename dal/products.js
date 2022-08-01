// import in the Product model
const { Product, MediaProperty, Tag } = require("../models");

async function getallMediaProperty() {
    const mediaproperties = await MediaProperty.fetchAll().map((mediaproperty) => {
    return [mediaproperty.get("id"), mediaproperty.get("name")];
  });
  return mediaproperties
}

//   async function getAllCategories() {
//     const categories = await Category.fetchAll().map(category => {
//         return [category.get('id'), category.get('name')]
//     });
//     return categories;
// }

const getAllTags = async () => {
    return await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')]);
}

const getProductByID = async (productId) => {
    return await Product.where({
        'id': parseInt(productId)
    }).fetch({
        require: true,
        withRelated: ['tags']
    });
}

module.exports = {
    getallMediaProperty, getAllTags, getProductByID
}