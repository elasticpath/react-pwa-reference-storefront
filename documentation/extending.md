---
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

1. In the `src/containers` directory, create a new folder for the page.
2. Name the directory.<br/> Name of the directory and the corresponding page must be the same. For example if the name page name is `MyPage`, name of the container must also be `MyPage`.
3. In the `src/containers/<PageName>` directory, create a new `.jsx` file for the page. For example, `src/containers/MyPage/MyPage.jsx`.
4. Copy the contents of an existing page to the new page to populate the page with the required structure.
5. Name the class of page with page name.
6. In the `src/components/routes.js` directory:
	* Import the new page.
	* Define the desired routing path for the page.
7. In the `.jsx ` file of the page:
	* Update the export of your page to export the desired name of your page.
	* Add all required components and content for the page.
8. In the `src/containers/<PageName>/<PageName>.less` directory, add the required custom CSS.

## Creating New Components in React

1. In the `src/components` directory, create a new component for the page.
2. Name the directory. <br/> Name of the directory and component must be the same. For example, `mycomponent`.
3. In the `src/components/<componentName>` directory, create a new `.jsx` file for the page. For example, `src/components/mycomponent.main.jsx`.
4. Copy the contents of an existing component to the new component to populate the component with the required structure.
5. Name the class of the component with the component name.
6. In the `jsx` file of the component:
	* Update the export of your page to export the desired name of your component
	* dd all required components and content for the component.
	* Import the component to other components or pages as required.
7. In the `src/components/mycomponent.main.jsx` file, add the required custom CSS.

{% include legal.html %}
