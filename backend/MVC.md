- Models (BaseModel.js):
Handles data structure and basic data operations
Includes timestamps for created and updated dates
Provides JSON serialization


- Controllers (BaseController.js):
Handles HTTP requests and responses
Implements CRUD operations (Create, Read, Update, Delete)
Manages error handling and status codes


- Routes (baseRoutes.js):
Defines API endpoints
Maps HTTP methods to controller actions
Uses Express Router for route management   


- Services (BaseService.js):
Contains business logic
Handles data validation
Provides pre and post-processing hooks
Manages complex operations