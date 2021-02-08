#Basic REST API on Node.js

##Conditions: 
1. No external libraries should be use.
2. New users can be created, their information can be edited, and they can be deleted. We should store their name, email address, and street address.
3. Users can log in and log out by creating or destroying a token.
4. When a user is logged in, they should be able to GET all the possible menu items (these items can be hardcoded into the system).
5. A logged-in user should be able to fill a shopping cart with menu items
6. A logged-in user should be able to create an order. You should integrate with the Sandbox of Stripe.com to accept their payment.
7. When an order is placed, you should email the user a receipt. You should integrate with the sandbox of Mailgun.com for this.


##Starting and using the program
1. Go to the base directory of the project and run "node server.js". The server should run on the PORT specified in the config.js file (3000/5000). 
2. Manage users - endpoint {host}:{port}/users
   1. Create user - Use POST method. You have to provide the following required fields in the body:  {firstname, lastName, streetAddress, password, email}.
   2. Edit user - Use PUT method. You have to provide email and at least one field in the body to edit. Email is not editable. The user should be authenticated.
   3. Delete user - Use DELETE method. You have to provide email as query param. The user should be authenticated.
3. Authenticate / Login users - endpoint {host}:{port}/login
   1. Login user - Use POST method. You have to provide email and password. The call returns id param which should be used to authenticate user. 
      Every call that need authentication should have header {token: id}.
   2. Extend login token - Use PUT method. You have to provide email and {shouldExtend: true} flag in the body. Every token have default expiration time of 1 hour.
      Every request will extend the token with 1 hour. The user should be authenticated.
4. Logout - endpoint {host}:{port}/logout
   1. Logout user - Use GET method. You have to provide email as query params. The user should be authenticated. This action will remove the token from the folder,
      also will remove all, if any, orders that the user currently have.
5. Get menu items - endpoint {host}:{port}/menu-items
   1. Get menu items -  Use GET method. You have to provide email as query params. This will return all the possible menu item to chose from when creating an order.
      The user should be authenticated.
6. Adding and removing orders - {host}:{port}/cart
   1. Add to cart - Use POST method. You have to provide email and order in the body. The order should be array from the product you want to order. The possible values are string
      with the product name. You can see the menu items for the available values. If unknown value is provide it is removed from the order. The endpoint return 
      orderId which should be used to remove or pay/create the order. The user should be authenticated.
   2. Remove order - Use DELETE method. You have to provide email and orderId as query params. The user should be authenticated.
7. Creating/paying order -  {host}:{port}/order
   1. Use POST method. You have to provide email and orderId in the body. The user should be authenticated.
   
####Note: 
For paying the order is used BGN (my local currency). To fully test the API I have created email with testing purposes. You can find the account in the config.js
I strongly advice to use this account for testing for you to see the invoice send by mailgun. Mailgun let only predefined email to be used in the sandbox. 

####Note:
A postman collection is provided for testing usage. 
