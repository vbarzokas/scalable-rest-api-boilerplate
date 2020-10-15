module.exports = {
  products: [
    {
      _id: 1,
      name: 'sample-product-1',
      price: 10
    },
    {
      _id: 2,
      name: 'sample-product-2',
      price: 20
    },
    {
      _id: 3,
      name: 'sample-product-3',
      price: 30
    }
  ],
  orders: [
    {
      _id: 1,
      items: [
        {
          productId: 1,
          productPrice: 10,
          quantity: 2
        }
      ],
      totalPrice: 20
    }
  ]
};
