#### Backend is hosting on port *3000*
#### Frontend is hosting on port *80 (http)* via nginx
#### Database (MongoDB) is hosting on port *27017*, but the access is restricted
#### Web-based MongoDB admin interface (access to MongoDB via web) is hosting on port *8081*. To access it, you need to get credentials  

### Table with endpoints and their description:
|   Endpoint                                 |   Function    |                                       Action                                   |
| ------------------------------------------ |:-------------:| ------------------------------------------------------------------------------:|
| /generate-dataset                          |     GET       |  Generating dataset for captcha images. Should be runned only once.            |
| /generate-captcha                          |     GET       |  Returning custom captcha from a database.                                     |
| /validateForm                              |     POST      |  Checking form via custom captcha.                                             |
| /validateForm/google                       |     POST      |  Checking form via Google reCAPTCHA v2.                                        |


### Docker Compose running containers
![Launched docker containers and images](https://i.ibb.co/5ngBQ1J/image.png) 

### Used volumes: **dbdata** and **node_modules** (node_modules is more for a quicker updating containers data)