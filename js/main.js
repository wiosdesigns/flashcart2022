shopPhoneNumber = "+919538065734";


_data = {};


async function init($d) {
  addEventListener('hashchange', hashChanged);
  _data = $d;
  
  _data.skus = await loadSkus();
  _data.skus.forEach((sku,i) => {_data.slugs[sku.slug] = i;});
  hashChanged();
}

async function loadSkus() {
  const response = await fetch("/skus.json");
  const l = await response.json();
  l.forEach(obj => {obj.cart = 0;});
  return l;
}

function getSku(skuSlug) {
  try {
    return _data.skus[_data.slugs[skuSlug]];  
  } catch(e) {
    return;
  }
}

function addToCart(skuSlug, n) {
  const sku = getSku(skuSlug);
  if(!sku) {
    return;
  }
  
  sku.cart += n;
  if(sku.cart<0) {
    sku.cart = 0;
  }
  
  const skuIdx = _data.slugs[skuSlug]
  if(sku.cart>0) {
    if(!_data.cart.includes(skuIdx)){    
      _data.cart.push(skuIdx);
    }
  } else if (_data.cart.includes(skuIdx)) {
    _data.cart.splice(_data.cart.indexOf(skuIdx), 1);
  }
  
  computeCartTotal();
}

function hashChanged() {
  const hash = location.hash.slice(1) || 'home';
  const chunks = hash.split("/");
  _data.route = chunks[0];
  
  if(_data.route=="product") {
    _data.psku = getSku(chunks[1]);
  }
  
  if(_data.route=="addtocart") {
    addToCart(chunks[1], 1);
    openProductPage(chunks[1]);
  }
}

function computeCartTotal() {
  _data.cartTotal = _data.cart.reduce((total, i) => {
    return total + _data.skus[i].cart*_data.skus[i].price;
  }, 0);
}

function sendOrder() {
  let text = `Hi! I would like to order the following items from ${location.hostname}:\n`;
  
  _data.cart.forEach((i) => {    
    text += `\n- ${_data.skus[i].name}: ${_data.skus[i].cart}`;
  });
  
  location.href = `https://wa.me/${shopPhoneNumber}/?text=${encodeURIComponent(text)}`;
}

function openProductPage(skuSlug) {
  location.hash = "product/"+skuSlug;
}
