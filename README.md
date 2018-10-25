This is the code of the GitHub Pages site containing documentation for Elastic Path's React PWA Reference Storefront.

The GitHub Pages site can be found at:

https://elasticpath.github.io/react-pwa-reference-storefront/


### Serving documentation locally for development
*Pre-req: Install Xcode & Command Line tools*

1. Install the latest version of rvm:
`\curl -sSL https://get.rvm.io | bash -s stable`
2. Install the latest version of ruby with rvm:
`rvm install ruby --latest`
3. `gem install github-pages`
4. `gem install bundler jekyll`
5. `bundle install`
6. `jekyll build`
7. `jekyll serve`
The docs are now available on `http://127.0.0.1:4000/react-pwa-reference-storefront/`
