from jinja2 import Template
import json
import os
import shutil
import yaml

skus = []
data_dir = "_data/skus/"
product_template = Template(open("product-template.html").read())
sitemap_template = Template(open("sitemap-template.xml").read())

shutil.rmtree('product', ignore_errors=True)
os.makedirs("product", exist_ok=True)

origin = "https://flashcart.wios.xyz/"

urls = [ origin ]
for f in os.listdir(data_dir):
  sku = yaml.safe_load(open(data_dir+f).read().split("---")[1])
  sku["slug"] = f.replace(".md","")
  skus.append(sku) 
  
  html = product_template.render(sku=sku)
  with open("product/"+sku["slug"]+".html", "w") as f2:
    f2.write(html)
    f2.close()
    
  urls.append(origin + "product/" + sku["slug"] + ".html") 
   
with open("sitemap.xml", "w") as f:
  f.write(sitemap_template.render(urls=urls))
  f.close()  

with open("skus.json","w") as f:
  f.write(json.dumps(skus, indent=2))
  f.close()
