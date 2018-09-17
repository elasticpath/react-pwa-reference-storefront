---
layout: master
permalink: /documentation/theming/
title: Theming
weight: 4
---
Themes
====================
You can use themes to change the REACT Reference Storefront's look and feel without having to modify the JavaScript.
Themes take advantage of [{less}](http://lesscss.org/), a powerful dynamic stylesheet language. [{less}](http://lesscss.org/) is chosen for its ease of use, dynamism, and widespread adoption.

Each theme is a set of individual [{less}](http://lesscss.org/) files. On demand, you can compile the files into a single `style.css` file.
The core theme's {less} files are organized according to the views, which are output representations of the REACT Reference Storefront's features.
For example, `cart.less` contains the CSS for the cart's view, and `itemdetail.less` contains the CSS for the item's view.

Modifying the {less} files you can change the REACT Reference Storefront’s look and feel, and create your own themes.


Theme Directory Structure
-----------------
The following image shows REACT Reference Storefront's core theme files.

![themeStructures]({{ site.baseurl  }}/documentation/img/themeStructures.png)

Compiling Themes
-----------------
`ui-storefront\Gruntfile.js` defines how and where your theme's {less} files compile.

**To compile your {less} files:**

* In a command line, navigate to the REACT Reference Storefront root directory.  Run one of the following commands:

<table>
<tbody>
  <tr align="center">
    <th align="center" valign="middle">Command</th>
    <th align="center" valign="middle">Definition</th>
  </tr>
  <tr>
    <td><code>grunt less</code></td>
    <td>Compiles {less} files into style.css.</td>
  </tr>
  <tr>
    <td><code>grunt watch</code></td>
    <td>Sets Grunt to watch {less} files for changes and immediately compiles the style.css when a change is detected.</td>
  </tr>
</tbody>
</table>

By default, {less} files compile to `ui-storefront/public/style/style.css`.

**TROUBLESHOOTING NOTE:** Grunt {less} compilation issues: *throw new TypeError('Arguments to path.resolve must be strings');*
This may be related to a version conflict.

* Clean and reinstall grunt. 
    ** In your command line, navigate to the REACT Reference Storefront's root directory. Run the following command:

      npm uninstall -g grunt-cli
      rm -rf node_modules
      npm cache clean
      npm install -g grunt-cli
      npm install grunt

* Alternatively, you might want to reinstall your REACT Reference Storefront. 
  ** In your command line, navigate to the REACT Reference Storefront's root directory. Run `npm install`.

## <a name="tutorialTheme"> </a>Tutorial: Creating a Theme
To develop your own theme, we recommend copying the core theme and then customizing it to suit your purposes.

**To create a theme based off the core theme:**

1. Copy the theme-core folder in `ui-storefront/stylesrc/theme-core`.

2. Rename the copied theme folder: <code>ui-storefront/stylesrc/<b>THEME_NAME</b></code>

3. Update `ui-storefront/stylesrc/style.less` to reference the new theme:

    <pre> @import url("./<b>THEME_NAME</b>/theme-base.less");</pre>

4. Change `Gruntfile.js` to reference your {less} files in the build process:

    <pre>
    less: {
    development: {
    files: {
    "public/style/style.css": "stylesrc/style.less"
    }}},
    watch: {
    scripts:{
    files: ['stylesrc/<b>THEME_NAME</b>/*.less'],
    tasks: ['less']
    }}</pre>

5. Code your CSS.
6. Compile and run the REACT Reference Storefront.

Keep in mind:

* Image paths are relative to `ui-storefront/public/style`.
* `variables.less` - This controls the look and feel for some of the REACT Reference Storefront's common elements, such the colors and fonts for carts, items, links, etc.
* `mixins.less` - This embeds other CSS properties into the REACT Reference Storefront's general CSS classes.
* Templates - Are described in [Customizing HTML5 Features]({{ site.baseurl  }}/documentation/extending/).

{% include legal.html %}
