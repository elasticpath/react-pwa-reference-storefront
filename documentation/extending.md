---
redirect_to: "https://documentation.elasticpath.com/storefront-react/index.html"
layout: master
permalink: /documentation/extending/
title: Customization
weight: 6
---
# Extending React Reference Storefront

## React Reference Storefront Code Structure

![Directory Structure]({{ site.baseurl }}/documentation/img/directory_structure.png)
<br/><br/>

## Creating New Containers in React

1. In the `src/containers` directory, create a new directory for the page.
2. Name the directory.<br/> Name of the directory and the corresponding page must be the same. For example, if the page name is `MyPage`, name the container `MyPage`.
3. In the `src/containers/<PageName>` directory, create a new `.jsx` file for the page. <br/>For example, `src/containers/MyPage/MyPage.jsx`.
4. Populate thepage with the required structure by copying the contents of an existing page to the new page.
5. Name the class of page with page name.
6. In the `src/components/routes.js` directory:<br/>
	 a. Import the new page.<br/>
	 b. Define the desired routing path for the page.<br/>
7. In the `.jsx ` file of the page:
	* To view the changes in the storefront, update the export settings with page name.
	* Add all required components and content.
8. In the `src/containers/<PageName>/<PageName>.less` directory, add the required custom CSS.

## Creating New Components in React

1. In the `src/components` directory, create a new component for the page.
2. Name the directory. <br/> Name of the directory and component must be the same. For example, `mycomponent`.
3. In the `src/components/<componentName>` directory, create a new `.jsx` file for the page. For example, `src/components/mycomponent.main.jsx`.
4. Copy the contents of an existing component to the new component to populate the component with the required structure.
5. Name the class of the component with the component name.
6. In the `jsx` file of the component:
	* Update the export settings of the page with the component name to view the changes in the storefront.
	* Add all required components and content for the component.
	* Import the component to other components or pages as required.
7. In the `src/components/mycomponent.main.less` file, create and add any custom CSS, if any.
8. In the `src/components/mycomponent.main.jsx` file, import the custom CSS file, if any.

{% include legal.html %}
