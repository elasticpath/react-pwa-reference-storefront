Testing
====================
This is an introduction to the REACT Reference Storefront testing framework. You can invoke tests directly on the same development environment that you use to implement the REACT Reference Storefront.  


Technology
---------------------

### Unit Test
* Testem: test runner
* Mocha:  test framework
* Chai:   test assertion library
* Sinon:  test stub, mock and spy


Overview
---------------------
All of the test files are located within the `tests` folder. The exception is `testem.json`, which is located in project root folder.
<test folder structure>


Configuration to Add a New Test
---------------------
* Define the dependency path inside `test.config.js`, under `paths` property.
* Create the test file inside `specs` folder.
* Add the following test file in `testrunner.html`:

     <script type="text/javascript" charset="utf-8">
       require([
        // adds test file into test runner here
       ], runMocha);
     </script>

{% include legal.html %}
