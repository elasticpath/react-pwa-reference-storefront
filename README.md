This is the code of the GitHub Pages site containing documentation for Elastic Path's React PWA Reference Storefront.

The GitHub Pages site can be found at:

https://elasticpath.github.io/react-pwa-reference-storefront/


### Setting Up Documentation Locally
**Prerequisites** 
Ensure that Xcode and Command Line Tools are installed.

1. To install the latest version of rvm, run the following command:
`\curl -sSL https://get.rvm.io | bash -s stable`
2. To install the latest version of ruby with rvm, run the following command:
`rvm install ruby --latest`
3. Install the GitHub pages and Jekyll. Run the following commands in order:
  a). `gem install github-pages`
  b). `gem install bundler jekyll`
  c). `bundle install`
  d). `jekyll build`
  e). `jekyll serve`
The documentation is now available locally at `http://127.0.0.1:4000/react-pwa-reference-storefront/`.
