const { CartItem } = require('../models');

const getCart = async (userId) => {
    return await CartItem.collection()
        .where({
            'user_id': userId
        }).fetch({
            require: false,
            withRelated: ['products', 'products.mediaproperty']
        });
}

module.exports = { getCart }
