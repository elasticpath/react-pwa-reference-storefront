Release Note Draft (release time unkown)
---------

#### Release x.xx 
>##### New Feature:
>  + creating tokenized payment method through real payment gateway (Cybersource). <sub>ref. CU-248</sub>
>
>##### Known Issue:
> + Ideally a cortex resource should be built handle the integration with specifically Cybersource. However, currently, some work around are used to build this PoC. Please note, to accommodate the work around and because time limit, this feature has some known security flaws. For example, when sending the user’s information to Cybersource, you should use SSL HTTPS connection instead.

## Setup Instruction for tokenized payment gateway feature
### setup tomcat locally
Please note, at time of writing, we haven't figured out where to host the JSP files. Will provide the location to get JSP project when the information is available.

1. setup apache tomcat on your machine
2. unzip the JSP project into webapp folder in tomcat project directory
3. navigate to conf folder, open server.xml, find the following line: 

	~~~
	<Connector port="9080" protocol="HTTP/1.1"
	      connectionTimeout="20000"
	      redirectPort="8443" />
	~~~

	change it to a port number of your choice that doesn’t collide with any other port already in use. e.g. `9080`
4. startup tomcat

### apache proxy change

Add the following lines to your apache proxy file: 
~~~
################# JSP ###################
ProxyPass /gateway http://localhost:9080/jsp
ProxyPassReverse /gateway http://localhost:9080/jsp
~~~

* The redirecting url (`http://localhost:9080`) should match your tomcat server path
* the following path (`/jsp`) should match the name of folder you unzipped into tomact webapp directory. 

###Cybersource values configuration
* The following configuration values can be found in the **storefront** project, `public/ep.config.json` file:
	* paymentGateway.receipt_page: this configuration changes where cybersource POST the result information to. Currently, it's set at root of your storefront.

* The following configuration values can be found in the JSP project. Replace these values with your cybersource account information.
	* in security.jsp you can find `SECRET_KEY` and `HMAC_SHA256` 
	* in payment_form.jsp you can find `access_key` and `profile_id`.
	
##### Find cybersource keys

* `profile_id`: can be found in Tools & Settings, under Secure Acceptance/Profiles
* `access_key` and `SECRET_KEY`: can be found by clicking on the profile you setup, and goto **Security**, click on more time on the security key. A modal will pop up for you to copy full keys.
* `HMAC_SHA256` is the **Signature Method** field on the previous step.


