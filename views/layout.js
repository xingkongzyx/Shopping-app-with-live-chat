// For the user-facing layout
module.exports = ({ content }) => {
	return `
      <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Shop</title>
          <link rel="icon" href="/img/shopping.jpg">
          <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" rel="stylesheet">
          <link href="/css/main.css" rel="stylesheet">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css"></link>
        </head>
  
        <body>
          <header>
            <nav class="navbar navbar-top">
              <div class="container navbar-container">
                <div>
                  <ul class="social">
                    <li>
                      <a href=""><i class="fa fa-phone"></i>+86 178 5973 6180</a>
                    </li>
                    <li>
                      <a href=""><i class="fa fa-envelope"></i> yz298@nau.edu</a>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul class="social">
                    <li><a href="chatIndex.html"><i class="fas fa-comments"></i> Live Chat</a></li>
                    <li><a href=""><i class="fab fa-github"></i> Github Page</a></li>
                  </ul>
                </div>
              </div>
            </nav>
            <nav class="navbar navbar-bottom">
              <div class="container navbar-container">
                <div>
                  <a href="/">
                    <h3 class="title">EComm Shop - By Yuxuan Zhu</h3>
                  </a>
                </div>
                <div class="navbar-item">
                  <div class="navbar-buttons">
                    <div class="navbar-item">
                    <a href="/signin"><i class="fa fa-home" aria-hidden="true"></i> Admin Panel</a>
                    </div>
                    <div class="navbar-item">
                      <a href="/"><i class="fa fa-star"></i> Products</a>
                    </div>
                    <div class="navbar-item">
                      <a href="/cart"><i class="fa fa-shopping-cart"></i> Cart</a>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </header>
  
          ${content}
        </body>
      </html>
    `;
};
