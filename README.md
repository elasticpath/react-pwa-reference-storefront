This is the code of the GitHub Pages site containing documentation for Elastic Path's React PWA Reference Storefront.

The GitHub Pages site can be found at:

https://documentation.elasticpath.com/storefront-react/index.html


### Setting Up Documentation Locally
**Prerequisites**
Ensure that Xcode and Command Line Tools are installed.

1. To install the latest version of rvm, run the following command:<br>
`\curl -sSL https://get.rvm.io | bash -s stable`
2. To install the latest version of ruby with rvm, run the following command:<br>
`rvm install ruby --latest`
3. Install the GitHub pages and Jekyll. Run the following commands in order:<br>
  * `gem install github-pages`
  * `gem install bundler jekyll`
  * `bundle install`
  * `jekyll build`
  * `jekyll serve`
The documentation is now available locally at `http://127.0.0.1:4000/react-pwa-reference-storefront/`.
