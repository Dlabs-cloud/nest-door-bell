**Auth Service Door Bell**

![enter image description here](https://previews.123rf.com/images/smartbobert/smartbobert1706/smartbobert170600065/80225628-old-vintage-door-bell-button-on-grunge-wall-antique-door-bell.jpg)  
**Nest Door bell** is a nest js api wrapper for Dlabs authnetication service API. It handles all authentication to all
Dlabs Services services.

# Table of Contents

- [Nest Door Bell](#nestjs-early-starter)
- [Table of Contents](#table-of-contents)
- [Usage](#usage)
    - [Installation](#installation)
    - [DoorBellModule](#DoorBellModule)
    - [Decorators](#decorators)
- [Todos](#todos)

### Installation

dlabs-nest-door-bell is a private repository, this means to install, you must have access to
the [Nest Door bell repository](https://github.com/Dlabs-cloud/nest-door-bell) .

Generate an access token for your repo once you have access, the token should have at least read package permission
scope. If all this has been accertained, then create a `.npmrc` file of the project and add the package registry.

Your .npmrc should contain this

    //npm.pkg.github.com/:_authToken=GENERATED_TOKEN 
    @dlabs-cloud:registry=https://npm.pkg.github.com  

After all this has been done simple install package with

     npm install @dlabs-cloud/nest-door-bell  

### DoorBellModule

DoorBellModule is the core of the package, it serves as the main entry point.   
Simple import the `DoorBellModule` into your application and add the `forRoot` config

     DoorBellModule.forRoot({basePath: config.get('services.auth-service-url') as any,
     }),  

### Decorators

After installing the package all created routes are automatically guarded. To keep the route open for all request simple
add the `@AnonymousUser()` decorator to the controller or the method.

### Todos

There is a need for better test covorage.
