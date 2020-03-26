const layout = require("../layout");

// params: products is an array with all the products we have
// 这里使用了destructure, 我们调用方程时传入的是{products:products},这里直接destructure
module.exports = ({ products }) => {
    const renderedProducts = products
        // Use map to return each product html string and form an array
        .map(product => {
            return `
      <tr>
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>
          <a href="/admin/products/${product.id}/edit">
            <button class="button is-link">
              Edit
            </button>
          </a>
        </td>
        <td>
        <form method="POST" action="/admin/products/${product.id}/delete">
            <button class="button is-danger">Delete</button>
        </form>
        </td>
      </tr>
    `;
        })
        // Join all eles of an array to a big string which includes huge html code
        .join("");

    return layout({
        content: `
      <div class="control">
        <h1 class="subtitle">Product</h1>  
        <a href="/admin/products/new" class="button is-primary">New Product</a>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          ${renderedProducts}
        </tbody>
      </table>
    `
    });
};
