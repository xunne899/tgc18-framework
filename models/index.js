const bookshelf = require("../bookshelf");

const Product = bookshelf.model("Product", {
  tableName: "products",
  mediaproperty() {
    return this.belongsTo("MediaProperty");
  },

  tags() {
    return this.belongsToMany("Tag");
  },
});

const Tag = bookshelf.model("Tag", {
  tableName: "tags",
  products() {
    return this.belongsToMany("Product");
  },
});
const MediaProperty = bookshelf.model("MediaProperty", {
  tableName: "mediaproperty",
  products() {
    return this.hasMany("Product");
  },
});

const User = bookshelf.model("User", {
  tableName: "users",
});

const CartItem = bookshelf.model('CartItem', {
  tableName: 'cart_items',
  product() {
      return this.belongsTo('Product')
  },
  user() {
    return this.belongsTo('User');
}
})


const BlacklistedToken = bookshelf.model("BlacklistedToken",{
  tableName:'blacklisted_tokens'
})

module.exports = {Product, MediaProperty, Tag, User, CartItem, BlacklistedToken};

