---
layout: master
permalink: /documentation/theming/
title: Theming
weight: 4
---
Theming
====================
Theming allows you to change the HTML5 Reference Storefront's look and feel without having to modify the JavaScript.
Themes take advantage of [{less}](http://lesscss.org/), a powerful dynamic stylesheet language, chosen for its ease of use, dynamism, and widespread adoption.

Each theme is a set of individual [{less}](http://lesscss.org/) files, which, on demand, are compiled into a single `style.css`.
The core theme's {less} files are organized according to the views, which are output representations of the HTML5 Storefront's features.
For example, `cart.less` contains the CSS for the cart's view, `itemdetail.less` contains the CSS for the item's view, and so on.

By modifying the {less} files you can change the HTML5 Storefront’s look and feel and create your own themes.


Theme Directory Structure
-----------------
The image below shows HTML5 Storefront's core theme files.

![themeStructures]({{ site.baseurl  }}/documentation/img/themeStructures.png)

Compiling Themes
-----------------
`ui-storefront\Gruntfile.js` defines how and where your theme's {less} files compile.

**To compile your {less} files:**

* In a command line, navigate to the HTML5 Reference Storefront root, and run one of the following:

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

By default, {less} files compile to `ui-storefront/public/style/style.css`

**TROUBLESHOOTING NOTE:** Grunt {less} compilation issues: *throw new TypeError('Arguments to path.resolve must be strings');*
This may be related to a version conflict.   

* Try cleaning and reinstalling grunt. In your command line, navigate to the HTML5 Storefront's root directory, and run the following

      npm uninstall -g grunt-cli
      rm -rf node_modules
      npm cache clean
      npm install -g grunt-cli
      npm install grunt

* Alternatively, you may need to reinstall your HTML5 Reference Storefront. In your command line, navigate to the HTML5 Storefront's root directory, and run
`npm install`

## <a name="tutorialTheme"> </a>Tutorial: Creating a Theme
To develop your own theme, we recommend copying the core theme and then customizing it to suit your purposes.

**To create a theme based off the core theme:**

1. Copy the theme-core folder in `ui-storefront/stylesrc/theme-core`

2. Rename the copied theme folder: <code>ui-storefront/stylesrc/<b>THEME_NAME</b></code>

3. Update `ui-storefront/stylesrc/style.less` to reference the new theme:

    <pre> @import url("./<b>THEME_NAME</b>/theme-base.less");</pre>

4. Change `Gruntfile.js` to reference your {less} files in its builds:

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
6. Compile and run the HTML5 Reference Storefront.

Keep in mind:

* Image paths are relative to `ui-storefront/public/style`
* `variables.less` - Controls the look and feel for some of the Storefront's common elements, such the colors and fonts for carts, items, links, and so on.
* `mixins.less` - Embeds other CSS properties into the Storefront's general CSS classes.
* Templates - Are described in [Customizing HTML5 Features]({{ site.baseurl  }}/documentation/extending/).

{% include legal.html %}