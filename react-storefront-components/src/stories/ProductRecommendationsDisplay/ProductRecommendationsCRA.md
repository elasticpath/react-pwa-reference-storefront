# Overview #

Component has only been tested inside the productdisplayitem.main.jsx file.  As such the prop that it expects is passed down from an http request made with the productdisplayitem.main.jsx file.  Find details of the object within the knobs tab.
Currently component parses that response and only shows the CROSSSELLS.  


# TODO's #
- Make component work for both crosssells, recommendations, and upsells resource in cortex.
- Support pagination of recommendations as component will not show all elements if API returns pagination.